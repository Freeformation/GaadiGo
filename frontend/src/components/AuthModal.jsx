import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
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
        if (!email.trim()) throw new Error('Please enter your email address');
        if (!password) throw new Error('Please enter your password');

        const authedUser = await login(email.trim(), password);
        if (onAuthSuccess) onAuthSuccess(authedUser);
        onClose();
      } else {
        if (!name.trim()) throw new Error('Please enter your legal name (as on Aadhaar/DL)');
        if (!email.trim() || !email.includes('@')) throw new Error('Please enter a valid email address');
        if (!phone.trim() || phone.trim().length < 10) throw new Error('Please enter a valid 10-digit Indian mobile number');
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
      setError(err.message || 'Authentication failed. Please verify your credentials.');
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
            {mode === 'login' ? 'Sign in to GaadiGo' : 'Create Your GaadiGo Account'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Access your self-drive bookings, KYC verification, and host earnings.'
              : 'Join India’s peer-to-peer vehicle sharing network as a renter or host.'}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                {/* Account Type Selector */}
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
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
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
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
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
                <span>Connecting to Server...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* India Regulatory Security Footnote */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              🔒 256-Bit SSL Encrypted. Direct MongoDB authentication & Kafka event streaming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
