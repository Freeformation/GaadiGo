import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Star, ChevronDown, HelpCircle, Sparkles, MessageSquareQuote } from 'lucide-react';
import { GET_FAQS, GET_REVIEWS } from '../../graphql/operations';

export default function TestimonialsAndFAQ() {
  const [openFaq, setOpenFaq] = useState(0);

  const { data: faqsData, loading: faqsLoading } = useQuery(GET_FAQS, {
    pollInterval: 15000,
  });
  const { data: reviewsData, loading: reviewsLoading } = useQuery(GET_REVIEWS, {
    pollInterval: 15000,
  });

  const faqs = faqsData?.getFaqs || [];
  const reviews = reviewsData?.getReviews || [];

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Real Customer Stories from MongoDB</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-display">
              Loved by Hosts & Renters Across India
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Live feedback from verified vehicle owners and travelers
            </p>
          </div>

          {reviewsLoading && reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs animate-pulse">
              Loading verified reviews...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((t) => (
                <div
                  key={t.id}
                  className="bg-card border border-border hover:border-primary/30 rounded-2xl p-6 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all"
                >
                  <div>
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(t.rating || 5)].map((_, idx) => (
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
                    {t.city && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">📍 {t.city}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Indian Transport Regulations & Policies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-display">
              Frequently Asked Legal & Operational Questions
            </h2>
          </div>

          {faqsLoading && faqs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs animate-pulse">
              Loading regulatory FAQs...
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.id || idx}
                    className="bg-card border border-border rounded-xl overflow-hidden shadow-xs transition"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-foreground hover:text-primary transition cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
