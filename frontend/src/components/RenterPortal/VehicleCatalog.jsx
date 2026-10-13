import React, { useState } from 'react';
import { Search, Star, MapPin, Fuel, Shield, ArrowRight, Zap } from 'lucide-react';
import { CITIES } from '../Navbar';

export default function VehicleCatalog({
  vehicles = [],
  selectedCity,
  setSelectedCity,
  onSelectVehicle,
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedFuel, setSelectedFuel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(6000);

  // Filter approved or live listings
  const filteredVehicles = vehicles.filter((v) => {
    if (v.status !== 'APPROVED') return false;

    if (selectedCity !== 'All Cities' && v.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'CAR') {
        if (!['HATCHBACK', 'SEDAN', 'SUV'].includes(v.category)) return false;
      } else if (v.category !== selectedCategory) {
        return false;
      }
    }

    if (selectedFuel !== 'ALL' && v.fuelType !== selectedFuel) {
      return false;
    }

    if (v.dailyRate > maxPrice) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        v.title.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.modelName.toLowerCase().includes(q) ||
        v.areaHub.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-display">
          Rent a Scooty, Bike or Car in India
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Showing verified vehicles with DigiLocker KYC, comprehensive insurance, and FASTag.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-8 shadow-card space-y-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Fleet' },
            { id: 'SCOOTY', label: '🛵 Scooty / Activa' },
            { id: 'BIKE', label: '🏍️ Motorcycle' },
            { id: 'HATCHBACK', label: '🚗 Hatchback' },
            { id: 'SUV', label: '🚙 SUV / 4x4' },
            { id: 'EV', label: '⚡ Electric (EV)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 border border-border text-foreground/80 hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, City & Fuel dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Activa, Hunter, Swift, Thar..."
              className="w-full bg-muted/40 border border-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-muted/40 border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="w-full bg-muted/40 border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
            >
              <option value="ALL">All Fuel Types</option>
              <option value="PETROL">Petrol</option>
              <option value="ELECTRIC">Electric (EV)</option>
              <option value="DIESEL">Diesel</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 bg-muted/40 border border-input rounded-xl px-3 py-1.5">
            <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
              Max ₹{maxPrice}/d
            </span>
            <input
              type="range"
              min="400"
              max="6000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl shadow-xs">
          <p className="text-base font-bold text-foreground font-display">No vehicles found matching criteria</p>
          <p className="text-xs text-muted-foreground mt-1">Try changing your city or vehicle category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              className="bg-card border border-border hover:border-primary/40 rounded-2xl overflow-hidden transition-all shadow-card hover:shadow-card-hover flex flex-col group"
            >
              {/* Image & Plate Tag */}
              <div className="relative h-52 bg-muted overflow-hidden">
                <img
                  src={v.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-amber-300 text-slate-950 font-mono shadow-xs border border-amber-400">
                    {v.registrationNumber}
                  </span>
                  {v.fuelType === 'ELECTRIC' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white flex items-center shadow-xs">
                      <Zap className="w-2.5 h-2.5 mr-0.5" /> EV
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border flex items-center space-x-1 text-xs shadow-xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-foreground">{v.rating || 4.9}</span>
                  <span className="text-muted-foreground text-[10px]">({v.tripCount || 0})</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-bold text-primary uppercase tracking-wider text-[11px]">
                      {v.category} • {v.year}
                    </span>
                    <span className="flex items-center text-muted-foreground">
                      <MapPin className="w-3 h-3 text-muted-foreground mr-1" />
                      {v.city}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition font-display">
                    {v.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">Hub: {v.areaHub}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground">
                    <div className="flex items-center space-x-1.5">
                      <Fuel className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{v.fuelType} • {v.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{v.helmetsProvided > 0 ? `${v.helmetsProvided} Helmets` : 'FASTag Enabled'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing */}
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-black text-foreground font-display">₹{v.dailyRate}</span>
                      <span className="text-xs text-muted-foreground font-medium">/ day</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      + ₹{v.securityDeposit} refundable deposit
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectVehicle(v)}
                    className="px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs shadow-glow hover:opacity-95 transition cursor-pointer flex items-center space-x-1"
                  >
                    <span>View & Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
