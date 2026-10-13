import React, { useState } from 'react';
import { X, Calendar, MapPin, Fuel, Shield, CheckCircle2, IndianRupee, Clock, Zap, ArrowRight, ShieldCheck, User } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-extrabold tracking-wider">
              {vehicle.registrationNumber}
            </span>
            <span className="text-xs text-slate-400">
              {vehicle.category} • {vehicle.city} Hub
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Main Top Banner & Photo */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 rounded-xl overflow-hidden bg-slate-800 border border-slate-800 h-56 relative">
              <img
                src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-white border border-slate-700">
                Host: {vehicle.hostName}
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <h2 className="text-xl font-black text-white">{vehicle.title}</h2>
              <p className="text-xs text-slate-400 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                {vehicle.areaHub}, {vehicle.city}
              </p>

              {/* RTO Badges */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">RC Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Parivahan Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Insurance:</span>
                  <span className="font-semibold text-white truncate max-w-[150px]">
                    {vehicle.insuranceCompany}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Valid Until:</span>
                  <span className="text-slate-200">{vehicle.insuranceExpiry}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">PUC Validity:</span>
                  <span className="text-emerald-400 font-medium">{vehicle.pucExpiry || 'CMVR Valid'}</span>
                </div>
                {vehicle.fastagId && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">FASTag:</span>
                    <span className="font-mono text-amber-300 text-[11px]">{vehicle.fastagId}</span>
                  </div>
                )}
                {vehicle.helmetsProvided > 0 && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Helmets:</span>
                    <span className="text-emerald-400 font-semibold">{vehicle.helmetsProvided} ISI Helmets Included</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Duration & Handover Options */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Rental Duration (Days)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={totalDays}
                  onChange={(e) => setTotalDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-bold text-center focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">
                  @ ₹{vehicle.dailyRate} / day
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Pickup Method
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setPickupType('HUB_PICKUP')}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    pickupType === 'HUB_PICKUP'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Hub Pickup (Free)
                </button>
                <button
                  type="button"
                  onClick={() => setPickupType('DOORSTEP_DELIVERY')}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    pickupType === 'DOORSTEP_DELIVERY'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Doorstep (+₹{vehicle.doorstepDeliveryFee})
                </button>
              </div>
            </div>
          </div>

          {/* Transparent Price Breakdown */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-2.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2 flex items-center">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              Transparent Pricing & Invoicing
            </h4>

            <div className="flex justify-between text-slate-400">
              <span>Rental Charges ({totalDays} days × ₹{vehicle.dailyRate})</span>
              <span className="font-semibold text-slate-200">₹{basePrice.toLocaleString('en-IN')}</span>
            </div>

            {deliveryFee > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Doorstep Delivery & Handover</span>
                <span className="font-semibold text-slate-200">₹{deliveryFee}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>Platform & 24x7 Roadside Assistance Fee</span>
              <span className="font-semibold text-slate-200">₹{convenienceFee}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Goods & Services Tax (GST @ 5%)</span>
              <span className="font-semibold text-slate-200">₹{gstAmount}</span>
            </div>

            <div className="flex justify-between text-amber-300/90 pt-2 border-t border-slate-800">
              <span className="font-medium">Refundable Security Deposit (Held in Escrow)</span>
              <span className="font-bold">₹{securityDeposit.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              * The ₹{securityDeposit} security deposit is 100% refunded to your UPI account post-trip.
            </p>

            <div className="flex justify-between items-center text-sm font-black text-white pt-3 border-t border-slate-700">
              <span>Total Payable Now</span>
              <span className="text-xl text-emerald-400 font-black">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Payable via UPI / Card</p>
            <p className="text-lg font-black text-white">₹{grandTotal.toLocaleString('en-IN')}</p>
          </div>

          <button
            onClick={handleBook}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition cursor-pointer"
          >
            <span>Proceed to DigiLocker KYC</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
