/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Phone, Instagram, Clock, ExternalLink, Navigation } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barberData';
import { motion } from 'motion/react';

export default function ContactMap() {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_INFO.address)}`;
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section id="contact-section" className="py-16 bg-dark-bg text-slate-100 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Address, Hours & Contact Details (Col-span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20 uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5 text-gold-500" />
                Como nos encontrar
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif tracking-widest text-gold-500 uppercase font-bold">
                Localização & Horários
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Estamos no coração do bairro Eucaliptos em Fazenda Rio Grande. Fácil estacionamento na frente e uma recepção aconchegante com café, água gelada e games enquanto você espera.
              </p>
            </div>

            {/* Structured details */}
            <div className="space-y-4 bg-card-bg border border-white/5 p-5 rounded">
              
              {/* Address */}
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-xs sm:text-sm font-serif tracking-wider font-bold">Endereço</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-0.5">
                    {BUSINESS_INFO.address}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex gap-3 items-start pt-3 border-t border-white/5">
                <Clock className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-white text-xs sm:text-sm font-serif tracking-wider font-bold">Horário de Atendimento</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-1.5 text-xs">
                    {BUSINESS_INFO.hours.map((item, idx) => (
                      <div key={idx} className="flex justify-between sm:justify-start gap-2 text-slate-400">
                        <span className="font-semibold text-slate-300">{item.days}:</span>
                        <span>{item.open}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="flex gap-3 items-start pt-3 border-t border-white/5">
                <Phone className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-xs sm:text-sm font-serif tracking-wider font-bold">Telefone / WhatsApp</h4>
                  <a
                    href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                    className="text-gold-400 text-xs font-mono font-semibold hover:underline block mt-0.5"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* External Links buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-serif font-bold uppercase tracking-widest bg-gold-500 text-slate-950 hover:bg-gold-600 transition-colors shadow cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Ver no Google Maps
              </a>

              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded text-xs font-serif font-bold uppercase tracking-widest bg-card-bg text-slate-300 hover:text-white border border-white/5 hover:bg-white/5 transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4 text-gold-500" />
                @barbeariabigodex
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Embed (Col-span 7) */}
          <div className="lg:col-span-7 bg-card-bg border border-white/5 rounded p-5 flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Indicator */}
            <div className="flex justify-between items-center mb-4 z-10">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-serif">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse" />
                Mapa Interativo da Região
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Fazenda Rio Grande - PR
              </span>
            </div>

            {/* Google Maps Iframe with Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative rounded overflow-hidden h-64 sm:h-80 group"
            >
              {/* Animated glow border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500/20 via-gold-500/5 to-gold-500/20 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

              {/* Loading skeleton */}
              {!mapLoaded && (
                <div className="absolute inset-0 bg-card-bg rounded flex items-center justify-center z-20">
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 border-2 border-gold-500/20 border-t-gold-500 rounded-full"
                    />
                    <span className="text-xs text-slate-400 font-serif tracking-wider">Carregando mapa...</span>
                  </div>
                </div>
              )}

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3590.1!2d-49.3097149!3d-25.6444868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dcff958af44f67%3A0xfe14371b8e3b6558!2sBarbearia%20Bigodex%20-%20Unidade%20Eucaliptos!5e0!3m2!1spt-BR!2sbr!4v1721234567890!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(1.05)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Barbearia Bigodex"
                className="absolute inset-0 rounded z-10"
                onLoad={() => setMapLoaded(true)}
              />

              {/* Animated floating pin overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={mapLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center"
              >
                <div className="relative">
                  {/* Pulse rings */}
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 w-10 h-10 -ml-0 -mt-0 rounded-full border-2 border-gold-500/40"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                    className="absolute inset-0 w-10 h-10 -ml-0 -mt-0 rounded-full border-2 border-gold-500/30"
                  />

                  {/* Pin icon */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/30"
                  >
                    <MapPin className="w-5 h-5 text-slate-950 fill-slate-950" />
                  </motion.div>
                </div>

                {/* Label below pin */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={mapLoaded ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                  className="mt-1 bg-dark-bg/90 backdrop-blur-sm border border-gold-500/30 px-2 py-0.5 rounded text-[9px] font-serif font-bold text-gold-400 whitespace-nowrap"
                >
                  BIGODEX
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Bottom info text */}
            <div className="text-xs text-slate-400 leading-relaxed mt-4">
              <span className="font-bold text-white block mb-0.5 font-serif tracking-wider">Dica de Acesso:</span>
              Estamos localizados logo à frente da Praça de Eucaliptos, com vaga disponível diretamente na porta. Se vier do centro, a Avenida Araucárias tem pista dupla facilitando o acesso.
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
