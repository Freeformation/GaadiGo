import React from 'react';
import { ArrowRight, Sparkles, Calculator, CheckCircle2 } from 'lucide-react';

export default function HowItWorksSection({ onOpenAddListing, onExploreRenter, onOpenCalculator }) {
  const steps = [
    {
      num: '01',
      title: 'Sign up & KYC',
      desc: 'Create your account in under 60 seconds. Instant DigiLocker Aadhaar & Parivahan Driving License verification. 100% paperless.',
    },
    {
      num: '02',
      title: 'Pick dates & vehicle',
      desc: 'Browse hundreds of Activas, cruisers, hatchbacks, and SUVs across India. Filter by city, daily rate, and instant booking.',
    },
    {
      num: '03',
      title: 'Pay securely',
      desc: 'Pay via UPI, Cards, or NetBanking with itemized 5% GST. Refundable security deposit is safely held in escrow.',
    },
    {
      num: '04',
      title: 'Pick up & ride',
      desc: 'Verify the 4-digit pickup OTP, grab your 2 BIS-certified helmets, and enjoy your trip. Tolls deducted via FASTag automatically.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Effortless Rental Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-display">
            Rent in 4 simple steps
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base font-medium">
            From booking to getting behind the handlebars or wheel, we make self-drive rentals safe and seamless.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-card border border-border rounded-2xl p-6 relative hover:shadow-card-hover transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-4xl font-extrabold text-primary/20 group-hover:text-primary/40 transition-colors font-display block mb-3">
                  {s.num}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2 font-display">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Host Callout Banner (Lovable Secondary Dark Card) */}
        <div className="mt-14 bg-secondary text-secondary-foreground rounded-3xl p-8 sm:p-10 shadow-xl border border-secondary/80 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-glow text-xs font-bold tracking-wide uppercase inline-block mb-3">
                Vehicle Owner Partner Program
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
                Own a scooty or car? <br />
                Make it earn while parked.
              </h3>
              <p className="mt-2 text-sm text-secondary-foreground/80 leading-relaxed">
                Turn your idle two-wheeler or four-wheeler into ₹15,000 to ₹50,000/month.
                Comprehensive insurance rider, verified renters, and weekly UPI deposits.
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-xs text-secondary-foreground/90 font-medium">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Zero upfront listing fee</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Full damage protection</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Parivahan RC check</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={onOpenAddListing}
                className="px-6 py-3.5 bg-gradient-primary text-primary-foreground font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-glow hover:opacity-95 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>List Your Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
