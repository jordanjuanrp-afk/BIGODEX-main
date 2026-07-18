/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CornerDownRight, Send, CheckCircle, User, ThumbsUp } from 'lucide-react';
import { INITIAL_REVIEWS } from '../data/barberData';
import { Review } from '../types';
import { motion } from 'motion/react';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest'>('recent');

  // Form State
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load reviews from local storage or static data
  useEffect(() => {
    const saved = localStorage.getItem('bigodex_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('bigodex_reviews', JSON.stringify(INITIAL_REVIEWS));
    }
  }, []);

  const handleLikeReview = (id: string) => {
    // Just a visual micro-interaction
    const updated = reviews.map((r) => {
      if (r.id === id) {
        // Toggle simulated like count using a local storage key for likes
        const likeKey = `like_${id}`;
        const hasLiked = localStorage.getItem(likeKey);
        if (hasLiked) {
          localStorage.removeItem(likeKey);
        } else {
          localStorage.setItem(likeKey, 'true');
        }
      }
      return r;
    });
    setReviews(updated);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    setIsSubmitting(true);

    const submission: Review = {
      id: `r_user_${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      text: newText,
      date: 'Agora mesmo',
      avatarInitial: newAuthor.charAt(0).toUpperCase(),
      localUser: true,
    };

    // Owner replies automated after review submission
    setTimeout(() => {
      const replyMessage = `Muito obrigado pela avaliação, ${newAuthor}! É uma honra ter você como cliente da Unidade Eucaliptos. Volte sempre! 💈✂️`;
      submission.reply = replyMessage;

      const updated = [submission, ...reviews];
      setReviews(updated);
      localStorage.setItem('bigodex_reviews', JSON.stringify(updated));

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setNewAuthor('');
      setNewText('');
      setNewRating(5);

      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 1200);
  };

  // Filter and sort logic
  const filteredReviews = reviews
    .filter((r) => ratingFilter === 'all' || r.rating === ratingFilter)
    .sort((a, b) => {
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      // For simplicity, we just put newly added reviews (with localUser flag) first, then follow order
      if (a.localUser && !b.localUser) return -1;
      if (!a.localUser && b.localUser) return 1;
      return 0;
    });

  return (
    <section id="reviews-section" className="py-16 bg-dark-bg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Column 1: Reviews display (Col-span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h2 className="text-2xl font-serif tracking-wider uppercase font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-gold-500" />
                  O que dizem nossos clientes
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Transparência total. Avaliações reais coletadas diretamente de nossa página no Google Maps.
                </p>
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2 text-xs">
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-card-bg border border-white/5 text-slate-300 rounded px-2.5 py-1.5 focus:border-gold-500 focus:outline-none font-serif uppercase tracking-wider text-[10px]"
                >
                  <option value="all">Todas Notas</option>
                  <option value="5">5 estrelas</option>
                  <option value="4">4 estrelas</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest')}
                  className="bg-card-bg border border-white/5 text-slate-300 rounded px-2.5 py-1.5 focus:border-gold-500 focus:outline-none font-serif uppercase tracking-wider text-[10px]"
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="highest">Melhores Notas</option>
                </select>
              </div>
            </motion.div>

            {/* List of reviews */}
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {filteredReviews.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-8 border border-dashed border-white/5 rounded">
                  Nenhuma avaliação correspondente encontrada.
                </p>
              )}
              {filteredReviews.map((review, index) => {
                const isLiked = !!localStorage.getItem(`like_${review.id}`);
                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
                    whileHover={{ borderColor: 'rgba(197, 160, 89, 0.2)' }}
                    className="bg-card-bg border border-white/5 rounded p-5 space-y-3 transition-colors"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-dark-bg text-gold-500 border border-white/5 font-bold flex items-center justify-center text-sm shadow">
                          {review.avatarInitial}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            {review.author}
                            {review.localUser && (
                              <span className="text-[8px] bg-gold-500/10 text-gold-400 px-1.5 py-0.5 rounded border border-gold-500/20 font-bold uppercase tracking-widest">Voce</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{review.date}</span>
                        </div>
                      </div>

                      <div className="flex text-gold-500">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < review.rating ? 'fill-current' : 'text-zinc-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Body */}
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line pl-1">
                      {review.text}
                    </p>

                    {/* Like micro interaction */}
                    <div className="flex items-center gap-4 pt-1">
                      <button
                        onClick={() => handleLikeReview(review.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                          isLiked ? 'text-gold-500' : 'text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{isLiked ? 'Gostei' : 'Gostei?'}</span>
                      </button>
                    </div>

                    {/* Owner Response */}
                    {review.reply && (
                      <div className="bg-dark-bg/60 border border-white/5 rounded p-3.5 mt-2 ml-4 flex gap-2.5 items-start">
                        <CornerDownRight className="w-4.5 h-4.5 text-gold-500/60 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="font-bold text-gold-400 text-xs flex items-center gap-1 font-serif">
                            Barbearia Bigodex (Proprietario)
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed italic">
                            &ldquo;{review.reply}&rdquo;
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Leave a review form (Col-span 5) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-card-bg border border-white/5 rounded p-6 sticky top-24">
              <h3 className="text-lg font-serif uppercase tracking-widest text-gold-500 mb-2 flex items-center gap-2">
                <Send className="w-4.5 h-4.5" />
                Deixe sua avaliação
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Cortou seu cabelo ou barba conosco recentemente? Compartilhe sua opinião sincera com a comunidade Bigodex!
              </p>

              <form onSubmit={handleAddReview} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="review-author" className="text-[10px] font-serif uppercase tracking-wider text-slate-400">
                    Seu Nome completo
                  </label>
                  <input
                    id="review-author"
                    type="text"
                    required
                    placeholder="Ex: Eduardo Henrique"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-dark-bg border border-white/5 focus:border-gold-500 rounded px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Star Selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-slate-400 block">
                    Sua Nota
                  </span>
                  <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 cursor-pointer transition-transform focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= newRating ? 'text-gold-500 fill-gold-500' : 'text-zinc-850'
                          }`}
                        />
                      </motion.button>
                    ))}
                    <span className="text-xs font-bold text-gold-500 font-serif ml-2">
                      {newRating === 5 ? 'Excelente!' : newRating === 4 ? 'Muito bom' : newRating === 3 ? 'Razoável' : 'Ruim'}
                    </span>
                  </div>
                </div>

                {/* Review message */}
                <div className="space-y-1.5">
                  <label htmlFor="review-text" className="text-[10px] font-serif uppercase tracking-wider text-slate-400">
                    Sua Mensagem
                  </label>
                  <textarea
                    id="review-text"
                    required
                    rows={4}
                    placeholder="Conte como foi sua experiência, o atendimento e o trabalho do profissional..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full bg-dark-bg border border-white/5 focus:border-gold-500 rounded px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 px-4 rounded font-serif font-bold uppercase tracking-wider text-slate-950 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Publicando no Bigodex Hub...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publicar Avaliação
                    </>
                  )}
                </motion.button>

                {/* Success feedback */}
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded text-xs font-medium"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Avaliação enviada com sucesso! O proprietário está respondendo...</span>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
