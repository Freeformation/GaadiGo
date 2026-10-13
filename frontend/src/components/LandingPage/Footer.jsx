import React from 'react';
import { ShieldCheck, PhoneCall, Heart } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-secondary text-secondary-foreground text-xs border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 text-white font-extrabold text-xl mb-3 font-display">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm shadow-glow">
                GG
              </div>
              <span>Gaadi<span className="text-primary">Go</span></span>
            </div>
            <p className="text-secondary-foreground/75 leading-relaxed mb-4">
              India's premier peer-to-peer and self-drive vehicle sharing platform. Built in compliance with Central Motor Vehicles Rules and MoRTH standards.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-primary-glow font-medium">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>DigiLocker & Parivahan Verified</span>
            </div>
          </div>

          {/* Hubs */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              Available Hubs in India
            </h4>
            <ul className="space-y-2 text-secondary-foreground/70">
              <li>Bengaluru (Indiranagar, Koramangala, Whitefield)</li>
              <li>Goa (Calangute, Anjuna, Panaji, Airport)</li>
              <li>Delhi NCR (Cyber Hub Gurugram, CP, Noida)</li>
              <li>Mumbai (Bandra, Andheri, BKC, Airport)</li>
              <li>Hyderabad (HITEC City, Gachibowli, Madhapur)</li>
              <li>Pune, Rishikesh, Jaipur & Manali</li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-secondary-foreground/70">
              <li>
                <button onClick={() => setActiveTab('landing')} className="hover:text-primary transition cursor-pointer">
                  Explore & Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('renter')} className="hover:text-primary transition cursor-pointer">
                  Rent Scooty, Bike & Cars
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('owner')} className="hover:text-primary transition cursor-pointer">
                  Host Earnings Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-primary transition cursor-pointer">
                  Admin Regulatory Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency support */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              24x7 Roadside Emergency
            </h4>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl mb-3">
              <p className="text-xs text-white font-bold flex items-center">
                <PhoneCall className="w-3.5 h-3.5 text-primary mr-1.5" />
                1800-GAADI-GO (Toll-Free)
              </p>
              <p className="text-[10px] text-secondary-foreground/60 mt-1">
                24x7 RSA assistance across all Indian highways
              </p>
            </div>
            <p className="text-[11px] text-secondary-foreground/60">
              Regulatory compliance: Ministry of Road Transport and Highways (MoRTH), New Delhi.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-[11px] text-secondary-foreground/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 GaadiGo Technologies Private Limited. Made for India with pride.</p>
          <div className="flex space-x-4">
            <span className="hover:text-white transition cursor-pointer">Motor Vehicles Act Compliance</span>
            <span className="hover:text-white transition cursor-pointer">Privacy & UIDAI Data Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
