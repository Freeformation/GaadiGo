import React, { useState, useEffect } from 'react';
import { IndianRupee, Sparkles, TrendingUp, Check, ArrowRight, RefreshCw } from 'lucide-react';

const CATEGORY_META = {
  SCOOTY: {
    name: 'Honda Activa & Scooters',
    icon: '🛵',
    fuel: 'Petrol',
    defaultRate: 449,
    defaultDeposit: 500,
  },
  EV: {
    name: 'Green Electric EVs (Ather/Ola/Nexon)',
    icon: '⚡',
    fuel: 'Electric',
    defaultRate: 1249,
    defaultDeposit: 2000,
  },
  BIKE: {
    name: 'Royal Enfield & Motorcycles',
    icon: '🏍️',
    fuel: 'Petrol',
    defaultRate: 899,
    defaultDeposit: 1500,
  },
  HATCHBACK: {
    name: 'Maruti Swift & City Hatchbacks',
    icon: '🚗',
    fuel: 'Petrol',
    defaultRate: 1499,
    defaultDeposit: 2500,
  },
  SUV: {
    name: 'Mahindra Thar 4x4 & Full SUVs',
    icon: '🚙',
    fuel: 'Diesel',
    defaultRate: 3499,
    defaultDeposit: 5000,
  },
};

export default function HostEarningsCalculator({ onOpenAddListing }) {
  const [categoryRates, setCategoryRates] = useState([]);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('SCOOTY');
  const [daysShared, setDaysShared] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vehicles/category-rates')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoryRates(data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch dynamic category rates, falling back to defaults:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compute live values for selected category
  const activeRateData = categoryRates.find((r) => r.category === selectedCategoryKey);
  const meta = CATEGORY_META[selectedCategoryKey] || CATEGORY_META.SCOOTY;

  const currentDailyRate = activeRateData ? activeRateData.averageDailyRate : meta.defaultRate;
  const currentDeposit = activeRateData ? activeRateData.averageDeposit : meta.defaultDeposit;
  const liveFleetCount = activeRateData ? activeRateData.count : 0;

  const estimatedMonthlyGross = currentDailyRate * daysShared;
  const platformFee = Math.round(estimatedMonthlyGross * 0.15); // 15% platform management & insurance
  const netEarnings = estimatedMonthlyGross - platformFee;
  const annualEarnings = netEarnings * 12;

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span>Dynamic Host Earnings (Real MongoDB Rates)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-display">
            How Much Can You Earn by Renting Out Your Vehicle?
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base font-medium">
            Based on active rental listings in India. Direct weekly UPI payouts straight into your bank account.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls: Vehicle select & slider */}
          <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              1. Choose Vehicle Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              {Object.keys(CATEGORY_META).map((key) => {
                const itemMeta = CATEGORY_META[key];
                const matchedRate = categoryRates.find((r) => r.category === key);
                const rate = matchedRate ? matchedRate.averageDailyRate : itemMeta.defaultRate;
                const count = matchedRate ? matchedRate.count : 0;
                const isSelected = selectedCategoryKey === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCategoryKey(key)}
                    className={`flex items-center p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-accent/50 border-primary text-foreground font-bold shadow-xs'
                        : 'bg-card border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                    }`}
                  >
                    <span className="text-2xl mr-3">{itemMeta.icon}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate text-foreground">{itemMeta.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Avg ₹{rate}/day • {count > 0 ? `${count} in live fleet` : itemMeta.fuel}
                      </p>
                    </div>
                  </button>
                );
              })}
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
                <span>Gross Rental Income ({daysShared}d × ₹{currentDailyRate})</span>
                <span className="font-semibold text-white">₹{estimatedMonthlyGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-secondary-foreground/80">
                <span>Platform Admin & 24x7 RSA Fee (15%)</span>
                <span className="font-semibold text-white">- ₹{platformFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-secondary-foreground/80">
                <span>Security Deposit from Renters</span>
                <span className="font-semibold text-primary-glow">₹{currentDeposit} (Held in Escrow)</span>
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
