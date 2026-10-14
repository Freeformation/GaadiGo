import React, { useState } from 'react';
import {
  Search,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  IndianRupee,
  ArrowRight,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function HeroSection({
  selectedCity,
  setSelectedCity,
  cities = ['All Cities'],
  onSearchVehicles,
  onOpenAddListing,
}) {
  const [vehicleType, setVehicleType] = useState('ALL');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearchVehicles({ city: selectedCity, category: vehicleType, pickupDate, returnDate });
  };

  const handleFindVehicle = () => {
    const el = document.getElementById('fleet-search-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onSearchVehicles({ city: selectedCity, category: vehicleType, pickupDate, returnDate });
    }
  };

  return (
    <section className="relative overflow-hidden pb-16 lg:pb-20">
      {/* 1. Main Visual Hero Banner - 100% Full Width Edge-to-Edge */}
      <div className="w-full relative overflow-hidden min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center bg-slate-950 mb-10 sm:mb-14">
        {/* Background Hero Image - Full Bleed */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-right sm:bg-center"
          style={{ backgroundImage: `url('/images/hero-bg.png')` }}
        />

        {/* Left-to-right cinematic contrast gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent sm:from-slate-950/90 sm:via-slate-950/50 sm:to-transparent pointer-events-none" />

        {/* Hero Content Overlay - Aligned to Global max-w-7xl Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>KYC-verified renters • Insured vehicles</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-display">
              Your ride, <span className="text-primary">on rent.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-200 font-medium leading-relaxed max-w-xl">
              Scooty for the day, car for the weekend. Rent from trusted local owners — or put your own vehicle to work.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={handleFindVehicle}
                className="px-6 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-glow hover:opacity-95 transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Find a vehicle
              </button>
              <button
                onClick={onOpenAddListing}
                className="px-6 py-3.5 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 hover:border-white/40 text-white font-bold text-sm transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                List & earn
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search Box Card & Trust Badges - Unified max-w-7xl Container Width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fleet Search Box Card */}
        <div
          id="fleet-search-card"
          className="bg-card text-card-foreground border border-border rounded-2xl p-5 sm:p-8 shadow-card hover:shadow-card-hover transition-shadow w-full scroll-mt-24 mb-8"
        >
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 pb-5 border-b border-border overflow-x-auto scrollbar-none">
            {[
              { id: 'ALL', label: 'All Fleet' },
              { id: 'SCOOTY', label: '🛵 Scooty / Activa' },
              { id: 'BIKE', label: '🏍️ Royal Enfield & Bikes' },
              { id: 'HATCHBACK', label: '🚗 City Hatchbacks' },
              { id: 'SUV', label: '🚙 Thar & 7-Seater SUVs' },
              { id: 'EV', label: '⚡ Green EVs' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setVehicleType(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  vehicleType === tab.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
            {/* City */}
            <div className="bg-muted/40 p-3.5 rounded-xl border border-input focus-within:border-primary/50 transition">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-primary mr-1" />
                City / Hub
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c} value={c} className="bg-card text-foreground">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Date */}
            <div className="bg-muted/40 p-3.5 rounded-xl border border-input focus-within:border-primary/50 transition">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 text-primary mr-1" />
                Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer"
              />
            </div>

            {/* Return Date */}
            <div className="bg-muted/40 p-3.5 rounded-xl border border-input focus-within:border-primary/50 transition">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 text-primary-glow mr-1" />
                Drop-off Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer"
              />
            </div>

            {/* Search Rides CTA */}
            <div className="flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[52px] bg-gradient-primary text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 shadow-glow hover:opacity-95 transition cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Rides</span>
              </button>
            </div>
          </form>

          {/* Host Fast-Track Callout inside Card */}
          <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-accent/30 p-4 sm:p-5 rounded-xl border border-primary/10">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shrink-0 shadow-xs">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-foreground">
                  Own a scooty, bike or car? Earn ₹15,000 – ₹50,000/mo
                  <span className="ml-2 px-2 py-0.5 text-[10px] bg-primary/10 text-primary font-extrabold rounded-full">
                    Zero Listing Fee
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Parivahan RC verification • Full insurance coverage • Weekly bank payouts
                </p>
              </div>
            </div>
            <button
              onClick={onOpenAddListing}
              className="px-4 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold rounded-xl text-xs whitespace-nowrap flex items-center space-x-1.5 transition cursor-pointer shrink-0"
            >
              <span>List Your Vehicle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Four Core Feature Badges - Full w-full width across max-w-7xl */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {[
            {
              title: 'DigiLocker & DL KYC',
              desc: 'UIDAI masked Aadhaar & Parivahan DL check',
              icon: ShieldCheck,
              accent: 'text-primary',
            },
            {
              title: '100% Insured Fleet',
              desc: 'Comprehensive coverage & zero host liability',
              icon: CheckCircle2,
              accent: 'text-primary',
            },
            {
              title: 'FASTag Auto-Toll',
              desc: 'Seamless highway electronic toll pass',
              icon: Zap,
              accent: 'text-primary',
            },
            {
              title: 'Instant Escrow Refund',
              desc: 'Security deposit auto-refunded to UPI',
              icon: IndianRupee,
              accent: 'text-primary',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-4 text-left shadow-xs hover:border-primary/30 transition"
              >
                <Icon className={`w-5 h-5 ${item.accent} mb-2`} />
                <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
