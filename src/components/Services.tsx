/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Scissors, Sparkles, Flame, CheckCircle, Clock } from 'lucide-react';
import { INITIAL_SERVICES } from '../data/barberData';
import { Service } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesProps {
  onSelectService: (service: Service) => void;
}

type CategoryType = 'all' | 'hair' | 'beard' | 'combo' | 'treatment';

export default function Services({ onSelectService }: ServicesProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const categories = [
    { id: 'all', label: 'Todos os Serviços', icon: Scissors },
    { id: 'hair', label: 'Cabelo', icon: Scissors },
    { id: 'beard', label: 'Barba / Navalha', icon: Flame },
    { id: 'combo', label: 'Combos Especiais', icon: Sparkles },
    { id: 'treatment', label: 'Tratamentos', icon: Sparkles }
  ];

  const filteredServices = INITIAL_SERVICES.filter(
    (service) => activeCategory === 'all' || service.category === activeCategory
  );

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'combo':
        return 'text-gold-400 bg-gold-500/10 border-gold-500/20';
      case 'hair':
        return 'text-slate-300 bg-white/5 border-white/10';
      case 'beard':
        return 'text-gold-300 bg-gold-500/10 border-gold-500/20';
      default:
        return 'text-slate-400 bg-white/5 border-white/5';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'combo': return 'Combo Economia';
      case 'hair': return 'Cabelo';
      case 'beard': return 'Barba';
      case 'treatment': return 'Estética & Tratamento';
      default: return 'Serviço';
    }
  };

  return (
    <section id="services-section" className="py-16 bg-dark-bg border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif tracking-widest text-gold-500 uppercase font-bold">
            Nossos Serviços e Preços
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm">
            Trabalhamos com materiais descartáveis, equipamentos de última geração esterilizados e produtos premium para finalizar seu penteado com altíssima fixação.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="flex flex-wrap justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                variants={{
                  hidden: { opacity: 0, y: 15, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id as CategoryType)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs sm:text-sm font-serif uppercase tracking-wider font-semibold transition-colors duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-md shadow-gold-500/10'
                    : 'bg-card-bg text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-gold-500" />
                {cat.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={service.id}
                className="group relative bg-card-bg rounded p-5 border border-white/5 hover:border-gold-500/40 transition-all flex flex-col justify-between"
              >
                {/* Accent line for top of combo cards */}
                {service.category === 'combo' && (
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-gold-600 to-gold-400 rounded-t" />
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getCategoryColor(service.category)}`}>
                      {getCategoryLabel(service.category)}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 text-gold-500/75" />
                      {service.duration} min
                    </div>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-gold-400 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-6 mt-4 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider">Preço</span>
                    <span className="text-xl font-serif font-bold text-gold-400">
                      R$ {service.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectService(service)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase tracking-wider text-gold-500 hover:text-slate-950 bg-gold-500/10 hover:bg-gold-500 transition-all border border-gold-500/20 hover:border-gold-500 shadow cursor-pointer"
                  >
                    Agendar
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
