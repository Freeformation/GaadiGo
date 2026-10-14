import React from 'react';
import { Calendar, Key, ShieldCheck, IndianRupee, Clock, CheckCircle2, ArrowRight, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RenterBookingsView({
  bookings = [],
  onExploreVehicles,
  onViewVoucher,
  hideHeader = false,
}) {
  const { user } = useAuth();

  // Filter bookings belonging to this renter (by phone or email, or all if demo)
  const myBookings = bookings.filter((b) => {
    if (!user) return true;
    if (user.role === 'ADMIN') return true;
    return b.renterPhone === user.phone || b.renterEmail === user.email || b.renterName === user.name;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent text-accent-foreground border border-primary/20">
                Renter Portal
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                • {user ? `Signed in as ${user.name} (${user.phone})` : 'Guest Session'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1 font-display">
              My Booked Trips & Digital Keys
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              View booking status, pickup OTP, digital handover agreements, and security deposit refunds.
            </p>
          </div>

          <button
            onClick={onExploreVehicles}
            className="px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-glow flex items-center space-x-2 transition cursor-pointer self-start sm:self-auto hover:opacity-95"
          >
            <span>Rent Another Vehicle</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bookings List */}
      {myBookings.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4 text-primary">
            <Key className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-foreground font-display">No active bookings yet</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-6">
            You haven’t booked any scooties, bikes or cars yet. Pick a verified vehicle from our catalog and hit the road!
          </p>
          <button
            onClick={onExploreVehicles}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
          >
            Explore Vehicle Fleet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myBookings.map((b) => (
            <div
              key={b.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-card hover:border-primary/30 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Vehicle & Date Info */}
              <div className="flex items-start sm:items-center space-x-4">
                <img
                  src={b.vehicleImage || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'}
                  alt={b.vehicleTitle}
                  className="w-24 h-20 rounded-xl object-cover bg-muted shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-black text-foreground font-display">{b.vehicleTitle}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-300 text-slate-950 font-bold border border-amber-400">
                      {b.vehicleRegistrationNumber}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-primary">{b.vehicleCategory}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                      {b.startDate} to {b.endDate} ({b.totalDays} days)
                    </span>
                    <span>•</span>
                    <span>Pickup: {b.pickupType}</span>
                  </p>

                  <div className="flex items-center space-x-4 mt-3 text-xs">
                    <div className="flex items-center space-x-1.5 bg-muted/60 px-2.5 py-1 rounded-lg border border-border">
                      <span className="text-[11px] text-muted-foreground font-medium">Pickup OTP:</span>
                      <span className="font-mono font-black text-foreground text-xs tracking-wider">
                        {b.pickupOtp || '4928'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-emerald-600 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{b.paymentStatus} via {b.paymentMethod || 'UPI'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Deposit Status */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-muted-foreground">Total Paid</p>
                  <p className="text-xl font-black text-foreground font-display">
                    ₹{b.totalAmount?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Incl. ₹{b.securityDeposit} deposit & 5% GST
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-muted-foreground">Deposit Escrow</p>
                  <div className="mt-0.5">
                    {b.depositStatus === 'REFUNDED' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Refunded to UPI
                      </span>
                    ) : b.depositStatus === 'HELD_IN_ESCROW' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Held in Escrow
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                        {b.depositStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Txn: {b.paymentTransactionId ? b.paymentTransactionId.slice(-8) : 'UPI-CONFIRMED'}
                  </p>
                </div>

                <button
                  onClick={() => onViewVoucher && onViewVoucher(b)}
                  className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>View Voucher</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
