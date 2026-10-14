import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CITIES } from './Navbar';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const { login, register, requestPasswordReset, resetPasswordWithOtp } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [role, setRole] = useState('RENTER'); // 'RENTER' | 'HOST'
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states for login/register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [city, setCity] = useState('Bengaluru');

  // Forgot Password multi-step states
  const [forgotStep, setForgotStep] = useState(1); // 1: enter email, 2: enter otp & new pass
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim()) throw new Error('Please enter your email address');
        if (!password) throw new Error('Please enter your password');

        const authedUser = await login(email.trim(), password);
        if (onAuthSuccess) onAuthSuccess(authedUser);
        onClose();
      } else if (mode === 'register') {
        if (!name.trim()) throw new Error('Please enter your legal name (as on Aadhaar/DL)');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
        if (!phone.trim() || phone.trim().length < 10)
          throw new Error('Please enter a valid 10-digit Indian mobile number');
        if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

        const authedUser = await register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim(),
          role,
          city,
        });
        if (onAuthSuccess) onAuthSuccess(authedUser);
        onClose();
      } else if (mode === 'forgot') {
        if (forgotStep === 1) {
          if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid registered email address');

          const res = await requestPasswordReset(email.trim());
          if (res?.simulatedOtp) {
            setSimulatedOtp(res.simulatedOtp);
            setForgotOtp(res.simulatedOtp); // Auto-fill in demo mode
            setInfoMessage(
              `Demo OTP generated: ${res.simulatedOtp}. It has been auto-filled below for instant testing.`
            );
          } else {
            setInfoMessage('Verification OTP dispatched to your registered email / SMS.');
          }
          setForgotStep(2);
        } else {
          // Step 2: verify OTP & set new password
          if (!forgotOtp.trim()) throw new Error('Please enter the 6-digit OTP code.');
          if (!forgotNewPassword || forgotNewPassword.length < 6)
            throw new Error('New password must be at least 6 characters.');
          if (forgotNewPassword !== forgotConfirmPassword)
            throw new Error('New passwords do not match. Please verify.');

          const authedUser = await resetPasswordWithOtp({
            email: email.trim(),
            otp: forgotOtp.trim(),
            newPassword: forgotNewPassword,
          });

          if (onAuthSuccess) onAuthSuccess(authedUser);
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Logo */}
        <div className="p-6 pb-4 border-b border-border text-center bg-muted/30">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary shadow-glow text-white font-black text-xl mb-3">
            GG
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight font-display">
            {mode === 'login'
              ? 'Sign in to GaadiGo'
              : mode === 'register'
              ? 'Create Your GaadiGo Account'
              : 'Reset Your Password'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Access your self-drive bookings, KYC verification, and host earnings.'
              : mode === 'register'
              ? 'Join India’s peer-to-peer vehicle sharing network as a renter or host.'
              : 'Enter your registered email to receive an OTP and restore account access.'}
          </p>

          {/* Mode Switch Tabs */}
          {mode !== 'forgot' ? (
            <div className="grid grid-cols-2 p-1 bg-muted rounded-xl mt-4 max-w-xs mx-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setInfoMessage(null);
                }}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-card text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setInfoMessage(null);
                }}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  mode === 'register'
                    ? 'bg-card text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setInfoMessage(null);
                }}
                className="text-xs text-primary font-bold hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>← Back to Sign In</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Error Notice */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Info Banner */}
          {infoMessage && (
            <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs flex items-start space-x-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* REGISTER MODE SPECIFICS */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    I want to join GaadiGo to:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('RENTER')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                        role === 'RENTER'
                          ? 'border-primary bg-accent/40 text-accent-foreground font-bold shadow-xs'
                          : 'border-border text-muted-foreground hover:border-foreground/30'
                      }`}
                    >
                      <div className="font-bold text-foreground">🛵 Rent Vehicles</div>
                      <div className="text-[10px] text-muted-foreground">Self-drive rentals</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('HOST')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                        role === 'HOST'
                          ? 'border-primary bg-accent/40 text-accent-foreground font-bold shadow-xs'
                          : 'border-border text-muted-foreground hover:border-foreground/30'
                      }`}
                    >
                      <div className="font-bold text-foreground">🔑 Host / Owner</div>
                      <div className="text-[10px] text-muted-foreground">Earn ₹15k–50k/mo</div>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Full Legal Name (as on Aadhaar / DL)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your legal name"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>
                </div>

                {/* Phone & City Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-2 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer"
                      >
                        {CITIES.filter((c) => c !== 'All Cities').map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* EMAIL (COMMON TO ALL MODES) */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  disabled={mode === 'forgot' && forgotStep === 2}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-70"
                />
              </div>
            </div>

            {/* PASSWORD (LOGIN & REGISTER) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-foreground">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setForgotStep(1);
                        setError(null);
                        setInfoMessage(null);
                      }}
                      className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD: STEP 2 INPUTS */}
            {mode === 'forgot' && forgotStep === 2 && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-foreground">
                      6-Digit Verification OTP
                    </label>
                    {simulatedOtp && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                        Demo OTP: {simulatedOtp}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="Enter 6-digit code (or 123456)"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>
                </div>
              </>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-glow hover:opacity-95 transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'register' ? (
                <>
                  <span>Create Account</span>
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : forgotStep === 1 ? (
                <>
                  <span>Send Verification OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Reset Password & Sign In</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* India Regulatory Security Footnote */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              🔒 256-Bit SSL Encrypted. Direct MongoDB authentication & Kafka audit trail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
