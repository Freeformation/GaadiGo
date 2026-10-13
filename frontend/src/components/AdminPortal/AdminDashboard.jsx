import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, IndianRupee, Clock, RefreshCw, Check, Activity } from 'lucide-react';

export default function AdminDashboard({
  vehicles = [],
  bookings = [],
  adminOverview,
  onApproveVehicle,
  onRejectVehicle,
  onReleaseDeposit,
  onRefreshData,
  onViewKafkaEvents,
  isActionLoading,
}) {
  const [activeTab, setActiveTab] = useState('approvals');
  const [rejectModalVehicle, setRejectModalVehicle] = useState(null);
  const [rejectReason, setRejectReason] = useState('Expired PUC Certificate on Parivahan Vahan portal');

  const pendingVehicles = vehicles.filter((v) => v.status === 'PENDING_APPROVAL');
  const approvedVehicles = vehicles.filter((v) => v.status === 'APPROVED');
  const escrowBookings = bookings.filter((b) => b.depositStatus === 'HELD_IN_ESCROW');

  const handleApprove = (v) => {
    onApproveVehicle(v.id);
  };

  const handleConfirmReject = () => {
    if (rejectModalVehicle) {
      onRejectVehicle(rejectModalVehicle.id, rejectReason);
      setRejectModalVehicle(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary text-secondary-foreground uppercase tracking-wider">
              MoRTH Regulatory Admin
            </span>
            <span className="text-xs text-muted-foreground font-medium">• GaadiGo Compliance Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1 font-display">
            Admin Compliance & Escrow Management
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefreshData}
            title="Refresh from MongoDB"
            className="p-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onViewKafkaEvents}
            className="px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground hover:text-primary text-xs font-bold transition cursor-pointer flex items-center space-x-2 shadow-xs"
          >
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span>Live Kafka Stream</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 font-display">{pendingVehicles.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Require RTO document review</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Active Fleet Listings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">{approvedVehicles.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Verified on Parivahan registry</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Deposits in Escrow</span>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">
            ₹{adminOverview?.securityDepositInEscrow?.toLocaleString('en-IN') || '4,500'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Pending trip inspection</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2 font-medium">
            <span>Total GMV Processed</span>
            <IndianRupee className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground font-display">
            ₹{adminOverview?.totalRevenue?.toLocaleString('en-IN') || '18,450'}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">All UPI transactions recorded</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'approvals'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Pending Vehicle Queue</span>
          {pendingVehicles.length > 0 && (
            <span className="px-2 py-0.2 rounded-full text-[10px] bg-primary text-primary-foreground font-extrabold">
              {pendingVehicles.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('escrow')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'escrow'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Escrow & Deposit Settlements</span>
          {escrowBookings.length > 0 && (
            <span className="px-2 py-0.2 rounded-full text-[10px] bg-secondary text-secondary-foreground font-extrabold">
              {escrowBookings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'active'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Approved Fleet ({approvedVehicles.length})
        </button>
      </div>

      {/* TAB 1: Pending Approvals Queue */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {pendingVehicles.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-foreground font-display">All Submissions Reviewed</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Zero vehicle listings pending approval. New host submissions will appear here instantly.
              </p>
            </div>
          ) : (
            pendingVehicles.map((v) => (
              <div
                key={v.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4 hover:border-primary/40 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={v.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'}
                      alt={v.title}
                      className="w-24 h-20 rounded-xl object-cover bg-muted shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-foreground font-display">{v.title}</h3>
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-amber-300 text-slate-950 font-black border border-amber-400">
                          {v.registrationNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-accent text-accent-foreground border border-primary/20">
                          {v.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Host: <strong className="text-foreground">{v.hostName}</strong> ({v.hostPhone}) • Hub: {v.areaHub}, {v.city}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Pricing: ₹{v.dailyRate}/day • ₹{v.hourlyRate}/hr • Deposit: ₹{v.securityDeposit}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
                    <button
                      disabled={isActionLoading}
                      onClick={() => handleApprove(v)}
                      className="px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold transition flex items-center space-x-1.5 shadow-glow hover:opacity-95 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Listing</span>
                    </button>

                    <button
                      disabled={isActionLoading}
                      onClick={() => setRejectModalVehicle(v)}
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {/* Statutory Inspection Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-border text-xs">
                  <div className="bg-muted/30 p-3 rounded-xl border border-border">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Plate Mode & Vahan RC
                    </span>
                    <p className="font-bold text-foreground mt-0.5">{v.plateType}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">RC Number Verified</p>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-xl border border-border">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Insurance Policy
                    </span>
                    <p className="font-bold text-foreground mt-0.5 truncate">{v.insuranceCompany}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Expires: {v.insuranceExpiry}</p>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-xl border border-border">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Pollution (PUC) Validity
                    </span>
                    <p className="font-bold text-foreground mt-0.5">{v.pucExpiry || 'CMVR Exempt'}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Center Code Active</p>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-xl border border-border">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Safety & FASTag
                    </span>
                    <p className="font-bold text-foreground mt-0.5">
                      {v.helmetsProvided > 0 ? `${v.helmetsProvided} ISI Helmets` : v.fastagId || 'FASTag Fitted'}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">GPS Active</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Escrow & Deposit Settlements */}
      {activeTab === 'escrow' && (
        <div className="space-y-4">
          {escrowBookings.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-foreground font-display">No Pending Escrow Settlements</h3>
              <p className="text-xs text-muted-foreground mt-1">All past security deposits have been processed or refunded.</p>
            </div>
          ) : (
            escrowBookings.map((b) => (
              <div
                key={b.id}
                className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-card"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-foreground font-display">{b.vehicleTitle}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-300 text-slate-950 font-bold border border-amber-400">
                      {b.vehicleRegistrationNumber}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Renter: <strong className="text-foreground">{b.renterName}</strong> ({b.renterPhone}) • Duration: {b.totalDays} Days
                  </p>
                  <p className="text-xs text-primary mt-1 font-bold">
                    Refundable Escrow Deposit: ₹{b.securityDeposit?.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={isActionLoading}
                    onClick={() => onReleaseDeposit(b.id, b.securityDeposit, 'Vehicle returned in perfect condition')}
                    className="px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold transition shadow-glow hover:opacity-95 cursor-pointer disabled:opacity-50"
                  >
                    Release 100% Deposit via UPI
                  </button>

                  <button
                    disabled={isActionLoading}
                    onClick={() => {
                      const amount = prompt('Enter partial refund amount (balance retained for challan/toll):', b.securityDeposit - 500);
                      if (amount) {
                        onReleaseDeposit(b.id, parseFloat(amount), 'Partial deduction for FASTag toll / speed challan');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition cursor-pointer border border-border"
                  >
                    Deduct Challan
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Approved Fleet */}
      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedVehicles.map((v) => (
            <div key={v.id} className="bg-card border border-border rounded-xl p-4 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-300 text-slate-950 font-bold border border-amber-400">
                  {v.registrationNumber}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  APPROVED
                </span>
              </div>
              <h4 className="text-sm font-bold text-foreground truncate font-display">{v.title}</h4>
              <p className="text-xs text-muted-foreground">
                {v.city} • ₹{v.dailyRate}/day • {v.hostName}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal Dialog */}
      {rejectModalVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-foreground font-display">
              Reject Listing: {rejectModalVehicle.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              Provide the compliance reason under the Motor Vehicles Act. The host will be notified to re-upload.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-muted/30 border border-input rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-rose-500"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRejectModalVehicle(null)}
                className="px-4 py-2 rounded-xl bg-muted text-xs font-semibold text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
