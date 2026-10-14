import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Clock,
  Car,
  Users,
  Calendar,
  FileCheck,
  IndianRupee,
  Activity,
  User,
  ShieldCheck,
  Plus,
  RefreshCw,
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Search,
  Sparkles,
  ArrowLeft,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Mail,
  Smartphone,
  MapPin,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from '../AdminPortal/AdminDashboard';
import HostDashboard from '../HostPortal/HostDashboard';
import RenterBookingsView from '../RenterPortal/RenterBookingsView';
import TransactionHistoryView from '../Finance/TransactionHistoryView';
import ProfileSettingsView from '../Profile/ProfileSettingsView';

export default function DashboardPage({
  vehicles = [],
  bookings = [],
  users = [],
  kycRecords = [],
  adminOverview,
  onApproveVehicle,
  onRejectVehicle,
  onReleaseDeposit,
  onRefreshData,
  onViewKafkaEvents,
  onOpenAddListing,
  onExploreVehicles,
  onBackToHome,
  onViewVoucher,
  onSelectVehicle,
  isActionLoading,
  subTab = 'overview',
  onSubTabChange,
}) {
  const { user, logout } = useAuth();
  const role = user?.role || 'RENTER'; // 'ADMIN' | 'HOST' | 'RENTER'

  // Map subTab or default
  const [currentView, setCurrentView] = useState(() => {
    if (subTab === 'profile') return 'profile';
    if (subTab === 'finance') return 'finance';
    return 'overview';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (subTab) {
      if (subTab === 'profile') setCurrentView('profile');
      else if (subTab === 'finance') setCurrentView('finance');
      else if (subTab === 'overview') setCurrentView('overview');
      else setCurrentView(subTab);
    }
  }, [subTab]);

  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    if (onSubTabChange) {
      onSubTabChange(viewId);
    }
  };

  // Calculations for badges
  const pendingVehiclesCount = vehicles.filter((v) => v.status === 'PENDING_APPROVAL').length;
  const escrowBookingsCount = bookings.filter((b) => b.depositStatus === 'HELD_IN_ESCROW').length;

  // Filter vehicles belonging to this host
  const hostVehicles = vehicles.filter((v) => {
    if (!user) return true;
    if (user.id && v.hostId === user.id) return true;
    if (user.name && v.hostName?.toLowerCase() === user.name?.toLowerCase()) return true;
    if (user.phone && v.hostPhone === user.phone) return true;
    return false;
  });
  const hostPendingCount = hostVehicles.filter((v) => v.status === 'PENDING_APPROVAL').length;

  // Filter bookings belonging to this renter
  const renterBookings = bookings.filter((b) => {
    if (!user) return true;
    return b.renterPhone === user.phone || b.renterEmail === user.email || b.renterName === user.name;
  });

  // View title labels
  const getViewTitle = () => {
    if (role === 'ADMIN') {
      const titles = {
        overview: 'System Overview & Platform KPIs',
        pending: 'Pending Approvals Queue',
        vehicles: 'Fleet Vehicles Management',
        users: 'Registered Platform Users & Roles',
        bookings: 'Bookings & Escrow Deposits',
        kyc: 'DigiLocker & Parivahan KYC Records',
        finance: 'Financial Ledger & UPI Transactions',
        profile: 'Administrator Profile & Security',
      };
      return titles[currentView] || 'Admin Dashboard';
    }
    if (role === 'HOST') {
      const titles = {
        overview: 'My Registered Fleet Listings',
        pending: 'Vehicles Pending RTO Review',
        network: 'Market Rates & Network Fleet',
        finance: 'Earnings & Payout Ledger',
        profile: 'Host Profile & Security',
      };
      return titles[currentView] || 'Host Dashboard';
    }
    const renterTitles = {
      overview: 'My Booked Trips & Digital Keys',
      finance: 'Rental Payments & Refund History',
      profile: 'Renter Profile & DigiLocker KYC',
    };
    return renterTitles[currentView] || 'Renter Dashboard';
  };

  // Render Sidebar Content (Shared between Desktop & Mobile Drawer)
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between bg-card">
      {/* 1. Header & Brand Branding */}
      <div>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={onBackToHome || onExploreVehicles}
            title="Return to Public Marketplace"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-extrabold text-xl shadow-glow group-hover:scale-105 transition-transform">
              <span className="font-display">GG</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-foreground font-display">
                  Gaadi<span className="text-primary">Go</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-accent text-accent-foreground text-[9px] font-extrabold uppercase tracking-wider border border-primary/20">
                  IND 🇮🇳
                </span>
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                    role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                      : role === 'HOST'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}
                >
                  {role === 'ADMIN' ? 'Master Admin' : role === 'HOST' ? 'Host Partner' : 'Renter Hub'}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Navigation Menus */}
        <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-none">
          {/* Role: ADMIN Navigation */}
          {role === 'ADMIN' && (
            <>
              {/* Group A: Core Management */}
              <div>
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Fleet & Operations
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => handleNavigate('overview')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentView === 'overview'
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Overview & KPIs</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigate('pending')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentView === 'pending'
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Clock className="w-4 h-4" />
                      <span>Pending Approvals</span>
                    </div>
                    {pendingVehiclesCount > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          currentView === 'pending'
                            ? 'bg-white text-slate-900'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {pendingVehiclesCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleNavigate('vehicles')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentView === 'vehicles'
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Car className="w-4 h-4" />
                      <span>Fleet Vehicles</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        currentView === 'vehicles' ? 'bg-white/20 text-white' : 'text-muted-foreground'
                      }`}
                    >
                      {vehicles.length}
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavigate('users')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentView === 'users'
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Users className="w-4 h-4" />
                      <span>Users & Roles</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        currentView === 'users' ? 'bg-white/20 text-white' : 'text-muted-foreground'
                      }`}
                    >
                      {users.length}
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavigate('bookings')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentView === 'bookings'
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Calendar className="w-4 h-4" />
                      <span>Bookings & Escrow</span>
                    </div>
                    {escrowBookingsCount > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          currentView === 'bookings'
                            ? 'bg-white text-slate-900'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {escrowBookingsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleNavigate('kyc')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentView === 'kyc'
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileCheck className="w-4 h-4" />
                      <span>KYC Verifications</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        currentView === 'kyc' ? 'bg-white/20 text-white' : 'text-muted-foreground'
                      }`}
                    >
                      {kycRecords.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Group B: Finance & Real-Time Stream */}
              <div>
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Finance & Audit
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => handleNavigate('finance')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentView === 'finance'
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <IndianRupee className="w-4 h-4" />
                      <span>Finance & Ledger</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (onViewKafkaEvents) onViewKafkaEvents();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-foreground/80 hover:bg-muted hover:text-foreground transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Activity className="w-4 h-4 text-primary animate-pulse" />
                      <span>Kafka Audit Stream</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-primary/10 text-primary font-black uppercase">
                      Live
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Role: HOST Navigation */}
          {role === 'HOST' && (
            <div>
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
                Host Fleet Management
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavigate('overview')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentView === 'overview'
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Car className="w-4 h-4" />
                    <span>My Registered Fleet</span>
                  </div>
                  {hostVehicles.length > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        currentView === 'overview' ? 'bg-white/20 text-white' : 'text-muted-foreground'
                      }`}
                    >
                      {hostVehicles.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavigate('pending')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentView === 'pending'
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-4 h-4" />
                    <span>Pending RTO Review</span>
                  </div>
                  {hostPendingCount > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        currentView === 'pending' ? 'bg-white text-slate-900' : 'bg-amber-500 text-white'
                      }`}
                    >
                      {hostPendingCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavigate('network')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentView === 'network'
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Network Market Rates</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      currentView === 'network' ? 'bg-white/20 text-white' : 'text-muted-foreground'
                    }`}
                  >
                    {vehicles.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenAddListing) onOpenAddListing();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-foreground/80 hover:bg-muted hover:text-foreground transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Plus className="w-4 h-4 text-primary" />
                    <span>List New Vehicle</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('finance')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentView === 'finance'
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <IndianRupee className="w-4 h-4" />
                    <span>Earnings & Payouts</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Role: RENTER Navigation */}
          {role !== 'ADMIN' && role !== 'HOST' && (
            <div>
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
                My Bookings & Rentals
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavigate('overview')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentView === 'overview'
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Calendar className="w-4 h-4" />
                    <span>My Bookings & Trips</span>
                  </div>
                  {renterBookings.length > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        currentView === 'overview' ? 'bg-white/20 text-white' : 'text-muted-foreground'
                      }`}
                    >
                      {renterBookings.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (onExploreVehicles) onExploreVehicles();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-foreground/80 hover:bg-muted hover:text-foreground transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Car className="w-4 h-4 text-primary" />
                    <span>Book a Ride / Rent</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                <button
                  onClick={() => handleNavigate('finance')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentView === 'finance'
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <IndianRupee className="w-4 h-4" />
                    <span>Payments & Refunds</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Group C: Settings & Marketplace Return */}
          <div>
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1.5">
              Account & Store
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('profile')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                    : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <User className="w-4 h-4" />
                  <span>Profile & Security</span>
                </div>
              </button>

              <button
                onClick={onBackToHome || onExploreVehicles}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-foreground/80 hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <ArrowLeft className="w-4 h-4 text-primary" />
                  <span>Back to Website</span>
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer: User Info & Sign Out */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between gap-3">
          <div
            className="flex items-center space-x-2.5 min-w-0 cursor-pointer"
            onClick={() => handleNavigate('profile')}
            title="Edit profile & security"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign out of account"
            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-card transition cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 shrink-0 border-r border-border h-screen sticky top-0 flex-col shadow-xs">
        {renderSidebarContent()}
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* 3. Main Right Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Dashboard Utility Bar */}
        <header className="h-16 sm:h-20 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb & Current Title */}
            <div>
              <div className="flex items-center space-x-1.5 text-[11px] text-muted-foreground font-semibold">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-primary font-bold capitalize">{currentView}</span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-foreground font-display tracking-tight leading-tight">
                {getViewTitle()}
              </h1>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Refresh Button */}
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                title="Refresh from MongoDB"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold transition flex items-center space-x-1.5 border border-border cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sync Data</span>
              </button>
            )}

            {/* Register Fleet CTA */}
            {role === 'ADMIN' && onOpenAddListing && (
              <button
                onClick={onOpenAddListing}
                className="px-3.5 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold transition flex items-center space-x-1.5 shadow-glow hover:opacity-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Fleet</span>
              </button>
            )}

            {role === 'HOST' && onOpenAddListing && (
              <button
                onClick={onOpenAddListing}
                className="px-3.5 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold transition flex items-center space-x-1.5 shadow-glow hover:opacity-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Listing</span>
              </button>
            )}

            {/* Live Kafka Stream Pulse Button */}
            {role === 'ADMIN' && onViewKafkaEvents && (
              <button
                onClick={onViewKafkaEvents}
                title="Open Kafka Audit Event Stream"
                className="px-3 py-2 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="hidden sm:inline">Kafka Stream</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          {/* A. Role: ADMIN Views */}
          {role === 'ADMIN' && (
            <>
              {/* 1. Overview & Fleet Views */}
              {(currentView === 'overview' ||
                currentView === 'pending' ||
                currentView === 'vehicles' ||
                currentView === 'users' ||
                currentView === 'bookings' ||
                currentView === 'kyc') && (
                <AdminDashboard
                  vehicles={vehicles}
                  bookings={bookings}
                  users={users}
                  kycRecords={kycRecords}
                  adminOverview={adminOverview}
                  onApproveVehicle={onApproveVehicle}
                  onRejectVehicle={onRejectVehicle}
                  onReleaseDeposit={onReleaseDeposit}
                  onRefreshData={onRefreshData}
                  onViewKafkaEvents={onViewKafkaEvents}
                  onOpenAddListing={onOpenAddListing}
                  isActionLoading={isActionLoading}
                  activeTab={currentView === 'pending' ? 'overview' : currentView}
                  onTabChange={setCurrentView}
                  hideTabs={true}
                  hideHeader={true}
                />
              )}

              {/* 2. Finance View */}
              {currentView === 'finance' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <TransactionHistoryView onViewVoucher={onViewVoucher} />
                </div>
              )}

              {/* 3. Profile & Security View */}
              {currentView === 'profile' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <ProfileSettingsView />
                </div>
              )}
            </>
          )}

          {/* B. Role: HOST Views */}
          {role === 'HOST' && (
            <>
              {(currentView === 'overview' || currentView === 'pending' || currentView === 'network') && (
                <HostDashboard
                  vehicles={vehicles}
                  onOpenAddListing={onOpenAddListing}
                  onSelectVehicle={onSelectVehicle}
                  onApproveVehicle={onApproveVehicle}
                  onSwitchToAdmin={() => {}}
                  initialScope={currentView === 'network' ? 'all' : 'my'}
                  initialStatusFilter={currentView === 'pending' ? 'PENDING_APPROVAL' : 'ALL'}
                  hideHeader={true}
                />
              )}

              {currentView === 'finance' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <TransactionHistoryView onViewVoucher={onViewVoucher} />
                </div>
              )}

              {currentView === 'profile' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <ProfileSettingsView />
                </div>
              )}
            </>
          )}

          {/* C. Role: RENTER Views */}
          {role !== 'ADMIN' && role !== 'HOST' && (
            <>
              {currentView === 'overview' && (
                <RenterBookingsView
                  bookings={bookings}
                  onExploreVehicles={onExploreVehicles}
                  onViewVoucher={onViewVoucher}
                  hideHeader={true}
                />
              )}

              {currentView === 'finance' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <TransactionHistoryView onViewVoucher={onViewVoucher} />
                </div>
              )}

              {currentView === 'profile' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <ProfileSettingsView />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
