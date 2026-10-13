import React from 'react';
import { X, Activity, RefreshCw, Radio } from 'lucide-react';

export default function LiveKafkaStream({ isOpen, onClose, events = [], onRefresh, loading }) {
  if (!isOpen) return null;

  const getBadgeStyle = (eventType) => {
    switch (eventType) {
      case 'user.registered':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'user.logged_in':
        return 'bg-accent text-accent-foreground border-primary/20';
      case 'vehicle.created':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'vehicle.approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'renter.kyc_submitted':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'booking.created':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'payment.completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'deposit.refunded':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-secondary/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card border-l border-border h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary text-white flex items-center justify-center shadow-xs">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-foreground font-display">Apache Kafka Event Bus</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[11px] text-muted-foreground">Topic: vahaan.events • Real-time Consumer Stream</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title="Poll Kafka Events"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stream List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {events.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No Kafka events recorded yet.</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Perform an action (register, login, list vehicle, submit KYC, or book) to see real Kafka event streaming.
              </p>
            </div>
          ) : (
            events.map((evt) => {
              let parsedData = {};
              try {
                parsedData = JSON.parse(evt.payload);
              } catch (e) {
                parsedData = { raw: evt.payload };
              }

              return (
                <div
                  key={evt.id}
                  className="bg-card border border-border rounded-xl p-3.5 space-y-2 hover:border-primary/40 shadow-xs transition"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px] border ${getBadgeStyle(
                        evt.eventType
                      )}`}
                    >
                      {evt.eventType}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="bg-muted/40 rounded-lg p-2.5 text-[11px] text-foreground font-mono overflow-x-auto max-h-36 border border-border/50">
                    <pre className="text-[10.5px] leading-tight whitespace-pre-wrap text-foreground">
                      {JSON.stringify(parsedData, null, 2)}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>ID: {evt.id}</span>
                    <span className="text-emerald-600 font-bold">{evt.status}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-border bg-muted/20 text-[11px] text-muted-foreground flex items-center justify-between font-medium">
          <span>Cluster: Apache Kafka (KRaft mode)</span>
          <span className="text-primary font-bold">Port 9092 / 9094</span>
        </div>
      </div>
    </div>
  );
}
