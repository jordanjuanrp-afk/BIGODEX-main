/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, User, CheckCircle, ChevronRight, ChevronLeft, Clock, ShoppingBag, Phone, Sparkles, Receipt, X } from 'lucide-react';
import { INITIAL_SERVICES, BARBERS, TIME_SLOTS, BUSINESS_INFO } from '../data/barberData';
import { Service, Barber, Appointment } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BookingFormProps {
  initialService?: Service | null;
  initialBarber?: Barber | null;
  onClose: () => void;
}

export default function BookingForm({ initialService, initialBarber, onClose }: BookingFormProps) {
  const [step, setStep] = useState(1);
  
  // Selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Service[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [anyBarber, setAnyBarber] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // User details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Completed booking
  const [bookingResult, setBookingResult] = useState<Appointment | null>(null);

  // Booked time slots: { "YYYY-MM-DD_barberId": ["09:00", "10:30", ...] }
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('bigodex_booked_slots');
    return saved ? JSON.parse(saved) : {};
  });

  // Load initials if provided
  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
      setStep(2); // Jump to barber selection if service is pre-chosen
    }
  }, [initialService]);

  useEffect(() => {
    if (initialBarber) {
      setSelectedBarber(initialBarber);
      setAnyBarber(false);
      if (!selectedService) {
        setStep(1); // Choose service first
      } else {
        setStep(3); // Go to Date & Time
      }
    }
  }, [initialBarber, selectedService]);

  // Refresh booked slots every 30 seconds after confirmation
  useEffect(() => {
    if (step !== 5) return;
    const interval = setInterval(() => {
      const saved = localStorage.getItem('bigodex_booked_slots');
      if (saved) {
        setBookedSlots(JSON.parse(saved));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [step]);

  // Generate dynamic days (next 7 days, excluding Sunday)
  const getNextDays = () => {
    const days: Date[] = [];
    const now = new Date();
    
    // Generates 8 calendar days ahead to make sure we always have 7 slots (skipping Sundays)
    for (let i = 0; days.length < 7 && i < 12; i++) {
      const nextDate = new Date();
      nextDate.setDate(now.getDate() + i);
      if (nextDate.getDay() !== 0) { // Skip Sunday
        days.push(nextDate);
      }
    }
    return days;
  };

  const bookingDays = getNextDays();

  // Handle Addon Toggles
  const handleToggleAddon = (addon: Service) => {
    if (selectedAddons.find((item) => item.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((item) => item.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Pricing calculations
  const primaryPrice = selectedService ? selectedService.price : 0;
  const addonsPrice = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = primaryPrice + addonsPrice;
  const totalDuration = (selectedService ? selectedService.duration : 0) + 
                        selectedAddons.reduce((sum, item) => sum + item.duration, 0);

  // Apply basic phone input mask
  const handlePhoneChange = (val: string) => {
    const numbersOnly = val.replace(/\D/g, '');
    let formatted = numbersOnly;
    if (numbersOnly.length > 0) {
      formatted = `(${numbersOnly.slice(0, 2)}`;
    }
    if (numbersOnly.length > 2) {
      formatted += `) ${numbersOnly.slice(2, 7)}`;
    }
    if (numbersOnly.length > 7) {
      formatted += `-${numbersOnly.slice(7, 11)}`;
    }
    setPhone(formatted.slice(0, 15));
  };

  // Submit appointment creation
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || (!selectedBarber && !anyBarber) || !selectedDate || !selectedTime || !name || !phone) return;

    const code = `BGDX-${Math.floor(1000 + Math.random() * 9000)}`;
    const barberName = anyBarber ? 'Qualquer Profissional' : selectedBarber!.name;
    const dateStr = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    const newAppointment: Appointment = {
      id: `app_${Date.now()}`,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      serviceId: selectedService.id,
      serviceName: `${selectedService.name} ${selectedAddons.length > 0 ? `+ ${selectedAddons.map(a => a.name).join(', ')}` : ''}`,
      barberId: anyBarber ? 'any' : selectedBarber!.id,
      barberName,
      date: dateStr,
      time: selectedTime,
      price: totalPrice,
      status: 'confirmed',
      code
    };

    // Save appointment in localStorage
    const existing = localStorage.getItem('bigodex_appointments');
    const appointmentsList = existing ? JSON.parse(existing) : [];
    appointmentsList.push(newAppointment);
    localStorage.setItem('bigodex_appointments', JSON.stringify(appointmentsList));

    // Save booked slot in localStorage
    const dateKey = selectedDate.toISOString().split('T')[0];
    const barberKey = anyBarber ? 'any' : selectedBarber!.id;
    const slotKey = `${dateKey}_${barberKey}`;
    const existingSlots = bookedSlots;
    const currentSlots = existingSlots[slotKey] || [];
    if (!currentSlots.includes(selectedTime)) {
      const updatedSlots = { ...existingSlots, [slotKey]: [...currentSlots, selectedTime] };
      setBookedSlots(updatedSlots);
      localStorage.setItem('bigodex_booked_slots', JSON.stringify(updatedSlots));
    }

    setBookingResult(newAppointment);
    setStep(5);
  };

  // Format Whatsapp confirmation text
  const getWhatsAppMessageUrl = () => {
    if (!bookingResult) return '';
    const text = `Olá! Realizei o agendamento de um horário pelo site da Barbearia Bigodex.\n\n📋 *Resumo do Agendamento:*\n• *Código:* #${bookingResult.code}\n• *Cliente:* ${bookingResult.customerName}\n• *Serviço:* ${bookingResult.serviceName}\n• *Profissional:* ${bookingResult.barberName}\n• *Data:* ${bookingResult.date}\n• *Horário:* ${bookingResult.time}\n• *Valor Total:* R$ ${bookingResult.price.toFixed(2).replace('.', ',')}\n\nPor favor, confirmem o meu horário no sistema!`;
    return `https://api.whatsapp.com/send?phone=5541995511677&text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-card-bg border border-white/5 rounded w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-dark-bg border-b border-white/5 shrink-0">
          <div>
            <h3 className="font-serif uppercase tracking-widest text-gold-500 text-sm sm:text-base flex items-center gap-1.5 font-bold">
              <Calendar className="w-5 h-5 text-gold-500" />
              Agendar na Bigodex
            </h3>
            {step < 5 && (
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Passo {step} de 4
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic content scrollable area */}
        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">

            {/* STEP 1: SELECT SERVICE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-gold-500 text-sm font-serif uppercase tracking-widest mb-2 font-bold">1. Selecione o Serviço Principal</h4>
                  <p className="text-slate-400 text-xs">Selecione o corte ou barba de sua preferência para iniciar.</p>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {INITIAL_SERVICES.filter(s => s.category !== 'treatment').map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service);
                        setStep(2);
                      }}
                      className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer flex justify-between items-center ${
                        selectedService?.id === service.id
                          ? 'bg-gold-500/10 border-gold-500'
                          : 'bg-dark-bg/60 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div>
                        <h5 className="font-serif tracking-wide text-xs sm:text-sm text-white font-bold">{service.name}</h5>
                        <div className="flex gap-2 text-[10px] text-slate-400 mt-1 font-mono uppercase">
                          <span>{service.duration} Minutos</span>
                          <span>•</span>
                          <span>{service.category === 'combo' ? 'Combo Especial' : 'Serviço'}</span>
                        </div>
                      </div>
                      <span className="font-mono text-gold-500 text-sm sm:text-base whitespace-nowrap font-bold">
                        R$ {service.price.toFixed(2).replace('.', ',')}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: CHOOSE BARBER */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-gold-500 text-sm font-serif uppercase tracking-widest mb-2 font-bold">2. Escolha o Profissional</h4>
                  <p className="text-slate-400 text-xs">Escolha um barbeiro específico ou opte por qualquer profissional livre.</p>
                </div>

                {/* Option "Any Professional" */}
                <button
                  onClick={() => {
                    setAnyBarber(true);
                    setSelectedBarber(null);
                    setStep(3);
                  }}
                  className={`w-full text-left p-4 rounded border transition-all cursor-pointer flex items-center justify-between ${
                    anyBarber
                      ? 'bg-gold-500/10 border-gold-500'
                      : 'bg-dark-bg/60 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dark-bg text-gold-500 font-bold flex items-center justify-center text-sm border border-white/5">
                      ✂️
                    </div>
                    <div>
                      <h5 className="font-serif text-xs sm:text-sm text-white font-bold">Qualquer profissional disponível</h5>
                      <p className="text-[10px] text-slate-400">Escolhe o primeiro barbeiro livre na hora do seu atendimento.</p>
                    </div>
                  </div>
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-slate-550 font-serif font-bold uppercase tracking-wider">Ou escolha um específico</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                  {BARBERS.map((barber) => (
                    <button
                      key={barber.id}
                      onClick={() => {
                        setSelectedBarber(barber);
                        setAnyBarber(false);
                        setStep(3);
                      }}
                      className={`p-3 rounded border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                        selectedBarber?.id === barber.id
                          ? 'bg-gold-500/10 border-gold-500'
                          : 'bg-dark-bg/60 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-12 h-12 object-cover rounded-full border border-white/5"
                        referrerPolicy="no-referrer"
                      />
                      <div className="mt-2 text-center">
                        <h5 className="font-serif text-xs text-white font-bold">{barber.name}</h5>
                        <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{barber.specialties[0]}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: DATE & TIME */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-gold-500 text-sm font-serif uppercase tracking-widest mb-1 font-bold">3. Data & Horário</h4>
                  <p className="text-slate-400 text-xs">Selecione o dia e depois clique em um horário disponível.</p>
                </div>

                {/* Next 7 Days Slider */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {bookingDays.map((date, index) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const dayLabel = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                    const dayNum = date.getDate();
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(''); // Reset time on date change
                        }}
                        className={`flex-shrink-0 w-14 py-3 rounded border text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
                          isSelected
                            ? 'bg-gold-500 text-slate-950 border-gold-500 font-bold font-serif'
                            : 'bg-dark-bg border-white/5 text-slate-450 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-tight">{dayLabel}</span>
                        <span className="text-sm font-extrabold mt-0.5">{dayNum}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots Selector */}
                {selectedDate ? (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-serif font-bold uppercase tracking-wider block">
                      Horários Disponíveis para {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                    </span>
                    <div className="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto pr-1">
                      {TIME_SLOTS.map((time, idx) => {
                        const isTimeSelected = selectedTime === time;
                        const dateKey = selectedDate.toISOString().split('T')[0];
                        const barberKey = anyBarber ? 'any' : selectedBarber?.id || 'any';
                        const slotKey = `${dateKey}_${barberKey}`;
                        const isBooked = (bookedSlots[slotKey] || []).includes(time);
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 rounded text-xs font-mono text-center border transition-all cursor-pointer ${
                              isBooked
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400/50 cursor-not-allowed line-through'
                                : isTimeSelected
                                  ? 'bg-gold-500 text-slate-950 border-gold-500 font-bold'
                                  : 'bg-dark-bg border-white/5 text-slate-300 hover:border-white/10'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs text-center py-8">
                    Selecione um dia acima para carregar os horários.
                  </p>
                )}

                {/* Add-ons Sub-Selection for Extras */}
                {selectedDate && selectedTime && (
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <span className="text-[10px] text-gold-550 font-serif font-bold uppercase tracking-wider block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                      Deseja adicionar algo extra? (Opcional)
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {INITIAL_SERVICES.filter(s => s.category === 'treatment').map((addon) => {
                        const isAdded = selectedAddons.find(a => a.id === addon.id);
                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => handleToggleAddon(addon)}
                            className={`flex-shrink-0 px-3 py-2 rounded text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isAdded
                                ? 'bg-gold-500/10 text-gold-400 border-gold-500'
                                : 'bg-dark-bg border-white/5 text-slate-400'
                            }`}
                          >
                            <span>{addon.name} (+R$ {addon.price})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: CONTACT CONFIRMATION FORM */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-gold-500 text-sm font-serif uppercase tracking-widest mb-2 font-bold">4. Seus Dados de Contato</h4>
                  <p className="text-slate-400 text-xs">Precisamos dessas informações para registrar e sincronizar seu agendamento.</p>
                </div>

                <form onSubmit={handleConfirmBooking} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label htmlFor="customer-name" className="text-[10px] font-serif uppercase tracking-wider text-slate-400">
                      Nome Completo
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-dark-bg border border-white/5 focus:border-gold-500 rounded px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="customer-phone" className="text-[10px] font-serif uppercase tracking-wider text-slate-400">
                      WhatsApp (Com DDD)
                    </label>
                    <input
                      id="customer-phone"
                      type="text"
                      required
                      placeholder="Ex: (41) 99999-9999"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full bg-dark-bg border border-white/5 focus:border-gold-500 rounded px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="customer-email" className="text-[10px] font-serif uppercase tracking-wider text-slate-400">
                      E-mail (Opcional)
                    </label>
                    <input
                      id="customer-email"
                      type="email"
                      placeholder="Ex: joao@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-dark-bg border border-white/5 focus:border-gold-500 rounded px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="customer-notes" className="text-[10px] font-serif uppercase tracking-wider text-slate-400">
                      Observações ou Preferências (Opcional)
                    </label>
                    <textarea
                      id="customer-notes"
                      rows={2}
                      placeholder="Ex: Prefiro cabelo lavado antes de cortar, ou observação sobre barba..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-dark-bg border border-white/5 focus:border-gold-500 rounded px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <button type="submit" className="hidden" id="hidden-submit-trigger" />
                </form>
              </motion.div>
            )}

            {/* STEP 5: SUCCESS & RECEIPT TICKET */}
            {step === 5 && bookingResult && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="text-gold-500 text-lg font-serif uppercase tracking-widest font-bold">Agendamento Realizado!</h4>
                  <p className="text-slate-400 text-xs max-w-sm mt-1">
                    Seu horário foi reservado em nossa base local. Agora conclua confirmando no WhatsApp.
                  </p>
                </div>

                {/* Premium Ticket Receipt */}
                <div className="relative bg-dark-bg border border-white/5 rounded overflow-hidden p-5 text-left">
                  {/* Decorative Ticket Side Cuts */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card-bg border-r border-white/5" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card-bg border-l border-white/5" />

                  <div className="flex justify-between items-center pb-3 border-b border-dashed border-white/5">
                    <span className="text-[10px] uppercase font-serif tracking-wider font-bold text-slate-500">Cupom de Agendamento</span>
                    <span className="text-gold-500 font-serif font-bold text-sm">#{bookingResult.code}</span>
                  </div>

                  <div className="space-y-3.5 pt-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-serif tracking-wider font-bold block">Cliente</span>
                        <span className="text-white font-medium">{bookingResult.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-serif tracking-wider font-bold block">Profissional</span>
                        <span className="text-white font-medium">{bookingResult.barberName}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-serif tracking-wider font-bold block">Data</span>
                        <span className="text-white font-medium">{bookingResult.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-serif tracking-wider font-bold block">Horário</span>
                        <span className="text-gold-400 font-mono font-bold">{bookingResult.time}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-serif tracking-wider font-bold block">Serviço(s)</span>
                      <span className="text-white font-medium line-clamp-2">{bookingResult.serviceName}</span>
                    </div>

                    <div className="flex justify-between items-end pt-3 border-t border-white/5">
                      <span className="text-slate-500 text-[10px] uppercase font-serif tracking-wider font-bold">Total a Pagar</span>
                      <span className="text-lg font-serif font-bold text-gold-500">R$ {bookingResult.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>

                {/* Final Whatsapp Call To Action */}
                <div className="space-y-3 pt-2">
                  <a
                    href={getWhatsAppMessageUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded font-serif font-bold uppercase tracking-wider text-slate-950 bg-gold-500 hover:bg-gold-600 transition-colors shadow-lg cursor-pointer text-xs sm:text-sm"
                  >
                    <Phone className="w-4.5 h-4.5" />
                    Confirmar no WhatsApp
                  </a>

                  <p className="text-[10px] text-slate-550 leading-relaxed max-w-sm mx-auto">
                    Você será redirecionado para o WhatsApp com uma mensagem estruturada com todos os dados acima para garantir sua vaga imediata.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom Actions Footer (Only if step < 5) */}
        {step < 5 && (
          <div className="px-6 py-4 bg-dark-bg border-t border-white/5 flex justify-between gap-4 shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded border border-white/5 hover:bg-white/5 text-slate-300 text-xs font-serif uppercase tracking-wider font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                disabled={
                  (step === 1 && !selectedService) ||
                  (step === 2 && !selectedBarber && !anyBarber) ||
                  (step === 3 && (!selectedDate || !selectedTime))
                }
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded text-slate-950 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-xs font-serif uppercase tracking-wider font-bold flex items-center gap-1 transition-all cursor-pointer ml-auto"
              >
                Avançar
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!name || !phone}
                onClick={(e) => {
                  const formSubmit = document.getElementById('hidden-submit-trigger');
                  if (formSubmit) formSubmit.click();
                }}
                className="px-5 py-2.5 rounded text-slate-950 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-xs font-serif uppercase tracking-wider font-extrabold flex items-center gap-1 transition-all cursor-pointer ml-auto"
              >
                Concluir Agendamento
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
