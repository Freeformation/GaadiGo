import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RenterKYCModal({
  isOpen,
  onClose,
  bookingData,
  onKycVerified,
  onSubmitKycMutation,
  isSubmitting,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    userName: user?.name || '',
    userPhone: user?.phone || '',
    userEmail: user?.email || '',
    dlNumber: user?.dlNumber || '',
    dlCategory: user?.dlCategory || 'LMV_AND_MCWG',
    dlExpiry: '2030-12-31',
    aadhaarNumber: '',
    helmetDeclarationAccepted: true,
  });

  const [verifying, setVerifying] = useState(false);
  const [verifiedStep, setVerifiedStep] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !bookingData) return null;

  const vehicle = bookingData.vehicle;
  const isTwoWheeler = ['SCOOTY', 'BIKE'].includes(vehicle?.category);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handleSubmitKyc = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.userName.trim()) {
      setError('Please provide your full legal name as it appears on official records.');
      return;
    }
    if (!formData.userPhone.trim()) {
      setError('Please provide your mobile phone number for OTP verification.');
      return;
    }
    if (!formData.dlNumber.trim()) {
      setError('Driving License number is mandatory under Motor Vehicles Act.');
      return;
    }
    if (!formData.aadhaarNumber.trim()) {
      setError('12-digit Aadhaar number is required for DigiLocker identity verification.');
      return;
    }

    setVerifying(true);

    try {
      // Call real backend API (performs real UIDAI Verhoeff Checksum & MoRTH DL verification)
      const kycRecord = await onSubmitKycMutation({
        userName: formData.userName.trim(),
        userPhone: formData.userPhone.trim(),
        userEmail: formData.userEmail.trim(),
        dlNumber: formData.dlNumber.trim(),
        dlCategory: formData.dlCategory,
        dlExpiry: formData.dlExpiry,
        aadhaarNumber: formData.aadhaarNumber.trim(),
        helmetDeclarationAccepted: formData.helmetDeclarationAccepted,
      });

      setVerifying(false);
      setVerifiedStep(true);
    } catch (err) {
      setVerifying(false);
      setError(err.message || 'KYC verification failed. Please check your Aadhaar or Driving License details.');
    }
  };

  const handleProceedToPayment = () => {
    onKycVerified({
      ...bookingData,
      renterName: formData.userName,
      renterPhone: formData.userPhone,
      renterEmail: formData.userEmail,
      dlNumber: formData.dlNumber,
      aadhaarMasked: `XXXX-XXXX-${formData.aadhaarNumber.replace(/\D/g, '').slice(-4) || '8812'}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-display">DigiLocker & Parivahan e-KYC</h3>
              <p className="text-[11px] text-muted-foreground">Motor Vehicles Act 1988 Compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!verifiedStep ? (
            <form onSubmit={handleSubmitKyc} className="space-y-4">
              <div className="p-3 bg-accent/30 border border-primary/20 rounded-xl text-xs text-accent-foreground flex items-start space-x-2">
                <Lock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <span>
                  Real-time UIDAI & MoRTH validation: Checks official 12-digit Verhoeff checksum and authentic RTO Driving License format.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Full Name (as on Driving License / Aadhaar)
                </label>
                <input
                  type="text"
                  name="userName"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="userPhone"
                    placeholder="+91 98765 43210"
                    value={formData.userPhone}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Email Address</label>
                  <input
                    type="email"
                    name="userEmail"
                    placeholder="name@example.com"
                    value={formData.userEmail}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    name="dlNumber"
                    placeholder="e.g. KA0420210087462"
                    value={formData.dlNumber}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground uppercase focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground mt-0.5">Format: State Code + RTO + Year + Number</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">DL Category</label>
                  <select
                    name="dlCategory"
                    value={formData.dlCategory}
                    onChange={handleChange}
                    className="w-full bg-card border border-input rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
                  >
                    <option value="LMV_AND_MCWG">LMV + MCWG (Car & Geared Bike)</option>
                    <option value="LMV">LMV (Light Motor Vehicle - Car)</option>
                    <option value="MCWG">MCWG (Motorcycle with Gear)</option>
                    <option value="MCWOG">MCWOG (Motorcycle Without Gear / Scooty)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  12-Digit Aadhaar Number (UIDAI)
                </label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  placeholder="e.g. 5542 8819 4421"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  maxLength={14}
                  className="w-full bg-card border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  required
                />
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  UIDAI Verhoeff Checksum validated. Aadhaar number is masked (XXXX-XXXX-1234) on our servers.
                </p>
              </div>

              {isTwoWheeler && (
                <div className="p-3 bg-muted/40 rounded-xl border border-border">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="helmetDeclarationAccepted"
                      checked={formData.helmetDeclarationAccepted}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-primary mt-0.5"
                    />
                    <span className="text-[11px] text-muted-foreground leading-snug">
                      I declare that I will wear a <strong className="text-foreground">BIS/ISI-certified helmet (IS 4151)</strong> at all times as mandated under Section 129 of Motor Vehicles Act.
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={verifying || isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-glow hover:opacity-95 transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {verifying || isSubmitting ? (
                  <span>Verifying with Government APIs...</span>
                ) : (
                  <>
                    <span>Verify Credentials via DigiLocker</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground font-display">e-KYC Verified Successfully</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Validated against UIDAI & Parivahan Sarathi registries. Event emitted to Kafka.
                </p>
              </div>

              <div className="bg-muted/40 p-4 rounded-xl border border-border text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renter Name:</span>
                  <span className="font-bold text-foreground">{formData.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Masked Aadhaar:</span>
                  <span className="font-mono text-foreground">
                    XXXX-XXXX-{formData.aadhaarNumber.replace(/\D/g, '').slice(-4) || '8812'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driving License:</span>
                  <span className="font-mono text-foreground">{formData.dlNumber.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DL Endorsement:</span>
                  <span className="font-semibold text-emerald-600">{formData.dlCategory}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full py-3 px-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-glow hover:opacity-95 transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Proceed to Payment Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
