/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Services from './components/Services';
import Barbers from './components/Barbers';
import PeakHours from './components/PeakHours';
import Reviews from './components/Reviews';
import ContactMap from './components/ContactMap';
import BookingForm from './components/BookingForm';
import RainEffect from './components/RainEffect';
import LoadingScreen from './components/LoadingScreen';
import { Service, Barber } from './types';
import { BUSINESS_INFO } from './data/barberData';
import { Phone, ChevronUp, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<Service | null>(null);
  const [preselectedBarber, setPreselectedBarber] = useState<Barber | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll position for sticky header and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openBookingWithService = (service: Service) => {
    setPreselectedService(service);
    setPreselectedBarber(null);
    setIsBookingOpen(true);
  };

  const openBookingWithBarber = (barber: Barber) => {
    setPreselectedBarber(barber);
    setPreselectedService(null);
    setIsBookingOpen(true);
  };

  const openGeneralBooking = () => {
    setPreselectedService(null);
    setPreselectedBarber(null);
    setIsBookingOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col font-sans selection:bg-gold-500 selection:text-slate-950">
      <LoadingScreen />
      <RainEffect />
      
      {/* 1. TOP STICKY HEADER / NAVIGATION BAR */}
      <nav
        id="top-nav-bar"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-dark-bg/95 backdrop-blur-md border-b border-white/5 py-3 shadow-lg'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer -ml-2" onClick={scrollToTop}>
            <img
              src="/assets/logo.svg"
              alt="Barbearia Bigodex"
              className="h-12 w-auto"
            />
          </div>
        </div>
      </nav>

      {/* Spacing correction if sticky bar has background */}
      <div className="h-16 shrink-0" />

      {/* 2. MAIN HERO SECTION */}
      <Header />

      {/* 3. MAIN MODULES */}
      <main className="flex-grow">
        
        {/* Services catalog */}
        <Services onSelectService={openBookingWithService} />

        {/* Barbers team profiles */}
        <Barbers onSelectBarber={openBookingWithBarber} />

        {/* Peak busy hours chart */}
        <PeakHours />

        {/* Location coordinates and vector map */}
        <ContactMap />

        {/* Reviews board & feedback submission */}
        <Reviews />

      </main>

      {/* 5. FOOTER */}
      <footer className="bg-dark-bg border-t border-white/5 text-slate-400 py-10 text-xs text-center sm:text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-card-bg border border-white/5 text-gold-500 font-extrabold flex items-center justify-center text-lg shadow">
                💈
              </div>
              <div className="text-left">
                <span className="text-white font-serif tracking-wider font-extrabold text-sm block">BARBEARIA BIGODEX</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">Unidade Eucaliptos, Fazenda Rio Grande</span>
              </div>
            </div>

            {/* Inclusivity references & support info */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-gold-500/80" /> Empresa Inclusiva
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-500/80" /> Foco na Comunidade
              </span>
            </div>

            {/* Telephone call shortcut */}
            <a
              href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-card-bg hover:bg-white/5 text-slate-300 hover:text-white border border-white/5 font-semibold font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-gold-500" />
              Ligar para {BUSINESS_INFO.phone}
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-slate-600">
            <p>
              &copy; {new Date().getFullYear()} Barbearia Bigodex. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1">
              Desenvolvido de forma independente com carinho para o bairro Eucaliptos.
            </p>
          </div>
        </div>
      </footer>

      {/* 6. BOOKING SCHEDULER MODAL */}
      <AnimatePresence>
        {isBookingOpen && (
          <BookingForm
            initialService={preselectedService}
            initialBarber={preselectedBarber}
            onClose={() => {
              setIsBookingOpen(false);
              setPreselectedService(null);
              setPreselectedBarber(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* 7. SCROLL TO TOP FLOATING BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 rounded bg-gold-500 text-slate-950 shadow-xl shadow-gold-500/15 cursor-pointer z-30 border border-gold-400 hover:bg-gold-400 transition-all"
            title="Voltar ao Topo"
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Floating Assistance Widget */}
      <a
        href={BUSINESS_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/20 cursor-pointer z-30 flex items-center justify-center border border-emerald-400 transition-all hover:scale-105"
        title="Dúvidas no WhatsApp"
      >
        <MessageSquare className="w-5.5 h-5.5 fill-current" />
      </a>

    </div>
  );
}
