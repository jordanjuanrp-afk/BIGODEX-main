/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Clock, Info, TrendingUp } from 'lucide-react';
import { PEAK_HOURS } from '../data/barberData';
import { motion } from 'motion/react';

export default function PeakHours() {
  const [selectedDay, setSelectedDay] = useState<string>('Sexta-feira');

  const days = ['Sexta-feira', 'Sábado', 'Dias de Semana'];
  const peakData = PEAK_HOURS[selectedDay] || [];

  const getBarColor = (level: number) => {
    if (level >= 85) return 'bg-rose-500';
    if (level >= 60) return 'bg-gold-500';
    if (level >= 40) return 'bg-gold-400/70';
    return 'bg-gold-300/30';
  };

  const getDayInsight = (day: string) => {
    switch (day) {
      case 'Sexta-feira':
        return {
          peak: '16h - 18h',
          quiet: '09h - 11h',
          tip: 'Na sexta o movimento cresce após o almoço. Recomendamos agendar pela manhã ou início de tarde se quiser evitar filas.'
        };
      case 'Sábado':
        return {
          peak: '10h - 12h e 15h - 17h',
          quiet: '08h - 09h',
          tip: 'Sábado é o dia mais concorrido! O movimento é constante durante todo o dia. Agende com antecedência de pelo menos 2 dias.'
        };
      default:
        return {
          peak: '17h - 19h',
          quiet: '09h - 11h e 13h - 15h',
          tip: 'Dias de semana (segunda a quinta) são excelentes para um atendimento tranquilo. O horário comercial é super calmo.'
        };
    }
  };

  const insight = getDayInsight(selectedDay);

  return (
    <section id="peak-hours-section" className="py-16 bg-dark-bg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Column 1: Informational card & selector */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-gold-500" />
                Planeje Sua Visita
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif tracking-widest text-gold-500 uppercase font-bold">
                Horários de Pico e Movimento
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Acompanhe os períodos mais movimentados para programar seu corte com tranquilidade. Nossos clientes costumam preferir agendamentos fora do horário de pico.
              </p>
            </div>

            {/* Day Selector Buttons */}
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded text-xs font-serif uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                    selectedDay === day
                      ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-md shadow-gold-500/10'
                      : 'bg-card-bg text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Insight Card */}
            <div className="bg-card-bg border border-white/5 rounded p-5 space-y-4">
              <div className="flex items-center gap-2 text-white font-serif tracking-wide font-semibold text-sm">
                <Info className="w-4.5 h-4.5 text-gold-500" />
                <span>Resumo para {selectedDay}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-dark-bg p-3 rounded border border-white/5">
                  <span className="text-rose-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">Horário de Pico:</span>
                  <span className="text-white font-medium">{insight.peak}</span>
                </div>
                <div className="bg-dark-bg p-3 rounded border border-white/5">
                  <span className="text-gold-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">Mais Calmo:</span>
                  <span className="text-white font-medium">{insight.quiet}</span>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed italic">
                &ldquo;{insight.tip}&rdquo;
              </p>

              <div className="flex flex-wrap gap-3 pt-2 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-gold-300/30 border border-gold-500/20" /> Tranquilo
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-gold-500" /> Moderado
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Muito Lotado
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Visual Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 bg-card-bg border border-white/5 rounded p-6 relative overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gold-500/5 to-transparent pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 font-serif">
                <Clock className="w-3.5 h-3.5 text-gold-500" />
                Distribuição de Ocupação ({selectedDay})
              </span>
              <span className="text-[10px] bg-dark-bg text-slate-400 px-2.5 py-1 rounded-full border border-white/5">
                Atualizado pelo Google Maps
              </span>
            </div>

            <motion.div
              key={selectedDay}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
              className="h-60 flex items-end justify-between gap-1.5 sm:gap-3 pt-4 border-b border-white/5 pb-1"
            >
              {peakData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-dark-bg border border-gold-500/20 text-[10px] font-bold text-gold-400 px-2.5 py-1.5 rounded shadow-lg shadow-gold-500/10 pointer-events-none z-20 whitespace-nowrap">
                    {data.level}% de ocupação
                  </div>

                  {/* The bar element */}
                  <motion.div
                    variants={{
                      hidden: { height: 0, opacity: 0 },
                      visible: { height: `${data.level}%`, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
                    }}
                    whileHover={{ scaleY: 1.05, filter: 'brightness(1.2)' }}
                    className={`w-full rounded-t-sm relative transition-all origin-bottom ${getBarColor(data.level)} cursor-pointer`}
                  >
                    {/* Tiny visual gradient to make bars pop */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10" />

                    {/* Peak pulse effect */}
                    {data.level >= 85 && (
                      <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-x-0 bottom-0 h-1/3 bg-rose-400/30 rounded-t"
                      />
                    )}
                  </motion.div>

                  {/* Label for bottom */}
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono mt-2 origin-center scale-90 sm:scale-100">
                    {data.hour}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Bottom text */}
            <div className="flex items-center justify-between pt-4 text-xs text-slate-400">
              <span>Manhã (09h - 12h)</span>
              <span>Tarde (12h - 18h)</span>
              <span>Noite (18h - 21h)</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
