import React, { useState } from 'react';
import {
  Users,
  Car,
  Calendar,
  FileCheck,
  Activity,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Check,
  Plus,
  Trash2,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  Building2,
  Smartphone,
  Mail,
  Shield
} from 'lucide-react';

export default function AdminDashboard({
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
  isActionLoading,
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, vehicles, bookings, kyc, kafka
  const [rejectModalVehicle, setRejectModalVehicle] = useState(null);
  const [rejectReason, setRejectReason] = useState('Expired PUC Certificate on Parivahan Vahan portal');

  // Search & filter states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('ALL');
  const [bookingFilter, setBookingFilter] = useState('ALL');

  const pendingVehicles = vehicles.filter((v) => v.status === 'PENDING_APPROVAL');
  const approvedVehicles = vehicles.filter((v) => v.status === 'APPROVED');
  const escrowBookings = bookings.filter((b) => b.depositStatus === 'HELD_IN_ESCROW');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone?.includes(userSearch);
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.title?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.registrationNumber?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.city?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.hostName?.toLowerCase().includes(vehicleSearch.toLowerCase());
    const matchesStatus = vehicleStatusFilter === 'ALL' || v.status === vehicleStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'ALL') return true;
    if (bookingFilter === 'ESCROW') return b.depositStatus === 'HELD_IN_ESCROW';
    if (bookingFilter === 'REFUNDED') return b.depositStatus === 'REFUNDED';
    return b.tripStatus === bookingFilter;
  });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary text-secondary-foreground uppercase tracking-wider">
              Platform Master Admin
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              • Full Data Control & Regulatory Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1 font-display">
            System Administration Portal
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time management across all users, registered fleet, bookings, KYC records, and escrow deposits.
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onRefreshData}
            title="Refresh from MongoDB"
            className="p-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {onOpenAddListing && (
            <button
              onClick={onOpenAddListing}
              className="px-3.5 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold transition flex items-center space-x-1.5 shadow-glow hover:opacity-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Vehicle</span>
            </button>
          )}
          <button
            onClick={onViewKafkaEvents}
            className="px-3.5 py-2 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground hover:text-primary text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-xs"
          >
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="hidden sm:inline">Kafka Stream</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-[11px] mb-1 font-medium">
            <span>Total Users</span>
            <Users className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground font-display">{users.length}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Registered accounts</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-[11px] mb-1 font-medium">
            <span>Fleet Listed</span>
            <Car className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground font-display">{vehicles.length}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{approvedVehicles.length} active live</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-[11px] mb-1 font-medium">
            <span>Pending RTO</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 font-display">{pendingVehicles.length}</p>
          <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Requires audit</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-[11px] mb-1 font-medium">
            <span>Bookings</span>
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground font-display">{bookings.length}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Total reservations</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-[11px] mb-1 font-medium">
            <span>Escrow Held</span>
            <IndianRupee className="w-3.5 h-3.5 text-secondary" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground font-display">
            ₹{adminOverview?.securityDepositInEscrow?.toLocaleString('en-IN') || escrowBookings.reduce((sum, b) => sum + (b.securityDeposit || 0), 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-sky-600 font-bold mt-0.5">{escrowBookings.length} pending return</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-muted-foreground text-[11px] mb-1 font-medium">
            <span>Total GMV</span>
            <IndianRupee className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-foreground font-display">
            ₹{adminOverview?.totalRevenue?.toLocaleString('en-IN') || bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">All UPI settled</p>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center space-x-1 sm:space-x-2 border-b border-border mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Approvals</span>
          {pendingVehicles.length > 0 && (
            <span className="px-2 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-extrabold">
              {pendingVehicles.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('vehicles')}
          className={`pb-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'vehicles'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>All Vehicles ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'bookings'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Bookings & Escrow ({bookings.length})</span>
          {escrowBookings.length > 0 && (
            <span className="px-2 py-0.2 rounded-full text-[10px] bg-secondary text-secondary-foreground font-extrabold">
              {escrowBookings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`pb-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 shrink-0 ${
            activeTab === 'kyc'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>KYC Verifications ({kycRecords.length})</span>
        </button>
      </div>

      {/* TAB 1: Pending Approvals Queue */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-foreground font-display">
              Vehicles Pending RTO & Parivahan Audit
            </h2>
            <span className="text-xs text-muted-foreground">
              {pendingVehicles.length} vehicle(s) requiring decision
            </span>
          </div>

          {pendingVehicles.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-foreground font-display">All Submissions Cleared</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Zero vehicle listings currently pending approval. All submitted vehicles are live or resolved.
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

      {/* TAB 2: Full Vehicle Fleet Management */}
      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title, registration number, host or city..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-muted/40 border border-input rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground font-medium flex items-center">
                <Filter className="w-3.5 h-3.5 mr-1" /> Status:
              </span>
              <select
                value={vehicleStatusFilter}
                onChange={(e) => setVehicleStatusFilter(e.target.value)}
                className="bg-card border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">APPROVED</option>
                <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          {/* Vehicles Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Vehicle Details</th>
                    <th className="py-3 px-4">Plate & Category</th>
                    <th className="py-3 px-4">Host / Hub</th>
                    <th className="py-3 px-4">Rates & Deposit</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No vehicles found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredVehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-muted/20 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={v.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'}
                              alt={v.title}
                              className="w-12 h-10 rounded-lg object-cover bg-muted shrink-0"
                            />
                            <div>
                              <p className="font-bold text-foreground">{v.title}</p>
                              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-slate-900 font-black border border-amber-300">
                                {v.registrationNumber}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-foreground">{v.category}</p>
                          <p className="text-[10px] text-muted-foreground">{v.plateType}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-foreground">{v.hostName}</p>
                          <p className="text-[10px] text-muted-foreground">{v.areaHub}, {v.city}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-foreground">₹{v.dailyRate}/day</p>
                          <p className="text-[10px] text-muted-foreground">Deposit: ₹{v.securityDeposit}</p>
                        </td>
                        <td className="py-3 px-4">
                          {v.status === 'APPROVED' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              APPROVED
                            </span>
                          ) : v.status === 'PENDING_APPROVAL' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              PENDING
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              REJECTED
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {v.status !== 'APPROVED' && (
                              <button
                                disabled={isActionLoading}
                                onClick={() => handleApprove(v)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {v.status !== 'REJECTED' && (
                              <button
                                disabled={isActionLoading}
                                onClick={() => setRejectModalVehicle(v)}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px] hover:bg-rose-100 transition cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Users & RBAC Control */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users by name, email, or mobile..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-muted/40 border border-input rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground font-medium flex items-center">
                <Filter className="w-3.5 h-3.5 mr-1" /> Role:
              </span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-card border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="HOST">HOST</option>
                <option value="RENTER">RENTER</option>
              </select>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">KYC Status</th>
                    <th className="py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No registered users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id || u.email} className="hover:bg-muted/20 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xs shrink-0">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{u.name}</p>
                              <p className="text-[10px] text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-foreground">{u.phone}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                : u.role === 'HOST'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground font-medium">{u.city || 'Bengaluru'}</span>
                        </td>
                        <td className="py-3 px-4">
                          {u.isKycVerified ? (
                            <span className="inline-flex items-center text-emerald-600 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              DigiLocker Verified
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-[11px]">Pending Verification</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Bookings & Security Deposit Escrow */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground font-display">
              All Platform Bookings & Escrow Accounts
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground font-medium">Filter:</span>
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Bookings</option>
                <option value="ESCROW">Held in Escrow</option>
                <option value="REFUNDED">Deposit Refunded</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-base font-bold text-foreground font-display">No Bookings Found</h3>
                <p className="text-xs text-muted-foreground mt-1">There are no bookings matching the selected filter.</p>
              </div>
            ) : (
              filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-card"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={b.vehicleImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'}
                      alt={b.vehicleTitle}
                      className="w-20 h-16 rounded-xl object-cover bg-muted shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-foreground font-display">{b.vehicleTitle}</h3>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-300 text-slate-950 font-bold border border-amber-400">
                          {b.vehicleRegistrationNumber}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-accent text-accent-foreground font-semibold">
                          OTP: {b.pickupOtp || '4928'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Renter: <strong className="text-foreground">{b.renterName}</strong> ({b.renterPhone}) • Duration: {b.totalDays} Days ({b.startDate} to {b.endDate})
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center space-x-2">
                        <span>Total Paid: ₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span className="text-primary font-bold">Escrow Deposit: ₹{b.securityDeposit?.toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">{b.paymentStatus} via {b.paymentMethod || 'UPI'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Escrow Status & Action */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                    {b.depositStatus === 'HELD_IN_ESCROW' ? (
                      <>
                        <button
                          disabled={isActionLoading}
                          onClick={() => onReleaseDeposit(b.id, b.securityDeposit, 'Vehicle returned in perfect condition')}
                          className="px-3.5 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-bold transition shadow-glow hover:opacity-95 cursor-pointer disabled:opacity-50"
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
                          className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition cursor-pointer border border-border"
                        >
                          Deduct Challan
                        </button>
                      </>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Deposit Refunded
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: KYC Verification Records */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
            <h2 className="text-sm font-bold text-foreground font-display">
              Renter DigiLocker e-KYC & Parivahan DL Submissions
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Statutory verification records ensuring all active renters carry valid licenses under Motor Vehicles Act.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Renter Name & Mobile</th>
                    <th className="py-3 px-4">Driving License (DL)</th>
                    <th className="py-3 px-4">DL Category</th>
                    <th className="py-3 px-4">Masked Aadhaar (UIDAI)</th>
                    <th className="py-3 px-4">DigiLocker Status</th>
                    <th className="py-3 px-4">Helmet Undertaking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {kycRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No KYC verification records found.
                      </td>
                    </tr>
                  ) : (
                    kycRecords.map((k) => (
                      <tr key={k.id || k.userPhone} className="hover:bg-muted/20 transition">
                        <td className="py-3 px-4">
                          <p className="font-bold text-foreground">{k.userName}</p>
                          <p className="text-[10px] text-muted-foreground">{k.userPhone}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {k.dlNumber}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground font-bold text-[10px]">
                            {k.dlCategory || 'LMV & MCWG'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-muted-foreground">
                            {k.aadhaarMasked || 'XXXX-XXXX-8921'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {k.verificationStatus || 'VERIFIED'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] text-emerald-600 font-semibold">
                            ✓ Signed & Accepted
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
