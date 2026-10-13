import React, { useState } from 'react';
import { X, MapPin, CheckCircle2, IndianRupee, ArrowRight } from 'lucide-react';

export default function VehicleDetailModal({
  vehicle,
  isOpen,
  onClose,
  onProceedToKyc,
}) {
  const [totalDays, setTotalDays] = useState(2);
  const [pickupType, setPickupType] = useState('HUB_PICKUP');

  if (!isOpen || !vehicle) return null;

  const basePrice = vehicle.dailyRate * totalDays;
  const deliveryFee = pickupType === 'DOORSTEP_DELIVERY' ? vehicle.doorstepDeliveryFee : 0;
  const convenienceFee = 49;
  const taxable = basePrice + deliveryFee + convenienceFee;
  const gstAmount = Math.round(taxable * 0.05); // 5% GST
  const securityDeposit = vehicle.securityDeposit;
  const grandTotal = taxable + gstAmount + securityDeposit;

  const handleBook = () => {
    onProceedToKyc({
      vehicle,
      totalDays,
      pickupType,
      basePrice,
      deliveryFee,
      convenienceFee,
      gstAmount,
      securityDeposit,
      grandTotal,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-300 text-slate-950 font-extrabold tracking-wider border border-amber-400">
              {vehicle.registrationNumber}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {vehicle.category} • {vehicle.city} Hub
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Main Top Banner & Photo */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 rounded-xl overflow-hidden bg-muted border border-border h-56 relative">
              <img
                src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-foreground border border-border shadow-xs">
                Host: {vehicle.hostName}
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <h2 className="text-xl font-extrabold text-foreground font-display">{vehicle.title}</h2>
              <p className="text-xs text-muted-foreground flex items-center">
                <MapPin className="w-3.5 h-3.5 text-primary mr-1" />
                {vehicle.areaHub}, {vehicle.city}
              </p>

              {/* RTO Badges */}
              <div className="space-y-1.5 pt-2 border-t border-border text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>RC Status:</span>
                  <span className="font-bold text-emerald-600 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Parivahan Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Insurance:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {vehicle.insuranceCompany}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Valid Until:</span>
                  <span className="text-foreground">{vehicle.insuranceExpiry}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>PUC Validity:</span>
                  <span className="text-emerald-600 font-medium">{vehicle.pucExpiry || 'CMVR Valid'}</span>
                </div>
                {vehicle.fastagId && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>FASTag:</span>
                    <span className="font-mono text-primary text-[11px] font-bold">{vehicle.fastagId}</span>
                  </div>
                )}
                {vehicle.helmetsProvided > 0 && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Helmets:</span>
                    <span className="text-emerald-600 font-semibold">{vehicle.helmetsProvided} ISI Helmets Included</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Duration & Handover Options */}
          <div className="bg-muted/40 p-4 rounded-xl border border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Rental Duration (Days)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={totalDays}
                  onChange={(e) => setTotalDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 bg-card border border-input rounded-xl px-3 py-2 text-sm text-foreground font-bold text-center focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground font-medium">
                  @ ₹{vehicle.dailyRate} / day
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Pickup Method
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setPickupType('HUB_PICKUP')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    pickupType === 'HUB_PICKUP'
                      ? 'bg-accent/50 border-primary text-foreground'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Hub Pickup (Free)
                </button>
                <button
                  type="button"
                  onClick={() => setPickupType('DOORSTEP_DELIVERY')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    pickupType === 'DOORSTEP_DELIVERY'
                      ? 'bg-accent/50 border-primary text-foreground'
                      : 'bg-card border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Doorstep (+₹{vehicle.doorstepDeliveryFee})
                </button>
              </div>
            </div>
          </div>

          {/* Transparent Price Breakdown */}
          <div className="bg-muted/30 p-5 rounded-xl border border-border space-y-2.5 text-xs">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-2 flex items-center">
              <IndianRupee className="w-3.5 h-3.5 text-primary mr-1" />
              Transparent Pricing & Invoicing
            </h4>

            <div className="flex justify-between text-muted-foreground">
              <span>Rental Charges ({totalDays} days × ₹{vehicle.dailyRate})</span>
              <span className="font-semibold text-foreground">₹{basePrice.toLocaleString('en-IN')}</span>
            </div>

            {deliveryFee > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Doorstep Delivery & Handover</span>
                <span className="font-semibold text-foreground">₹{deliveryFee}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Platform & 24x7 Roadside Assistance Fee</span>
              <span className="font-semibold text-foreground">₹{convenienceFee}</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Goods & Services Tax (GST @ 5%)</span>
              <span className="font-semibold text-foreground">₹{gstAmount}</span>
            </div>

            <div className="flex justify-between text-primary font-bold pt-2 border-t border-border">
              <span>Refundable Security Deposit (Held in Escrow)</span>
              <span>₹{securityDeposit.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              * The ₹{securityDeposit} security deposit is 100% refunded to your original UPI account post-trip.
            </p>

            <div className="flex justify-between items-center text-sm font-black text-foreground pt-3 border-t border-border font-display">
              <span>Total Payable Now</span>
              <span className="text-xl text-foreground font-black">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-muted/20 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Payable via UPI / Card</p>
            <p className="text-lg font-black text-foreground font-display">₹{grandTotal.toLocaleString('en-IN')}</p>
          </div>

          <button
            onClick={handleBook}
            className="px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-glow hover:opacity-95 flex items-center space-x-2 transition cursor-pointer"
          >
            <span>Proceed to DigiLocker KYC</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
