import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { TransactionModel, FinanceSummaryModel } from './models/transaction.model';
import { TransactionFilterInput } from './dto/transaction.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getTransactionHistory(
    user?: any,
    filter?: TransactionFilterInput,
  ): Promise<TransactionModel[]> {
    const bookings = await this.bookingModel.find().sort({ createdAt: -1 }).exec();
    const transactions: TransactionModel[] = [];

    for (const b of bookings as any[]) {
      const bookingId = b._id.toString();
      const createdAt = b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString();
      const updatedAt = b.updatedAt ? new Date(b.updatedAt).toISOString() : createdAt;

      // 1. Primary Rental Trip Payment
      const rentalCharge = Math.max(0, (b.totalAmount || 0) - (b.securityDeposit || 0));
      transactions.push({
        id: `txn_pay_${bookingId}`,
        transactionId: b.paymentTransactionId || `UPI/NPCI/2026/${bookingId.slice(-6)}`,
        bookingId,
        vehicleTitle: b.vehicleTitle,
        vehicleRegistrationNumber: b.vehicleRegistrationNumber,
        type: 'BOOKING_PAYMENT',
        amount: rentalCharge,
        flow: 'DEBIT',
        paymentMethod: b.paymentMethod || 'UPI_GPAY',
        status: b.paymentStatus === 'PAID' ? 'SUCCESS' : b.paymentStatus || 'PENDING',
        partyName: b.renterName,
        partyPhone: b.renterPhone,
        partyRole: 'RENTER',
        description: `Self-Drive Rental Charge (${b.totalDays} day${b.totalDays > 1 ? 's' : ''}) + 5% GST`,
        createdAt,
      });

      // 2. Refundable Security Deposit (Held in Escrow)
      if (b.securityDeposit && b.securityDeposit > 0) {
        transactions.push({
          id: `txn_esc_${bookingId}`,
          transactionId: `ESCROW/HOLD/${bookingId.slice(-8).toUpperCase()}`,
          bookingId,
          vehicleTitle: b.vehicleTitle,
          vehicleRegistrationNumber: b.vehicleRegistrationNumber,
          type: 'ESCROW_HOLD',
          amount: b.securityDeposit,
          flow: 'ESCROW_HELD',
          paymentMethod: 'UPI_ESCROW_LOCK',
          status: b.depositStatus === 'HELD_IN_ESCROW' ? 'HELD_IN_ESCROW' : 'SETTLED',
          partyName: b.renterName,
          partyPhone: b.renterPhone,
          partyRole: 'RENTER',
          description: 'Refundable Security Deposit Held in RBI-Compliant Escrow',
          createdAt,
        });

        // 3. Security Deposit Refund Settlement (if released or partially deducted)
        if (b.depositStatus === 'REFUNDED_FULL' || b.depositStatus === 'DEDUCTED_PARTIAL') {
          transactions.push({
            id: `txn_ref_${bookingId}`,
            transactionId: b.depositRefundTxnId || `UPI/REFUND/${bookingId.slice(-8).toUpperCase()}`,
            bookingId,
            vehicleTitle: b.vehicleTitle,
            vehicleRegistrationNumber: b.vehicleRegistrationNumber,
            type: 'ESCROW_REFUND',
            amount: b.securityDeposit,
            flow: 'CREDIT',
            paymentMethod: 'UPI_AUTO_REFUND',
            status: 'REFUNDED',
            partyName: b.renterName,
            partyPhone: b.renterPhone,
            partyRole: 'RENTER',
            description: b.depositDeductionReason
              ? `Security Deposit Settled (${b.depositDeductionReason})`
              : 'Full Security Deposit Released & Refunded to Source UPI Account',
            createdAt: updatedAt,
          });
        }
      }

      // 4. Host Earnings Payout (85% net host share)
      const hostPayout = Math.round((b.basePrice || 500) * 0.85);
      transactions.push({
        id: `txn_payout_${bookingId}`,
        transactionId: `PAYOUT/IMPS/${bookingId.slice(-8).toUpperCase()}`,
        bookingId,
        vehicleTitle: b.vehicleTitle,
        vehicleRegistrationNumber: b.vehicleRegistrationNumber,
        type: 'HOST_PAYOUT',
        amount: hostPayout,
        flow: 'CREDIT',
        paymentMethod: 'IMPS_DIRECT_UPI',
        status: b.tripStatus === 'COMPLETED' ? 'SUCCESS' : 'PENDING_TRIP_END',
        partyName: b.hostName,
        partyPhone: b.hostPhone,
        partyRole: 'HOST',
        description: 'Net Host Payout (85% earnings after 15% platform commission)',
        createdAt,
      });
    }

    // Role-based visibility filtering
    let filtered = transactions;
    if (user && user.role !== 'ADMIN') {
      if (user.role === 'HOST') {
        filtered = transactions.filter(
          (t) =>
            t.partyRole === 'HOST' ||
            (user.name && t.partyName?.toLowerCase() === user.name?.toLowerCase()) ||
            (user.phone && t.partyPhone === user.phone),
        );
      } else {
        // RENTER role
        filtered = transactions.filter(
          (t) =>
            t.partyRole === 'RENTER' &&
            ((user.phone && t.partyPhone === user.phone) ||
              (user.name && t.partyName?.toLowerCase() === user.name?.toLowerCase())),
        );
      }
    }

    // Optional query filters
    if (filter?.type && filter.type !== 'ALL') {
      filtered = filtered.filter((t) => t.type === filter.type);
    }

    if (filter?.status && filter.status !== 'ALL') {
      filtered = filtered.filter((t) => t.status === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(q) ||
          t.vehicleTitle.toLowerCase().includes(q) ||
          t.vehicleRegistrationNumber.toLowerCase().includes(q) ||
          t.partyName.toLowerCase().includes(q),
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getFinanceSummary(user?: any): Promise<FinanceSummaryModel> {
    const history = await this.getTransactionHistory(user);

    let totalSpent = 0;
    let totalEarned = 0;
    let escrowHeld = 0;
    let escrowRefunded = 0;

    for (const t of history) {
      if (t.type === 'BOOKING_PAYMENT' && t.status === 'SUCCESS') {
        totalSpent += t.amount;
      }
      if (t.type === 'HOST_PAYOUT' && t.status === 'SUCCESS') {
        totalEarned += t.amount;
      }
      if (t.type === 'ESCROW_HOLD' && t.status === 'HELD_IN_ESCROW') {
        escrowHeld += t.amount;
      }
      if (t.type === 'ESCROW_REFUND') {
        escrowRefunded += t.amount;
      }
    }

    return {
      totalSpent,
      totalEarned,
      escrowHeld,
      escrowRefunded,
      totalTransactions: history.length,
    };
  }
}
