import React, { useState } from 'react';
import { X, ShieldCheck, IndianRupee, QrCode, Smartphone, CreditCard, Check, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export default function BookingPaymentModal({
  isOpen,
  onClose,
  bookingData,
  onSubmitBookingMutation,
  onBookingSuccess,
  isSubmitting,
}) {
  const [paymentMethod, setPaymentMethod] = useState('UPI_GPAY');
  const [agreementChecked, setAgreementChecked] = useState(true);
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !bookingData) return null;

  const vehicle = bookingData.vehicle;

  const handlePay = async () => {
    if (!agreementChecked) {
      alert('Please accept the digital rental agreement.');
      return;
    }

    setProcessing(true);

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (bookingData.totalDays || 1));

      const input = {
        vehicleId: vehicle.id,
        renterName: bookingData.renterName,
        renterPhone: bookingData.renterPhone,
        renterEmail: bookingData.renterEmail,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalDays: bookingData.totalDays,
        pickupType: bookingData.pickupType,
        deliveryAddress: vehicle.areaHub,
        paymentMethod,
      };

      const result = await onSubmitBookingMutation(input);
      setProcessing(false);
      onBookingSuccess(result);
    } catch (err) {
      setProcessing(false);
      alert('Booking error: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Secure Checkout & UPI Pay</h3>
              <p className="text-[11px] text-slate-400">128-Bit NPCI Encrypted Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-850">
              <span className="font-bold text-white text-sm">{vehicle.title}</span>
              <span className="font-mono text-amber-400 font-bold">{vehicle.registrationNumber}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Rental Period:</span>
              <span className="text-white">{bookingData.totalDays} Days ({bookingData.pickupType === 'HUB_PICKUP' ? 'Hub Pickup' : 'Doorstep'})</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Renter / KYC:</span>
              <span className="text-white font-medium">{bookingData.renterName} (Verified)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Refundable Security Deposit:</span>
              <span className="text-emerald-400 font-bold">₹{bookingData.securityDeposit} (In Escrow)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm font-bold text-white">
              <span>Total Payable Amount</span>
              <span className="text-base text-emerald-400 font-extrabold">₹{bookingData.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'UPI_GPAY', name: 'Google Pay (UPI)', icon: '📱' },
                { id: 'UPI_PHONEPE', name: 'PhonePe (UPI)', icon: '🟣' },
                { id: 'UPI_PAYTM', name: 'Paytm UPI / Wallet', icon: '🔵' },
                { id: 'UPI_BHIM_QR', name: 'BHIM Dynamic QR', icon: '📷' },
                { id: 'CREDIT_DEBIT_CARD', name: 'Credit / Debit Card', icon: '💳' },
                { id: 'NET_BANKING', name: 'Net Banking (All Banks)', icon: '🏛️' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center space-x-2 ${
                    paymentMethod === m.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="truncate">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* UPI ID / QR Preview */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <QrCode className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="font-bold text-white">Instant UPI Auto-Debit & Escrow</p>
                <p className="text-[10px] text-slate-400">Zero surcharge on UPI transactions</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
              Verified Merchant
            </span>
          </div>

          {/* Digital Bailee Lease Agreement */}
          <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 mt-0.5"
              />
              <span className="text-[11px] text-slate-300 leading-snug">
                I accept the <strong className="text-white">Digital Vehicle Rental & Bailment Agreement</strong> under the Indian Contract Act 1872. I agree to pay any e-challans or toll charges incurred during my trip.
              </span>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={processing || isSubmitting}
            onClick={handlePay}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
          >
            <span>
              {processing || isSubmitting
                ? 'Processing Payment & Emitting Kafka Event...'
                : `Pay ₹${bookingData.grandTotal.toLocaleString('en-IN')} & Confirm Reservation`}
            </span>
            {!processing && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
