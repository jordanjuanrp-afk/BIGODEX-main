/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Award, Scissors } from 'lucide-react';
import { BARBERS } from '../data/barberData';
import { Barber } from '../types';
import { motion } from 'motion/react';

interface BarbersProps {
  onSelectBarber: (barber: Barber) => void;
}

export default function Barbers({ onSelectBarber }: BarbersProps) {
  return (
    <section id="team-section" className="py-16 bg-dark-bg text-slate-100 relative border-b border-white/5">
      {/* Absolute design accents */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-gold-500" />
            Nossa Equipe de Elite
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-widest text-gold-500 uppercase font-bold">
            Escolha seu Barbeiro de Confiança
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm">
            Profissionais experientes, atenciosos e em constante treinamento para trazer o melhor degradê, barba desenhada e visagismo masculino.
          </p>
        </motion.div>

        {/* Barbers Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {BARBERS.map((barber) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              whileHover={{ y: -6, borderColor: 'rgba(197, 160, 89, 0.3)' }}
              key={barber.id}
              className={`bg-card-bg border border-white/5 rounded p-5 flex flex-col justify-between transition-all relative ${
                barber.id === 'b1' ? 'shadow-md shadow-gold-500/5 ring-1 ring-gold-500/20' : ''
              }`}
            >
              {/* Top rating badge and highlight status */}
              {barber.id === 'b1' && (
                <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded text-[9px] font-bold bg-gold-500 text-slate-950 shadow flex items-center gap-1 uppercase tracking-widest">
                  <Star className="w-3 h-3 fill-current" />
                  Mais Recomendado
                </span>
              )}

              <div className="space-y-4">
                {/* Avatar and rating */}
                <div className="relative w-24 h-24 mx-auto">
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="w-full h-full object-cover rounded-full border-2 border-gold-500/20 group-hover:border-gold-500/50 transition-colors"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-2 inset-x-0 mx-auto w-14 bg-dark-bg px-1.5 py-0.5 rounded border border-white/5 text-center flex items-center justify-center gap-1 shadow">
                    <Star className="w-3.5 h-3.5 fill-current text-gold-500" />
                    <span className="text-xs font-bold text-white">{barber.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Info and Bio */}
                <div className="text-center pt-1 space-y-1">
                  <h3 className="text-lg font-serif font-bold text-white tracking-wider">
                    {barber.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[4.5rem] px-2">
                    {barber.bio}
                  </p>
                </div>

                {/* Specialties */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block">
                    Especialidades
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {barber.specialties.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-dark-bg text-slate-300 border border-white/5"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4">
                <button
                  onClick={() => onSelectBarber(barber)}
                  className={`w-full py-2 rounded text-xs font-serif font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                    barber.id === 'b1'
                      ? 'bg-gold-500 text-slate-950 border-gold-500 hover:bg-gold-600 font-extrabold'
                      : 'bg-dark-bg text-slate-400 hover:text-white border-white/5 hover:bg-white/5'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5 text-gold-500" />
                  Agendar com {barber.name.split(' ')[0]}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
