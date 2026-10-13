import React from 'react';
import { X, CheckCircle2, QrCode, Key, ShieldCheck, IndianRupee, MapPin, Phone, ArrowRight } from 'lucide-react';

export default function BookingSuccessModal({
  isOpen,
  onClose,
  booking,
  onViewKafkaEvents,
}) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-slate-900 p-6 text-center border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10 animate-pulse" />
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
            Booking Confirmed & Paid
          </span>
          <h2 className="text-2xl font-black text-white mt-2">Reservation Voucher</h2>
          <p className="text-xs text-slate-400 mt-1">Transaction recorded in MongoDB & Kafka Stream</p>
        </div>

        {/* Voucher Body */}
        <div className="p-6 space-y-5">
          {/* OTP Box */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-950 to-emerald-500/10 p-4 rounded-xl border border-amber-500/30 text-center">
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Vehicle Handover OTP
            </p>
            <div className="my-2">
              <span className="text-4xl font-mono font-black text-white tracking-[0.3em] bg-slate-900 px-6 py-1.5 rounded-lg border border-slate-700 inline-block shadow-inner">
                {booking.pickupOtp}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Share this 4-digit code with the host at vehicle pickup to release keys.
            </p>
          </div>

          {/* Booking Data Grid */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-850">
              <span className="font-bold text-white">{booking.vehicleTitle}</span>
              <span className="font-mono text-amber-400 font-bold">{booking.vehicleRegistrationNumber}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Renter:</span>
              <span className="text-white font-medium">{booking.renterName} ({booking.renterPhone})</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>UPI Transaction ID:</span>
              <span className="font-mono text-emerald-400 truncate max-w-[200px]">{booking.paymentTransactionId}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Paid (incl. 5% GST):</span>
              <span className="text-white font-bold">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Refundable Escrow Deposit:</span>
              <span className="text-emerald-400 font-bold">₹{booking.securityDeposit?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Deposit Refund Note */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start space-x-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your security deposit is safely held in escrow. Post-trip, after fuel and challan verification, it will be automatically returned to your original UPI account.
            </span>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              Done & Return to Explorer
            </button>

            <button
              onClick={onViewKafkaEvents}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
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
