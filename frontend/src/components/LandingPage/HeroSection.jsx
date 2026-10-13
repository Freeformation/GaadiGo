import React, { useState } from 'react';
import { Search, Calendar, MapPin, Sparkles, ShieldCheck, IndianRupee, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { CITIES } from '../Navbar';

export default function HeroSection({
  selectedCity,
  setSelectedCity,
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

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20">
      {/* Background radial warmth */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-accent/50 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Title & Pitch */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-accent border border-primary/20 text-accent-foreground text-xs font-bold mb-4 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>India’s Premier Self-Drive & P2P Vehicle Sharing Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1] font-display">
            Your ride, on rent. <br className="hidden sm:inline" />
            <span className="text-primary">Anywhere, anytime.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Rent verified scooties, motorbikes & cars directly from verified local hosts.
            Protected by DigiLocker KYC, commercial insurance, and automated FASTag tolls.
          </p>
        </div>

        {/* Hero Search Box Card */}
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 sm:p-7 shadow-card hover:shadow-card-hover transition-shadow max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 pb-4 border-b border-border overflow-x-auto scrollbar-none">
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
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
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {/* City */}
            <div className="bg-muted/40 p-3 rounded-xl border border-input focus-within:border-primary/50 transition">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-primary mr-1" />
                City / Hub
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-card text-foreground">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Date */}
            <div className="bg-muted/40 p-3 rounded-xl border border-input focus-within:border-primary/50 transition">
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
            <div className="bg-muted/40 p-3 rounded-xl border border-input focus-within:border-primary/50 transition">
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
                className="w-full h-full min-h-[50px] bg-gradient-primary text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 shadow-glow hover:opacity-95 transition cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Rides</span>
              </button>
            </div>
          </form>

          {/* Host Fast-Track Callout inside Card */}
          <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-accent/30 p-4 rounded-xl border border-primary/10">
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
              className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold rounded-xl text-xs whitespace-nowrap flex items-center space-x-1.5 transition cursor-pointer shrink-0"
            >
              <span>List Your Vehicle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 max-w-4xl mx-auto">
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
                className="bg-card border border-border rounded-xl p-3.5 text-left shadow-xs hover:border-primary/30 transition"
              >
                <Icon className={`w-5 h-5 ${item.accent} mb-1.5`} />
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
