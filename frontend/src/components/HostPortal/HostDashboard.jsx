import React, { useState } from 'react';
import {
  Plus,
  IndianRupee,
  Key,
  CheckCircle2,
  Clock,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Car,
  Fuel,
  Cog,
  MapPin,
  Check,
  Sparkles,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HostDashboard({
  vehicles = [],
  onOpenAddListing,
  onSelectVehicle,
  onApproveVehicle,
  onSwitchToAdmin,
}) {
  const { user } = useAuth();
  const [scopeTab, setScopeTab] = useState('my'); // 'my' | 'all'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED'

  // Filter to the logged-in host's own vehicles
  const isMyVehicle = (v) => {
    if (!user) return true;
    if (user.id && v.hostId === user.id) return true;
    if (user.name && v.hostName?.toLowerCase() === user.name?.toLowerCase()) return true;
    if (user.phone && v.hostPhone === user.phone) return true;
    return false;
  };

  const myListings = vehicles.filter(isMyVehicle);
  const scopedListings = scopeTab === 'my' ? myListings : vehicles;

  // Filter by status tab
  const displayListings = scopedListings.filter((v) => {
    if (statusFilter === 'ALL') return true;
    return v.status === statusFilter;
  });

  // Calculate metrics based on host's personal fleet (or all if in all mode)
  const statsBase = myListings.length > 0 ? myListings : vehicles;
  const pendingCount = statsBase.filter((v) => v.status === 'PENDING_APPROVAL').length;
  const approvedCount = statsBase.filter((v) => v.status === 'APPROVED').length;
  const totalTrips = statsBase.reduce((sum, v) => sum + (v.tripCount || 0), 0);
  const estimatedRevenue = statsBase.reduce(
    (sum, v) => sum + (v.tripCount || 0) * (v.dailyRate || 500) * 0.85,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent text-accent-foreground border border-primary/20">
                Host / Fleet Owner Portal
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                • {user ? `Signed in as ${user.name}` : 'Demo Host Session'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 mr-0.5" />
                <span>Verified Host</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-2 font-display">
              My Vehicle Listings & Fleet Earnings
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Manage your commercial yellow-plate & private lease vehicles, track Parivahan RTO compliance, and monitor direct UPI deposit payouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddListing}
              className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-extrabold text-xs sm:text-sm shadow-glow flex items-center space-x-2 transition cursor-pointer hover:opacity-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Vehicle Listing</span>
            </button>
          </div>
        </div>

        {/* Regulatory Protection Strip */}
        <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Escrow Protected: Host payout guarantee with ₹0 cancellation penalty on verified breakdowns</span>
          </div>
          <span className="text-[11px]">
            Compliant with MoRTH Rent-a-Cab & P2P Lease Guidelines 2026
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Estimated Host Earnings</span>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">
            ₹{Math.round(estimatedRevenue).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            85% net host share (15% platform fee)
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Live Approved Listings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">{approvedCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Bookable by renters on catalog</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Pending RTO Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 font-display">{pendingCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">
            {pendingCount > 0 ? (
              <span className="text-amber-600 font-semibold">
                Awaiting Parivahan RC verification
              </span>
            ) : (
              'All documents verified'
            )}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Trips Completed</span>
            <Key className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">{totalTrips}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Direct FASTag toll auto-deductions</p>
        </div>
      </div>

      {/* Listings Section Container */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
        {/* Controls: Scope Tabs and Status Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          {/* Scope: My Fleet vs All Fleet */}
          <div className="flex items-center space-x-2 bg-muted p-1 rounded-xl">
            <button
              onClick={() => setScopeTab('my')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                scopeTab === 'my'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Registered Fleet ({myListings.length})
            </button>
            <button
              onClick={() => setScopeTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                scopeTab === 'all'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Network Fleet ({vehicles.length})
            </button>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Statuses' },
              { id: 'APPROVED', label: 'Live & Approved' },
              { id: 'PENDING_APPROVAL', label: 'Pending Review' },
              { id: 'REJECTED', label: 'Rejected / Action Required' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings List */}
        <div className="mt-6 space-y-4">
          {displayListings.length === 0 ? (
            <div className="py-14 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground font-display">No Vehicles Found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                {scopeTab === 'my'
                  ? "You haven't listed any vehicles under this status yet. Click below to add your scooty, bike, or car to start earning with full RTO compliance."
                  : 'No vehicles match the selected filter.'}
              </p>
              {scopeTab === 'my' && (
                <button
                  onClick={onOpenAddListing}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs shadow-glow inline-flex items-center space-x-2 transition cursor-pointer hover:opacity-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Your First Vehicle</span>
                </button>
              )}
            </div>
          ) : (
            displayListings.map((v) => (
              <div
                key={v.id}
                className="bg-muted/20 border border-border rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-primary/40 transition"
              >
                {/* Vehicle Main Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="relative w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                    <img
                      src={v.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    {v.images?.length > 1 && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] text-white font-mono">
                        +{v.images.length - 1} photos
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        onClick={() => onSelectVehicle && onSelectVehicle(v)}
                        className="text-base font-bold text-foreground font-display hover:text-primary cursor-pointer transition"
                      >
                        {v.title}
                      </h3>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-300 text-slate-950 font-black border border-amber-400">
                        {v.registrationNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-accent text-accent-foreground border border-primary/20">
                        {v.plateType?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="flex items-center text-foreground font-medium">
                        <MapPin className="w-3 h-3 mr-1 text-primary" /> {v.areaHub}, {v.city}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Fuel className="w-3 h-3 mr-1 text-primary" /> {v.fuelType}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Cog className="w-3 h-3 mr-1 text-primary" /> {v.transmission}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-foreground">
                        ₹{v.dailyRate}/day <span className="font-normal text-muted-foreground">(₹{v.hourlyRate}/hr)</span>
                      </span>
                      <span>•</span>
                      <span className="text-muted-foreground">Deposit: ₹{v.securityDeposit}</span>
                    </div>

                    {/* Statutory & Compliance Row */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center">
                        RC Status:{' '}
                        <strong
                          className={`ml-1 ${
                            v.rcStatus === 'VERIFIED'
                              ? 'text-emerald-600'
                              : v.rcStatus === 'REJECTED'
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {v.rcStatus || 'PENDING'}
                        </strong>
                      </span>
                      <span>|</span>
                      <span>
                        Insurance: <strong>{v.insuranceCompany || 'HDFC ERGO'}</strong> (Valid {v.insuranceExpiry})
                      </span>
                      {v.fastagId && (
                        <>
                          <span>|</span>
                          <span className="text-primary font-medium">FASTag Active</span>
                        </>
                      )}
                      {v.helmetsProvided > 0 && (
                        <>
                          <span>|</span>
                          <span>{v.helmetsProvided} BIS Helmets</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
                  <div>
                    {v.status === 'APPROVED' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Live on Catalog
                      </span>
                    ) : v.status === 'PENDING_APPROVAL' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                        Pending RTO Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        {v.status}
                      </span>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1 text-left lg:text-right">
                      {v.tripCount || 0} trips completed • Rating: {v.rating || 5.0}★
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* View Live Page */}
                    {onSelectVehicle && (
                      <button
                        onClick={() => onSelectVehicle(v)}
                        className="px-3 py-1.5 rounded-lg bg-card hover:bg-muted border border-border text-foreground text-xs font-bold transition cursor-pointer flex items-center space-x-1 shadow-xs"
                      >
                        <span>View Page</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )}

                    {/* Simulate RTO Approval for pending listings */}
                    {v.status === 'PENDING_APPROVAL' && onApproveVehicle && (
                      <button
                        onClick={() => onApproveVehicle(v.id)}
                        title="Simulate instant Parivahan RC verification and make listing live"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Simulate Approval</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
