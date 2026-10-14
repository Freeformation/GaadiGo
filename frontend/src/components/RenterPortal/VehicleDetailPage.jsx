import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  Fuel,
  Gauge,
  Calendar,
  Sparkles,
  Info,
  Car,
  Clock,
  ArrowRight,
  ShieldAlert,
  Users
} from 'lucide-react';

export default function VehicleDetailPage({
  vehicle,
  onBack,
  onProceedToKyc,
}) {
  const [totalDays, setTotalDays] = useState(2);
  const [pickupType, setPickupType] = useState('HUB_PICKUP');

  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-foreground">No vehicle selected</h2>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
        >
          Back to Fleet Catalog
        </button>
      </div>
    );
  }

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

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Gallery images with category-aware fallbacks for rich multi-image view
  const categoryFallbacks = {
    SCOOTY: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=1200&auto=format&fit=crop&q=80',
    ],
    BIKE: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=1200&auto=format&fit=crop&q=80',
    ],
    EV: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1200&auto=format&fit=crop&q=80',
    ],
    HATCHBACK: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
    ],
    SUV: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&auto=format&fit=crop&q=80',
    ],
  };

  const rawImages = (vehicle.images && vehicle.images.length > 0) ? vehicle.images : [];
  const fallbacks = categoryFallbacks[vehicle.category] || categoryFallbacks.BIKE;
  const galleryImages = rawImages.length >= 2 
    ? rawImages 
    : [...rawImages, ...fallbacks.slice(rawImages.length)];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Top Navigation Breadcrumb */}
      <div className="bg-card border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fleet Catalog</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-amber-300 text-slate-950 font-black border border-amber-400">
              {vehicle.registrationNumber}
            </span>
            <span className="text-xs text-muted-foreground font-semibold">
              {vehicle.category} • {vehicle.city} Hub
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Vehicle Details, Specs, Compliance (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Interactive Multiple Images Slider */}
            <div className="space-y-3">
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card relative group select-none">
                <div className="h-80 sm:h-96 w-full bg-muted relative overflow-hidden">
                  <img
                    src={galleryImages[activeImageIndex]}
                    alt={`${vehicle.title} photo ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 ease-in-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-card/85 backdrop-blur-md border border-border text-foreground shadow-xs">
                      {vehicle.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {activeImageIndex + 1} / {galleryImages.length} Photos
                    </span>
                  </div>

                  {/* Previous Button */}
                  {galleryImages.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 hover:bg-card text-foreground backdrop-blur-md border border-border shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 cursor-pointer z-10"
                      title="Previous Image"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}

                  {/* Next Button */}
                  {galleryImages.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 hover:bg-card text-foreground backdrop-blur-md border border-border shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 cursor-pointer z-10"
                      title="Next Image"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black font-display drop-shadow-sm">
                        {vehicle.title}
                      </h1>
                      <p className="text-xs text-white/80 flex items-center mt-0.5">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {vehicle.areaHub}, {vehicle.city}
                      </p>
                    </div>
                    <div className="bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border text-foreground shadow-xs text-right">
                      <p className="text-[10px] text-muted-foreground font-medium">Verified Host</p>
                      <p className="text-xs font-bold">{vehicle.hostName}</p>
                    </div>
                  </div>
                </div>

                {/* Dot Indicators */}
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-10">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === activeImageIndex
                            ? 'w-6 bg-white shadow-xs'
                            : 'w-1.5 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails Strip */}
              {galleryImages.length > 1 && (
                <div className="flex items-center space-x-2.5 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        idx === activeImageIndex
                          ? 'border-primary ring-2 ring-primary/20 scale-102 shadow-xs'
                          : 'border-border opacity-70 hover:opacity-100 hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-card border border-border rounded-2xl p-4 text-center shadow-xs">
                <Fuel className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Fuel / Engine</p>
                <p className="text-xs font-bold text-foreground mt-0.5">{vehicle.fuelType || 'Petrol'}</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4 text-center shadow-xs">
                <Gauge className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Transmission</p>
                <p className="text-xs font-bold text-foreground mt-0.5">{vehicle.transmission || 'Automatic'}</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4 text-center shadow-xs">
                <Users className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Seating</p>
                <p className="text-xs font-bold text-foreground mt-0.5">{vehicle.seatingCapacity || 2} Persons</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4 text-center shadow-xs">
                <MapPin className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Hub Location</p>
                <p className="text-xs font-bold text-foreground mt-0.5 truncate">{vehicle.areaHub || vehicle.city}</p>
              </div>
            </div>

            {/* Statutory Compliance & MoRTH Verification Panel */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-foreground font-display">
                  Statutory MoRTH & Parivahan Compliance
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This vehicle has passed automated Parivahan RC checks and MoRTH regulatory mandates for self-drive operations in India.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-muted/40 p-3.5 rounded-xl border border-border flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Parivahan Registration (RC)</p>
                    <p className="text-[11px] text-muted-foreground">{vehicle.plateType} • Verified</p>
                  </div>
                </div>

                <div className="bg-muted/40 p-3.5 rounded-xl border border-border flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Commercial Insurance</p>
                    <p className="text-[11px] text-muted-foreground">{vehicle.insuranceCompany} (till {vehicle.insuranceExpiry})</p>
                  </div>
                </div>

                <div className="bg-muted/40 p-3.5 rounded-xl border border-border flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Pollution (PUC) Validity</p>
                    <p className="text-[11px] text-muted-foreground">{vehicle.pucExpiry || 'CMVR Compliant'}</p>
                  </div>
                </div>

                <div className="bg-muted/40 p-3.5 rounded-xl border border-border flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-foreground">Safety Gear & FASTag</p>
                    <p className="text-[11px] text-muted-foreground">
                      {vehicle.helmetsProvided > 0 ? `${vehicle.helmetsProvided} BIS Helmets` : vehicle.fastagId || 'FASTag Fitted'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Policy & Kilometers Limit */}
            <div className="bg-muted/30 border border-border rounded-2xl p-5 space-y-2 text-xs">
              <h4 className="font-bold text-foreground flex items-center">
                <Info className="w-4 h-4 text-primary mr-1.5" />
                <span>Trip Rules & Kilometers Allowance</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-1">
                <p>• Daily KM Allowance: <strong className="text-foreground">{vehicle.kmLimitPerDay || 200} km/day</strong></p>
                <p>• Extra KM Charge: <strong className="text-foreground">₹{vehicle.extraKmCharge || 5}/km</strong></p>
                <p>• Fuel Policy: <strong className="text-foreground">{vehicle.fuelPolicy || 'SAME_TO_SAME'}</strong></p>
                <p>• Speed Limit: <strong className="text-foreground">80 km/h (Commercial limit)</strong></p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget & Price Invoicing (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Daily Rental Rate</p>
                  <p className="text-2xl font-black text-foreground font-display">
                    ₹{vehicle.dailyRate} <span className="text-xs font-normal text-muted-foreground">/ day</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    Instant Booking
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Free Cancellation up to 6h</p>
                </div>
              </div>

              {/* Rental Duration Input */}
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
                    className="w-24 bg-card border border-input rounded-xl px-3 py-2.5 text-sm text-foreground font-black text-center focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                  <span className="text-xs text-muted-foreground font-semibold">
                    Total: {totalDays} {totalDays === 1 ? 'Day' : 'Days'} ({totalDays * (vehicle.kmLimitPerDay || 200)} km included)
                  </span>
                </div>
              </div>

              {/* Pickup Method */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Pickup & Handover Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPickupType('HUB_PICKUP')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      pickupType === 'HUB_PICKUP'
                        ? 'bg-accent border-primary text-accent-foreground shadow-xs'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Hub Pickup (Free)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupType('DOORSTEP_DELIVERY')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      pickupType === 'DOORSTEP_DELIVERY'
                        ? 'bg-accent border-primary text-accent-foreground shadow-xs'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Doorstep (+₹{vehicle.doorstepDeliveryFee || 150})
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-muted/30 p-5 rounded-2xl border border-border space-y-2.5 text-xs">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-3 flex items-center">
                  <IndianRupee className="w-3.5 h-3.5 text-primary mr-1" />
                  <span>Itemized Price Invoicing</span>
                </h4>

                <div className="flex justify-between text-muted-foreground">
                  <span>Rental Charges ({totalDays} days × ₹{vehicle.dailyRate})</span>
                  <span className="font-semibold text-foreground">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Doorstep Handover Delivery</span>
                    <span className="font-semibold text-foreground">₹{deliveryFee}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>Platform & 24x7 RSA Fee</span>
                  <span className="font-semibold text-foreground">₹{convenienceFee}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>GST (Goods & Services Tax @ 5%)</span>
                  <span className="font-semibold text-foreground">₹{gstAmount}</span>
                </div>

                <div className="flex justify-between text-primary font-bold pt-2.5 border-t border-border">
                  <span>Refundable Deposit (Held in Escrow)</span>
                  <span>₹{securityDeposit.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  * 100% refunded to your UPI account post-trip.
                </p>

                <div className="flex justify-between items-center text-sm font-black text-foreground pt-3 border-t border-border font-display">
                  <span>Total Payable</span>
                  <span className="text-xl text-foreground font-black">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBook}
                className="w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-glow hover:opacity-95 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Proceed to DigiLocker KYC</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero paperwork • Instant DigiLocker Aadhaar & DL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
