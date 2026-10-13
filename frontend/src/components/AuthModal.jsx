import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, Sparkles, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CITIES } from './Navbar';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [role, setRole] = useState('RENTER'); // 'RENTER' | 'HOST'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [city, setCity] = useState('Bengaluru');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const authedUser = await login(email.trim(), password);
        if (onAuthSuccess) onAuthSuccess(authedUser);
        onClose();
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (!email.trim()) throw new Error('Please enter your email address');
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
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('demo123456');
    setMode('login');
    setError(null);
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
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            {mode === 'login' ? 'Welcome Back to GaadiGo' : 'Join India’s Rental Network'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Sign in to access your self-drive bookings, KYC, and fleet earnings.'
              : 'Rent scooties, bikes & cars or monetize your idle vehicle in minutes.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-muted rounded-xl mt-4 max-w-xs mx-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 rounded-lg transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-card text-foreground shadow-sm'
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
              }}
              className={`py-2 rounded-lg transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Demo Credentials pill selector */}
          {mode === 'login' && (
            <div className="mb-4 p-3 bg-accent/40 border border-accent rounded-xl text-xs">
              <span className="font-semibold text-accent-foreground block mb-1.5">
                ⚡ Quick Fill Demo Accounts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDemoFill('sunil.sharma@example.com', 'HOST')}
                  className="px-2.5 py-1 rounded-md bg-card border border-border text-[11px] font-medium text-foreground hover:bg-accent/60 transition cursor-pointer"
                >
                  Host Sunil (Owner)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('arjun.verma@example.com', 'RENTER')}
                  className="px-2.5 py-1 rounded-md bg-card border border-border text-[11px] font-medium text-foreground hover:bg-accent/60 transition cursor-pointer"
                >
                  Renter Arjun
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('admin@gaadigo.in', 'ADMIN')}
                  className="px-2.5 py-1 rounded-md bg-card border border-border text-[11px] font-medium text-foreground hover:bg-accent/60 transition cursor-pointer"
                >
                  Compliance Admin
                </button>
              </div>
            </div>
          )}

          {/* Social Sign In Mock */}
          <button
            type="button"
            onClick={() => {
              setEmail('google.user@example.com');
              setPassword('google_oauth_verified');
              if (mode === 'register') setName('Pooja Patel');
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 border border-border rounded-xl font-medium text-xs text-foreground bg-card hover:bg-muted/50 transition cursor-pointer mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-border w-full" />
            <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase absolute">
              or continue with email
            </span>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                {/* Account Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    I want to use GaadiGo to:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('RENTER')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                        role === 'RENTER'
                          ? 'border-primary bg-accent/40 text-accent-foreground font-bold'
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
                          ? 'border-primary bg-accent/40 text-accent-foreground font-bold'
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
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
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
                        className="w-full pl-9 pr-2 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
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
                        className="w-full pl-9 pr-2 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground cursor-pointer"
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

            {/* Email */}
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-glow hover:opacity-95 transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating with Kafka & MongoDB...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* India Regulatory Security Footnote */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              🔒 256-Bit SSL Encrypted. Compliant with IT Act 2000 & Motor Vehicles Act 1988.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
