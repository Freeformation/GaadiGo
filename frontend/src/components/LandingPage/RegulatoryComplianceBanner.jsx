import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RegulatoryComplianceBanner() {
  const complianceSteps = [
    {
      step: '01',
      title: 'MoRTH & RTO Vehicle Compliance',
      subtitle: 'Motor Vehicles Act, 1988',
      desc: 'Platform verifies Registration Certificate (RC) with Parivahan portal. We support Commercial Yellow Plates, Black-Yellow Rental Plates, and compliant P2P Community Lease agreements with mutual bailment deeds under Indian Contract Act 1872.',
      tag: 'Statutory RC Check',
    },
    {
      step: '02',
      title: 'DigiLocker & DL Class Verification',
      subtitle: 'UIDAI & Parivahan Integration',
      desc: 'Renters undergo instant DigiLocker e-KYC with masked Aadhaar and Driving License category verification (MCWOG for scooty/gearless, MCWG for geared bikes, and LMV for cars). Zero unverified drivers on road.',
      tag: 'e-KYC & Parivahan',
    },
    {
      step: '03',
      title: 'Pollution (PUC) & FASTag Toll Pass',
      subtitle: 'Central Motor Vehicles Rules',
      desc: 'Mandatory active PUC certificate check for non-EVs. All 4-wheelers feature an active NPCI FASTag ID, enabling toll pass-throughs without cash delays, reconciled automatically upon return.',
      tag: 'CMVR Mandatory',
    },
    {
      step: '04',
      title: 'Speed Governor & Dual Helmet Mandate',
      subtitle: 'MoRTH Road Safety Standards',
      desc: 'Commercial rental cars comply with 80 km/h speed limits and GPS tracking. For two-wheelers, hosts must provide up to 2 ISI-certified helmets (BIS standard 4151) for the rider and pillion.',
      tag: 'ISI Helmets & 80km/h Limit',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Built Strictly Under Indian Transport Regulations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-display">
            How We Protect Hosts & Renters in India
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base font-medium">
            Every listing and reservation passes through automated statutory checks ensuring legal compliance with the Ministry of Road Transport and Highways (MoRTH).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceSteps.map((item) => (
            <div
              key={item.step}
              className="bg-card border border-border hover:border-primary/40 rounded-2xl p-6 transition-all shadow-card hover:shadow-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-primary/20 tracking-wider font-display">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent text-accent-foreground border border-primary/20">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-1 font-display">{item.title}</h3>
                <p className="text-xs text-primary font-bold mb-3">{item.subtitle}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center text-[11px] text-muted-foreground font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary mr-1.5 shrink-0" />
                <span>Verified by Admin & Parivahan API</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
