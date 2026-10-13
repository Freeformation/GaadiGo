import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, ArrowRight, ArrowLeft, AlertCircle, FileText } from 'lucide-react';
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
    userName: user?.name || 'Priya Sundaram',
    userPhone: user?.phone || '+91 98860 98765',
    userEmail: user?.email || 'priya.renter@gaadigo.in',
    dlNumber: user?.dlNumber || 'KA0420210087462',
    dlCategory: 'LMV_AND_MCWG',
    dlExpiry: '2036-05-19',
    aadhaarNumber: user?.aadhaarMasked ? '554288194421' : '554288194421',
    helmetDeclarationAccepted: true,
  });

  const [verifying, setVerifying] = useState(false);
  const [verifiedStep, setVerifiedStep] = useState(false);

  if (!isOpen || !bookingData) return null;

  const vehicle = bookingData.vehicle;
  const isTwoWheeler = ['SCOOTY', 'BIKE'].includes(vehicle.category);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSimulateKyc = async (e) => {
    e.preventDefault();
    if (!formData.dlNumber || !formData.aadhaarNumber) {
      alert('Please fill Driving License and Aadhaar details');
      return;
    }

    setVerifying(true);
    // Simulate real DigiLocker / Parivahan API verification handshake
    setTimeout(async () => {
      try {
        const kycRecord = await onSubmitKycMutation({
          userName: formData.userName,
          userPhone: formData.userPhone,
          userEmail: formData.userEmail,
          dlNumber: formData.dlNumber,
          dlCategory: formData.dlCategory,
          dlExpiry: formData.dlExpiry,
          aadhaarNumber: formData.aadhaarNumber,
          helmetDeclarationAccepted: formData.helmetDeclarationAccepted,
        });
        setVerifying(false);
        setVerifiedStep(true);
      } catch (err) {
        setVerifying(false);
        alert('KYC verification error: ' + err.message);
      }
    }, 1200);
  };

  const handleProceedToPayment = () => {
    onKycVerified({
      ...bookingData,
      renterName: formData.userName,
      renterPhone: formData.userPhone,
      renterEmail: formData.userEmail,
      dlNumber: formData.dlNumber,
      aadhaarMasked: `XXXX-XXXX-${formData.aadhaarNumber.slice(-4)}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">DigiLocker & Parivahan e-KYC</h3>
              <p className="text-[11px] text-slate-400">Motor Vehicles Act Mandatory Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!verifiedStep ? (
            <form onSubmit={handleSimulateKyc} className="space-y-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-start space-x-2">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Your data is securely authenticated via Government of India DigiLocker & Parivahan Sarathi APIs. No physical paperwork needed.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name (As on DL / Aadhaar)</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Mobile Phone (OTP Active)</label>
                  <input
                    type="text"
                    name="userPhone"
                    value={formData.userPhone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Driving License */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Indian Driving License (DL) Number *
                </label>
                <input
                  type="text"
                  name="dlNumber"
                  value={formData.dlNumber}
                  onChange={handleChange}
                  placeholder="e.g. KA0420210087462 or DL1420180012345"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-emerald-500"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Required: {isTwoWheeler ? 'MCWOG (Scooty) or MCWG (Bike)' : 'LMV (Light Motor Vehicle)'}
                </p>
              </div>

              {/* Aadhaar Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  12-Digit Aadhaar Number (UIDAI) *
                </label>
                <input
                  type="password"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  placeholder="•••• •••• 4421"
                  maxLength={12}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Masked Aadhaar will be stored in compliance with UIDAI regulations.
                </p>
              </div>

              {/* Two-Wheeler Helmet Undertaking */}
              {isTwoWheeler && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="helmetDeclarationAccepted"
                      checked={formData.helmetDeclarationAccepted}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 mt-0.5"
                      required
                    />
                    <span className="text-[11px] text-slate-300">
                      I undertake to wear an ISI-certified helmet at all times while riding, as mandated by Section 129 of the Motor Vehicles Act 1988.
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={verifying}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
              >
                <span>{verifying ? 'Querying Parivahan & DigiLocker...' : 'Verify Identity via DigiLocker'}</span>
                {!verifying && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            /* Success Step */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Identity Verified Successfully</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Parivahan DL Status: <span className="text-emerald-400 font-bold">ACTIVE & VALID</span>
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">License Holder:</span>
                  <span className="font-bold text-white">{formData.userName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Driving License:</span>
                  <span className="font-mono text-emerald-400">{formData.dlNumber}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Category Approved:</span>
                  <span className="text-white">{formData.dlCategory}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">UIDAI Aadhaar:</span>
                  <span className="font-mono text-slate-300">XXXX-XXXX-{formData.aadhaarNumber.slice(-4)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Continue to UPI Payment (₹{bookingData.grandTotal.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
