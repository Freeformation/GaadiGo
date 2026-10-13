import React from 'react';
import { Plus, IndianRupee, Key, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HostDashboard({
  vehicles = [],
  onOpenAddListing,
  onSwitchToAdmin,
}) {
  const { user } = useAuth();
  const hostListings = vehicles;
  const pendingCount = hostListings.filter((v) => v.status === 'PENDING_APPROVAL').length;
  const approvedCount = hostListings.filter((v) => v.status === 'APPROVED').length;
  const totalTrips = hostListings.reduce((sum, v) => sum + (v.tripCount || 0), 0);
  const estimatedRevenue = hostListings.reduce(
    (sum, v) => sum + (v.tripCount || 0) * (v.dailyRate || 500) * 0.85,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent text-accent-foreground border border-primary/20">
              Host / Owner Portal
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              • {user ? `Logged in as ${user.name}` : 'Demo Host Mode'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1 font-display">
            My Vehicle Listings & Earnings
          </h1>
        </div>

        <button
          onClick={onOpenAddListing}
          className="px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-glow flex items-center space-x-2 transition cursor-pointer self-start sm:self-auto hover:opacity-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle Listing</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Estimated Payouts</span>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">
            ₹{Math.round(estimatedRevenue).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Net direct UPI deposits
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Live Approved Listings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">{approvedCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Available in catalog</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Pending RTO Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 font-display">{pendingCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">
            {pendingCount > 0 ? (
              <span
                onClick={onSwitchToAdmin}
                className="text-primary underline cursor-pointer font-bold"
              >
                Review in Admin portal →
              </span>
            ) : (
              'All documents verified'
            )}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Completed Trips</span>
            <Key className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">{totalTrips}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Across all hubs</p>
        </div>
      </div>

      {/* Listings Table / Cards */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
        <h2 className="text-lg font-bold text-foreground mb-4 font-display">My Registered Vehicles</h2>

        <div className="space-y-4">
          {hostListings.map((v) => (
            <div
              key={v.id}
              className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={v.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'}
                  alt={v.title}
                  className="w-20 h-16 rounded-lg object-cover bg-muted shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-foreground font-display">{v.title}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-300 text-slate-950 font-bold border border-amber-400">
                      {v.registrationNumber}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center space-x-2">
                    <span>{v.category}</span>
                    <span>•</span>
                    <span>{v.areaHub}, {v.city}</span>
                    <span>•</span>
                    <span className="font-bold text-foreground">₹{v.dailyRate}/day</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    RC: <span className="text-emerald-600 font-bold">{v.rcStatus}</span> | Insurance: {v.insuranceCompany} (Valid till {v.insuranceExpiry})
                  </p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center space-x-3 self-end md:self-auto">
                <div className="text-right">
                  {v.status === 'APPROVED' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Live & Approved
                    </span>
                  ) : v.status === 'PENDING_APPROVAL' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      Pending Admin Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {v.status}
                    </span>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">{v.tripCount || 0} trips completed</p>
                </div>

                {v.status === 'PENDING_APPROVAL' && (
                  <button
                    onClick={onSwitchToAdmin}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-bold transition cursor-pointer"
                  >
                    Open in Admin →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
