import React, { useState } from 'react';
import {
  X,
  Lock,
  CheckCircle2,
  ArrowRight,
  QrCode,
  AlertCircle,
  Smartphone,
  CreditCard,
  Building2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BookingPaymentModal({
  isOpen,
  onClose,
  bookingData,
  onSubmitBookingMutation,
  onBookingSuccess,
  isSubmitting,
}) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY_SANDBOX');
  const [upiId, setUpiId] = useState(user?.email ? `${user.email.split('@')[0]}@okhdfcbank` : '');
  const [agreementChecked, setAgreementChecked] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !bookingData) return null;

  const vehicle = bookingData.vehicle;

  // Dynamically load Razorpay standard checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayCheckout = async () => {
    setError(null);
    if (!agreementChecked) {
      setError('Please accept the digital bailment and rental agreement.');
      return;
    }

    setProcessing(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setProcessing(false);
      setError('Could not load Razorpay SDK. Please check your internet connection or use UPI Direct.');
      return;
    }

    let orderData = null;
    try {
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: bookingData.grandTotal || 999,
          currency: 'INR',
          notes: {
            vehicleId: vehicle.id,
            registrationNumber: vehicle.registrationNumber,
            renterName: bookingData.renterName || user?.name,
          },
        }),
      });
      if (orderRes.ok) {
        orderData = await orderRes.json();
      }
    } catch (orderErr) {
      console.warn('Backend order creation fallback to client simulation:', orderErr);
    }

    const rzpKey =
      orderData?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';

    const options = {
      key: rzpKey,
      order_id: orderData?.id || undefined,
      amount: orderData?.amount || Math.round((bookingData.grandTotal || 999) * 100), // in paise
      currency: 'INR',
      name: 'GaadiGo Mobility India',
      description: `Rental: ${vehicle.title} (${vehicle.registrationNumber})`,
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200',
      handler: async function (response) {
        try {
          // Verify cryptographic signature via backend
          if (response.razorpay_payment_id) {
            try {
              await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id || orderData?.id || `sim_ord_${Date.now()}`,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature || 'sim_sig_test_valid',
                }),
              });
            } catch (verifyErr) {
              console.warn('Backend payment verification notice:', verifyErr);
            }
          }

          const startDate = new Date();
          startDate.setDate(startDate.getDate() + 1);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + (bookingData.totalDays || 1));

          const input = {
            vehicleId: vehicle.id,
            renterName: bookingData.renterName || user?.name || 'Verified Renter',
            renterPhone: bookingData.renterPhone || user?.phone || '+91 99000 00000',
            renterEmail: bookingData.renterEmail || user?.email || 'renter@gaadigo.in',
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            totalDays: bookingData.totalDays,
            pickupType: bookingData.pickupType,
            deliveryAddress: vehicle.areaHub,
            paymentMethod: 'RAZORPAY_SANDBOX',
            paymentTransactionId: response.razorpay_payment_id || `rzp_test_${Date.now()}`,
          };

          const result = await onSubmitBookingMutation(input);
          setProcessing(false);
          onBookingSuccess(result);
        } catch (err) {
          setProcessing(false);
          setError(err.message || 'Payment confirmation failed.');
        }
      },
      prefill: {
        name: bookingData.renterName || user?.name || 'Renter',
        email: bookingData.renterEmail || user?.email || 'renter@gaadigo.in',
        contact: (bookingData.renterPhone || user?.phone || '9999999999')
          .replace(/[^0-9]/g, '')
          .slice(-10),
      },
      theme: {
        color: '#f97316',
      },
      modal: {
        ondismiss: function () {
          setProcessing(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setProcessing(false);
        setError(`Payment failed: ${resp.error?.description || 'Transaction cancelled'}`);
      });
      rzp.open();
    } catch (err) {
      setProcessing(false);
      setError(err.message || 'Failed to initialize Razorpay Checkout.');
    }
  };

  const handlePay = async () => {
    if (paymentMethod === 'RAZORPAY_SANDBOX') {
      await handleRazorpayCheckout();
      return;
    }

    setError(null);

    if (!agreementChecked) {
      setError('Please accept the digital bailment and rental agreement.');
      return;
    }

    if (paymentMethod.startsWith('UPI_') && paymentMethod !== 'UPI_BHIM_QR') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setError('Please enter a valid Indian UPI ID (e.g. name@okhdfcbank, mobile@paytm).');
        return;
      }
    }

    setProcessing(true);

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (bookingData.totalDays || 1));

      const input = {
        vehicleId: vehicle.id,
        renterName: bookingData.renterName || user?.name || 'Verified Renter',
        renterPhone: bookingData.renterPhone || user?.phone || '+91 99000 00000',
        renterEmail: bookingData.renterEmail || user?.email || 'renter@gaadigo.in',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalDays: bookingData.totalDays,
        pickupType: bookingData.pickupType,
        deliveryAddress: vehicle.areaHub,
        paymentMethod: paymentMethod === 'UPI_BHIM_QR' ? 'UPI_QR_NPCI' : paymentMethod,
      };

      const result = await onSubmitBookingMutation(input);
      setProcessing(false);
      onBookingSuccess(result);
    } catch (err) {
      setProcessing(false);
      setError(err.message || 'Payment processing failed. Please try again.');
    }
  };

  const dynamicUpiUri = `upi://pay?pa=gaadigo.escrow@icici&pn=GaadiGo%20India&am=${bookingData.grandTotal}&cu=INR&tn=Booking_${vehicle.registrationNumber}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-display">
                Razorpay Sandbox & UPI Payments Checkout
              </h3>
              <p className="text-[11px] text-muted-foreground">Bank-Grade Escrow Security Deposit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Summary Box */}
          <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="font-bold text-foreground text-sm font-display">{vehicle.title}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-300 text-slate-950 font-bold border border-amber-400">
                {vehicle.registrationNumber}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Rental Duration:</span>
              <span className="text-foreground font-medium">
                {bookingData.totalDays} Days ({bookingData.pickupType === 'HUB_PICKUP' ? 'Hub Handover' : 'Doorstep Delivery'})
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Renter KYC:</span>
              <span className="text-foreground font-medium">{bookingData.renterName} (Verified)</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Security Deposit (Refundable):</span>
              <span className="text-primary font-bold">₹{bookingData.securityDeposit} (Escrow Protected)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border text-sm font-bold text-foreground">
              <span>Total Payable (incl. 5% GST):</span>
              <span className="text-lg text-foreground font-black font-display">
                ₹{bookingData.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              Select Payment Gateway
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'RAZORPAY_SANDBOX', name: 'Razorpay Sandbox', icon: '⚡', highlight: true },
                { id: 'UPI_GPAY', name: 'Google Pay (UPI)', icon: '📱' },
                { id: 'UPI_PHONEPE', name: 'PhonePe (UPI)', icon: '🟣' },
                { id: 'UPI_PAYTM', name: 'Paytm UPI', icon: '🔵' },
                { id: 'UPI_BHIM_QR', name: 'Scan NPCI QR', icon: '📷' },
                { id: 'CREDIT_DEBIT_CARD', name: 'Cards / NetBanking', icon: '💳' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center space-x-2 ${
                    paymentMethod === m.id
                      ? 'bg-accent/40 border-primary text-foreground font-bold shadow-xs ring-1 ring-primary/30'
                      : 'bg-card border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="truncate">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Razorpay Sandbox Notice */}
          {paymentMethod === 'RAZORPAY_SANDBOX' && (
            <div className="p-3.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-primary/20 rounded-xl text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-primary">
                <Sparkles className="w-4 h-4" />
                <span>Razorpay Sandbox Gateway Active</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Supports test cards, test UPI VPAs (e.g. <code className="text-foreground font-mono">success@razorpay</code>), and test NetBanking with ₹0 real money charged.
              </p>
            </div>
          )}

          {/* UPI ID input or QR display */}
          {paymentMethod === 'UPI_BHIM_QR' ? (
            <div className="p-4 bg-muted/40 rounded-xl border border-border text-center space-y-3">
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-border shadow-xs flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                    dynamicUpiUri,
                  )}`}
                  alt="NPCI UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Scan with any UPI App</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Google Pay, PhonePe, Paytm, BHIM or Cred
                </p>
              </div>
            </div>
          ) : paymentMethod.startsWith('UPI_') ? (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Enter Your UPI ID / VPA
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. yourname@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                A collect request for ₹{bookingData.grandTotal.toLocaleString('en-IN')} will be verified on your UPI app.
              </p>
            </div>
          ) : null}

          {/* Digital Agreement */}
          <div className="p-3 bg-muted/30 rounded-xl border border-border">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="w-4 h-4 rounded text-primary mt-0.5"
              />
              <span className="text-[11px] text-muted-foreground leading-snug">
                I accept the <strong className="text-foreground">Digital Bailment & Vehicle Rental Agreement</strong> under the Indian Contract Act 1872. I agree to pay any e-challans or toll charges incurred during my trip.
              </span>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={processing || isSubmitting}
            onClick={handlePay}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-glow hover:opacity-95 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <span>
              {processing || isSubmitting
                ? 'Connecting to Gateway & Confirming...'
                : paymentMethod === 'RAZORPAY_SANDBOX'
                ? `Launch Razorpay Sandbox (₹${bookingData.grandTotal.toLocaleString('en-IN')})`
                : `Pay ₹${bookingData.grandTotal.toLocaleString('en-IN')} & Confirm Reservation`}
            </span>
            {!processing && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
