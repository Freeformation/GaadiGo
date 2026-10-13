import React from 'react';
import { Star, MapPin, Fuel, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function VehicleCategories({ vehicles = [], onSelectVehicle, onExploreCategory }) {
  // Show top featured vehicles from live MongoDB data
  const featured = vehicles.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>Verified Indian Fleet</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-display">
              Popular Rides Ready for Delivery
            </h2>
            <p className="mt-2 text-muted-foreground text-sm font-medium">
              Every scooter, motorcycle and car is verified with authentic Parivahan RC, commercial insurance, and PUC.
            </p>
          </div>
          <button
            onClick={() => onExploreCategory('ALL')}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-primary hover:text-primary-glow font-bold text-sm cursor-pointer transition"
          >
            <span>View All Fleet Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((v) => (
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

                {/* Registration Plate Tag */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase border shadow-xs ${
                      v.plateType === 'YELLOW_COMMERCIAL'
                        ? 'bg-amber-300 text-slate-900 border-amber-400 font-mono'
                        : v.plateType === 'BLACK_YELLOW_RENTAL'
                        ? 'bg-slate-950 text-amber-300 border-amber-400/60 font-mono'
                        : 'bg-card text-foreground border-border font-mono'
                    }`}
                  >
                    {v.registrationNumber}
                  </span>

                  {v.fuelType === 'ELECTRIC' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white flex items-center shadow-xs">
                      <Zap className="w-2.5 h-2.5 mr-0.5" /> EV
                    </span>
                  )}
                </div>

                {/* Rating badge */}
                <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border flex items-center space-x-1 text-xs shadow-xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-foreground">{v.rating || 4.9}</span>
                  <span className="text-muted-foreground text-[10px]">({v.tripCount || 14})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-bold text-primary uppercase tracking-wider text-[11px]">
                      {v.category} • {v.year}
                    </span>
                    <span className="flex items-center text-muted-foreground font-medium">
                      <MapPin className="w-3 h-3 text-muted-foreground mr-1" />
                      {v.city}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition font-display">
                    {v.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    Hub: {v.areaHub}
                  </p>

                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground">
                    <div className="flex items-center space-x-1.5">
                      <Fuel className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{v.fuelType} • {v.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Insured & PUC Valid</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
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
                    className="px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-xs transition cursor-pointer flex items-center space-x-1 shadow-glow hover:opacity-95"
                  >
                    <span>Book Ride</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
