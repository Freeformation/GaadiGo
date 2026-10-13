import { Sparkles, MapPin, Activity, ShieldAlert, LogOut, Car, Calendar, Key, Plus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FALLBACK_CITIES } from '../utils/cities';

export const CITIES = FALLBACK_CITIES;

export default function Navbar({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  cities = ['All Cities'],
  onOpenAddListing,
  onOpenKafkaDrawer,
  onOpenAuthModal,
  kafkaEventCount = 0,
  renterBookingsCount = 0,
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const role = user?.role; // 'RENTER' | 'HOST' | 'ADMIN' | undefined

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Left: Brand Logo & City Selector */}
          <div className="flex items-center space-x-4 lg:space-x-6 shrink-0">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => setActiveTab('landing')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow text-white font-extrabold text-xl group-hover:scale-105 transition-transform">
                <span className="font-display">GG</span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-display">
                    Gaadi<span className="text-primary">Go</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-accent text-accent-foreground text-[9px] font-extrabold uppercase tracking-wider border border-primary/20">
                    IND 🇮🇳
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground tracking-wide font-medium">
                  P2P & Self-Drive Vehicle Sharing
                </p>
              </div>
            </div>

            {/* Dynamic City Selector */}
            <div className="hidden md:flex items-center space-x-2 bg-muted/60 hover:bg-muted/80 transition rounded-full px-3.5 py-1.5 border border-border">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer pr-1 font-semibold"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-card text-foreground">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center: Main Navigation Menu */}
          <nav className="hidden md:flex items-center justify-center space-x-1 lg:space-x-2">
            {/* Explore / Home */}
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'landing'
                  ? 'bg-accent text-accent-foreground font-bold'
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              }`}
            >
              Explore
            </button>

            {/* Rent a Vehicle Catalog */}
            <button
              onClick={() => setActiveTab('renter')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'renter'
                  ? 'bg-accent text-accent-foreground font-bold'
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              }`}
            >
              Rent a Vehicle
            </button>

            {/* POST-LOGIN: My Dashboard (Dynamic based on role) */}
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                    : 'text-foreground/90 hover:text-foreground hover:bg-muted border border-border'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>
                  {role === 'ADMIN'
                    ? 'Admin Dashboard'
                    : role === 'HOST'
                    ? 'Host Dashboard'
                    : 'My Dashboard'}
                </span>
                {role === 'RENTER' && renterBookingsCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-slate-900'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {renterBookingsCount}
                  </span>
                )}
              </button>
            )}

            {/* Admin Live Kafka Audit Stream Pulse */}
            {isAuthenticated && role === 'ADMIN' && (
              <button
                onClick={onOpenKafkaDrawer}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 text-foreground/80 hover:text-foreground hover:bg-muted cursor-pointer"
                title="View live Kafka message audit stream"
              >
                <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span>Kafka Stream</span>
                <span className="px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                  {kafkaEventCount}
                </span>
              </button>
            )}
          </nav>

          {/* Action CTAs & Auth Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User Profile or Sign In */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 bg-muted/60 p-1 pl-2.5 rounded-xl border border-border">
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-foreground leading-tight">
                    {user?.name}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                        user?.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                          : user?.role === 'HOST'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}
                    >
                      {user?.role}
                    </span>
                    {user?.city && (
                      <span className="text-[10px] text-muted-foreground">• {user.city}</span>
                    )}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {user?.name?.charAt(0) || 'U'}
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-card transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-foreground hover:bg-muted border border-border transition cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* List Vehicle Button (Adapts to Role) */}
            {role === 'HOST' ? (
              <button
                onClick={onOpenAddListing}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs shadow-glow hover:opacity-95 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Listing</span>
              </button>
            ) : role === 'ADMIN' ? (
              <button
                onClick={onOpenAddListing}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs hover:bg-secondary/90 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Fleet</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    onOpenAuthModal('register');
                  } else {
                    onOpenAddListing();
                  }
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs shadow-glow hover:opacity-95 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>List Your Vehicle</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
