import React, { useState } from 'react';
import {
  User,
  Car,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Key,
  ShieldAlert,
  FileCheck,
  Users,
  MapPin,
  Smartphone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from '../AdminPortal/AdminDashboard';
import HostDashboard from '../HostPortal/HostDashboard';
import RenterBookingsView from '../RenterPortal/RenterBookingsView';

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
  onViewVoucher,
  isActionLoading,
}) {
  const { user } = useAuth();
  const role = user?.role; // 'ADMIN' | 'HOST' | 'RENTER'

  if (role === 'ADMIN') {
    return (
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
      />
    );
  }

  if (role === 'HOST') {
    return (
      <HostDashboard
        vehicles={vehicles}
        onOpenAddListing={onOpenAddListing}
        onSwitchToAdmin={() => {}}
      />
    );
  }

  // Default: RENTER role
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Renter Header Profile Overview */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-black text-2xl shadow-glow">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground font-display">
                  Welcome back, {user?.name || 'Renter'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Active Renter
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1 text-primary" /> {user?.email}
                </span>
                <span className="flex items-center">
                  <Smartphone className="w-3.5 h-3.5 mr-1 text-primary" /> {user?.phone}
                </span>
                {user?.city && (
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-primary" /> {user?.city}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onExploreVehicles}
              className="px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-glow flex items-center space-x-2 transition cursor-pointer hover:opacity-95"
            >
              <span>Book a Ride</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KYC Status Strip */}
        <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>DigiLocker & Parivahan DL Status: Verified (Zero Deposit Deductions)</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            MoRTH Road Safety & Helmet undertaking on file
          </span>
        </div>
      </div>

      {/* Embedded Bookings Section */}
      <RenterBookingsView
        bookings={bookings}
        onExploreVehicles={onExploreVehicles}
        onViewVoucher={onViewVoucher}
      />
    </div>
  );
}
