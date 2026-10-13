import React from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function BookingSuccessModal({
  isOpen,
  onClose,
  booking,
  onViewKafkaEvents,
}) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-muted/40 p-6 text-center border-b border-border relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle2 className="w-10 h-10 animate-pulse" />
          </div>

          <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-accent text-accent-foreground border border-primary/20 uppercase tracking-wider">
            Booking Confirmed & Paid
          </span>
          <h2 className="text-2xl font-black text-foreground mt-2 font-display">Reservation Voucher</h2>
          <p className="text-xs text-muted-foreground mt-1">Transaction recorded in MongoDB & Kafka Stream</p>
        </div>

        {/* Voucher Body */}
        <div className="p-6 space-y-5">
          {/* OTP Box */}
          <div className="bg-accent/30 p-4 rounded-xl border border-primary/20 text-center">
            <p className="text-xs font-bold text-accent-foreground uppercase tracking-wider">
              Vehicle Handover OTP
            </p>
            <div className="my-2">
              <span className="text-4xl font-mono font-black text-foreground tracking-[0.3em] bg-card px-6 py-1.5 rounded-xl border border-border inline-block shadow-xs">
                {booking.pickupOtp}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Share this 4-digit code with the host at vehicle pickup to release keys.
            </p>
          </div>

          {/* Booking Data Grid */}
          <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="font-bold text-foreground font-display">{booking.vehicleTitle}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-300 text-slate-950 font-bold border border-amber-400">
                {booking.vehicleRegistrationNumber}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Renter:</span>
              <span className="text-foreground font-medium">{booking.renterName} ({booking.renterPhone})</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>UPI Transaction ID:</span>
              <span className="font-mono text-foreground font-bold truncate max-w-[200px]">{booking.paymentTransactionId}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Total Paid (incl. 5% GST):</span>
              <span className="text-foreground font-bold">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Refundable Escrow Deposit:</span>
              <span className="text-primary font-bold">₹{booking.securityDeposit?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Deposit Refund Note */}
          <div className="p-3 bg-muted/20 rounded-xl border border-border flex items-start space-x-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              Your security deposit is safely held in escrow. Post-trip, after fuel and challan verification, it will be automatically returned to your original UPI account.
            </span>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs shadow-glow hover:opacity-95 transition cursor-pointer"
            >
              Done & Return to Explorer
            </button>

            <button
              onClick={onViewKafkaEvents}
              className="w-full py-2.5 px-4 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <span>View Kafka Domain Events Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
