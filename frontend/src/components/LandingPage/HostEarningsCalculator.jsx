import React, { useState } from 'react';
import { IndianRupee, Sparkles, TrendingUp, Check, ArrowRight } from 'lucide-react';

const VEHICLE_PRESETS = [
  {
    id: 'activa',
    name: 'Honda Activa 6G / TVS Jupiter',
    category: 'SCOOTY',
    dailyRate: 499,
    typicalMonthly: 14970,
    fuel: 'Petrol',
    deposit: 500,
    icon: '🛵',
  },
  {
    id: 'ather',
    name: 'Ather 450X / Ola S1 Pro (EV)',
    category: 'EV SCOOTY',
    dailyRate: 649,
    typicalMonthly: 19470,
    fuel: 'Electric',
    deposit: 1000,
    icon: '⚡',
  },
  {
    id: 'bullet',
    name: 'Royal Enfield Classic 350',
    category: 'MOTORCYCLE',
    dailyRate: 999,
    typicalMonthly: 29970,
    fuel: 'Petrol',
    deposit: 1500,
    icon: '🏍️',
  },
  {
    id: 'swift',
    name: 'Maruti Swift / Baleno',
    category: 'HATCHBACK',
    dailyRate: 1599,
    typicalMonthly: 47970,
    fuel: 'Petrol',
    deposit: 2500,
    icon: '🚗',
  },
  {
    id: 'nexon_ev',
    name: 'Tata Nexon EV / Punch EV',
    category: 'ELECTRIC SUV',
    dailyRate: 2199,
    typicalMonthly: 65970,
    fuel: 'Electric',
    deposit: 3500,
    icon: '🔋',
  },
  {
    id: 'thar',
    name: 'Mahindra Thar 4x4 / Scorpio-N',
    category: 'SUV / 4X4',
    dailyRate: 3799,
    typicalMonthly: 113970,
    fuel: 'Diesel',
    deposit: 5000,
    icon: '🚙',
  },
];

export default function HostEarningsCalculator({ onOpenAddListing }) {
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_PRESETS[0]);
  const [daysShared, setDaysShared] = useState(20);

  const estimatedMonthlyGross = selectedVehicle.dailyRate * daysShared;
  const platformFee = Math.round(estimatedMonthlyGross * 0.15); // 15% platform management & insurance
  const netEarnings = estimatedMonthlyGross - platformFee;
  const annualEarnings = netEarnings * 12;

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span>Host Earnings Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-display">
            How Much Can You Earn by Renting Out Your Vehicle?
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base font-medium">
            Select your vehicle model and how many days a month it stays parked. Direct weekly UPI payouts straight into your bank account.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls: Vehicle select & slider */}
          <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              1. Choose Your Vehicle Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              {VEHICLE_PRESETS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`flex items-center p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedVehicle.id === v.id
                      ? 'bg-accent/50 border-primary text-foreground font-bold shadow-xs'
                      : 'bg-card border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                  }`}
                >
                  <span className="text-2xl mr-3">{v.icon}</span>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate text-foreground">{v.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      ₹{v.dailyRate}/day • {v.fuel}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Slider */}
            <div className="bg-muted/40 p-5 rounded-xl border border-input mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                  2. Days Shared Per Month
                </span>
                <span className="text-sm font-extrabold text-primary bg-accent px-3 py-1 rounded-lg border border-primary/20">
                  {daysShared} Days / Month
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                value={daysShared}
                onChange={(e) => setDaysShared(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-2 font-semibold">
                <span>Weekends only (6-8 days)</span>
                <span>Part-time (15 days)</span>
                <span>Full month (30 days)</span>
              </div>
            </div>

            {/* Host Perks Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground font-medium">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>Zero listing or onboarding charges</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>100% Comprehensive insurance coverage</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>Renter DigiLocker & DL pre-screened</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>Weekly automated UPI bank payouts</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-secondary text-secondary-foreground border border-secondary rounded-2xl p-7 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-primary flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Estimated Take-Home
              </span>
              <span className="text-[11px] text-secondary-foreground/70">Post 15% Platform & RSA fee</span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display">
                  ₹{netEarnings.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-semibold text-secondary-foreground/80">/ month</span>
              </div>
              <p className="text-xs text-primary-glow font-bold mt-1">
                ≈ ₹{annualEarnings.toLocaleString('en-IN')} per year passive income
              </p>
            </div>

            <div className="space-y-2.5 py-4 border-y border-white/10 text-xs mb-6">
              <div className="flex justify-between text-secondary-foreground/80">
                <span>Gross Rental Income ({daysShared}d × ₹{selectedVehicle.dailyRate})</span>
                <span className="font-semibold text-white">₹{estimatedMonthlyGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-secondary-foreground/80">
                <span>Platform Admin & 24x7 RSA Fee (15%)</span>
                <span className="font-semibold text-white">- ₹{platformFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-secondary-foreground/80">
                <span>Security Deposit from Renters</span>
                <span className="font-semibold text-primary-glow">₹{selectedVehicle.deposit} (Held in Escrow)</span>
              </div>
            </div>

            <button
              onClick={onOpenAddListing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-glow hover:opacity-95 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <span>List This Vehicle & Start Earning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
