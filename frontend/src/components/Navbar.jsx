import React from 'react';
import { Sparkles, MapPin, Activity, User, LogOut, ChevronDown, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CITIES = [
  'All Cities',
  'Bengaluru',
  'Goa',
  'Delhi NCR',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Rishikesh',
  'Jaipur',
  'Manali',
];

export default function Navbar({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  onOpenAddListing,
  onOpenKafkaDrawer,
  onOpenAuthModal,
  kafkaEventCount = 0,
}) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
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
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded bg-accent text-accent-foreground border border-primary/20">
                  IND 🇮🇳
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground tracking-wide font-medium">
                P2P & Self-Drive Vehicle Sharing
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="hidden lg:flex items-center space-x-2 bg-muted/70 rounded-full px-3.5 py-1.5 border border-border">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer pr-1 font-semibold"
            >
              {CITIES.map((city) => (
                <option key={city} value={city} className="bg-card text-foreground">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'landing'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              }`}
            >
              Explore
            </button>

            <button
              onClick={() => setActiveTab('renter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'renter'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              }`}
            >
              Rent a Vehicle
            </button>

            <button
              onClick={() => setActiveTab('owner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'owner'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              }`}
            >
              Host Earnings
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
                activeTab === 'admin'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-foreground/80 hover:text-foreground hover:bg-muted'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-primary" />
              <span>Admin Compliance</span>
            </button>
          </nav>

          {/* Action CTAs & Auth Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Kafka Audit Stream Monitor Button */}
            <button
              onClick={onOpenKafkaDrawer}
              title="View live Kafka message events and audit stream"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-card border border-border text-foreground hover:border-primary/40 text-xs font-medium transition cursor-pointer shadow-xs"
            >
              <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="hidden sm:inline text-[11px] font-semibold text-muted-foreground">
                Kafka Events
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                {kafkaEventCount}
              </span>
            </button>

            {/* Auth Button or User Profile */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 bg-muted/60 p-1 pl-2.5 rounded-xl border border-border">
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-foreground leading-tight">
                    {user?.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium uppercase">
                    {user?.role}
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

            {/* List Vehicle Button */}
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
          </div>
        </div>
      </div>
    </header>
  );
}
