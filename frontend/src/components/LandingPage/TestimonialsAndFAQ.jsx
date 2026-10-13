import React, { useState } from 'react';
import { Star, ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const FAQS = [
  {
    q: 'Can I legally rent out my private scooty or car in India?',
    a: 'Under the Motor Vehicles Act 1988, renting vehicles directly requires either a commercial permit ("Rent a Cab" / "Rent a Motorcycle" scheme with yellow or black-yellow plates) OR a compliant peer-to-peer bailee lease agreement under the Indian Contract Act 1872. GaadiGo supports both: certified commercial fleets operate under official transport permits, while private vehicle hosts sign a mutual indemnity bailment deed with renters for community sharing.',
  },
  {
    q: 'How are traffic challans (e-challans) and FASTag tolls handled?',
    a: 'All 4-wheelers must have an active FASTag ID. Toll amounts incurred during the rental trip are automatically calculated and deducted from the refundable security deposit or billed to the renter. For traffic fines issued by traffic police or automated speed cameras during the trip, the renter is 100% legally liable, supported by the timestamped digital handover agreement.',
  },
  {
    q: 'How and when is the security deposit refunded to the renter?',
    a: 'Security deposits (ranging from ₹500 for scooties to ₹5,000 for SUVs) are held in an escrow account. Once the vehicle is returned and the host completes the digital handover checklist without damage or unpaid challans, the deposit is auto-refunded to the renter’s original UPI handle within 2 hours.',
  },
  {
    q: 'What insurance covers the vehicle during a trip?',
    a: 'Every listing on GaadiGo must have an active comprehensive insurance policy. Additionally, our platform attaches an on-trip third-party liability cover and 24x7 Roadside Assistance (RSA) across all major national highways and city limits in India.',
  },
  {
    q: 'What driving license (DL) is required for scooties and cars?',
    a: 'For gearless scooters (e.g. Honda Activa, TVS Jupiter), renters must hold at least an MCWOG (Motorcycle Without Gear) or MCWG endorsement. For geared motorcycles, MCWG is required. For 4-wheelers, an active LMV (Light Motor Vehicle) non-transport license is mandatory. Learners licenses (LL) are not accepted.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Rohit Kulkarni',
    role: 'Honda Activa 6G Host, Indiranagar, Bengaluru',
    quote:
      'My Activa used to sit idle in my apartment parking on weekdays since I work from home. Now I earn around ₹14,000 extra every month on GaadiGo. Payouts arrive every Monday without delay!',
    rating: 5,
  },
  {
    name: 'Aakash & Sneha Verma',
    role: 'Rented Thar 4x4 in North Goa',
    quote:
      'The DigiLocker KYC took less than 40 seconds. We picked up a clean Mahindra Thar directly near Calangute beach. No cash hassles, zero haggling, and deposit was back in my GPay account the day we checked out.',
    rating: 5,
  },
  {
    name: 'Carlos Fernandes',
    role: 'Fleet Host (RE Hunter & Thar), Goa',
    quote:
      'As a commercial rental operator in Goa, managing bookings and deposit disputes was a headache. GaadiGo streamlined all FASTag toll pass-throughs and KYC verifications seamlessly.',
    rating: 5,
  },
];

export default function TestimonialsAndFAQ() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Community Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-display">
              Loved by Hosts & Renters Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-card border border-border hover:border-primary/30 rounded-2xl p-6 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all"
              >
                <div>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs font-bold text-foreground font-display">{t.name}</p>
                  <p className="text-[11px] text-primary font-bold mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Legal & Operational FAQs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-display">
              Indian Transport Regulations & Policies
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-xs transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-foreground hover:text-primary transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
