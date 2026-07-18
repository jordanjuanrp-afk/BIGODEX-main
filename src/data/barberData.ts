/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Barber, Review, PeakHour } from '../types';

export const BUSINESS_INFO = {
  name: 'Barbearia Bigodex - Unidade Eucaliptos',
  rating: 4.9,
  reviewsCount: 354,
  address: 'Av. Araucárias, 264 - Eucaliptos, Fazenda Rio Grande - PR, 83820-071',
  phone: '(41) 99551-1677',
  whatsappUrl: 'https://api.whatsapp.com/send?phone=5541995511677&text=Ol%C3%A1%21+Gostaria+de+agendar+um+hor%C3%A1rio+na+Barbearia+Bigodex.',
  instagramUrl: 'https://instagram.com/barbeariabigodex', // standard instagram link placeholder for bigodex
  websiteUrl: 'https://frizzar.com.br',
  hours: [
    { days: 'Segunda a Quinta', open: '09:00 - 20:00' },
    { days: 'Sexta-feira', open: '09:00 - 21:00' },
    { days: 'Sábado', open: '08:00 - 19:00' },
    { days: 'Domingo', open: 'Fechado' }
  ],
  isLGBTQPlusFriendly: true,
  isWomenOwned: true,
};

export const INITIAL_SERVICES: Service[] = [
  // Categoria Cabelo
  {
    id: 's1',
    name: 'Corte Degradê / Fade',
    category: 'hair',
    price: 45.0,
    duration: 40,
    description: 'Corte moderno com transição suave nas laterais, acabamento impecável e finalização com pomada premium.'
  },
  {
    id: 's2',
    name: 'Corte Social / Clássico',
    category: 'hair',
    price: 35.0,
    duration: 30,
    description: 'Corte de cabelo tradicional, executado na tesoura ou máquina de forma equilibrada.'
  },
  {
    id: 's3',
    name: 'Corte Infantil (Até 12 anos)',
    category: 'hair',
    price: 35.0,
    duration: 30,
    description: 'Atendimento paciente e cuidadoso para garantir o melhor visual com toda tranquilidade para a criança.'
  },
  // Categoria Barba
  {
    id: 's4',
    name: 'Barboterapia Premium',
    category: 'beard',
    price: 35.0,
    duration: 40,
    description: 'Barba desenhada com toalha quente, óleos essenciais, massagem facial e navalha afiada para relaxamento total.'
  },
  {
    id: 's5',
    name: 'Aparado de Barba Simples',
    category: 'beard',
    price: 25.0,
    duration: 20,
    description: 'Alinhamento rápido dos contornos e redução de volume com máquina e tesoura.'
  },
  // Categoria Combo
  {
    id: 's6',
    name: 'Combo Tradicional (Corte + Barba)',
    category: 'combo',
    price: 70.0,
    duration: 60,
    description: 'Nosso serviço mais solicitado. Corte clássico ou moderno combinado com o desenho perfeito da barba.'
  },
  {
    id: 's7',
    name: 'Combo Bigodex VIP',
    category: 'combo',
    price: 95.0,
    duration: 80,
    description: 'Experiência completa: Corte de cabelo, Barboterapia Premium com toalha quente, Lavagem especial e Sobrancelha inclusa.'
  },
  // Categoria Tratamentos
  {
    id: 's8',
    name: 'Sobrancelha na Navalha / Pinça',
    category: 'treatment',
    price: 15.0,
    duration: 15,
    description: 'Limpeza e alinhamento do design das sobrancelhas para valorizar o olhar.'
  },
  {
    id: 's9',
    name: 'Pigmentação de Cabelo ou Barba',
    category: 'treatment',
    price: 30.0,
    duration: 30,
    description: 'Correção de falhas e realce de contornos com tintura especial de aparência natural.'
  },
  {
    id: 's10',
    name: 'Selagem / Alisamento Capilar',
    category: 'treatment',
    price: 60.0,
    duration: 50,
    description: 'Tratamento redutor de volume e frizz, proporcionando alinhamento e brilho intenso aos fios.'
  }
];

export const BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Victor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 5.0,
    bio: 'Altamente elogiado pelos clientes. Especialista em cortes degrade modernos, navalhados perfeitos e barboterapia.',
    specialties: ['Corte Degradê', 'Barboterapia VIP', 'Desenho Artístico']
  },
  {
    id: 'b2',
    name: 'Thiago (Bigode)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.9,
    bio: 'Fundador e mestre barbeiro com mais de 10 anos de experiência em cortes clássicos na tesoura e barbas tradicionais.',
    specialties: ['Cortes Clássicos', 'Barba Tradicional', 'Tesoura Livre']
  },
  {
    id: 'b3',
    name: 'Gabriel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.9,
    bio: 'Especialista em visagismo masculino, transformações visuais e tratamentos químicos como selagem e platinado.',
    specialties: ['Visagismo', 'Alisamento/Selagem', 'Pigmentação']
  },
  {
    id: 'b4',
    name: 'Lucas',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 4.8,
    bio: 'Sempre antenado com as últimas tendências mundiais. Especialista em cortes jovens, freestyle e design de sobrancelhas.',
    specialties: ['Cortes Modernos', 'Freestyle / Desenhos', 'Sobrancelhas']
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Eduardo Henrique',
    rating: 5,
    text: 'Ambiente bem limpo, organizado e com um clima bem legal. O barbeiro entendeu direitinho o que eu queria e caprichou. Atendimento rápido e preço justo pelo serviço entregue. Saí de lá com o visual renovado e já indiquei para uns amigos. Pra quem mora na região e procura uma barbearia de confiança, vale muito a pena!',
    date: 'um mês atrás',
    reply: 'Agradecemos a avaliação Eduardo',
    avatarInitial: 'E'
  },
  {
    id: 'r2',
    author: 'Andre Otacilio Farias',
    rating: 5,
    text: 'Atendimento muito bom, sempre corto com barbeiros diferentes e sempre saio muito satisfeito, equipe muito boa!',
    date: '4 meses atrás',
    reply: 'Agradecemos a avaliação André',
    avatarInitial: 'A'
  },
  {
    id: 'r3',
    author: 'Marlon de Lima',
    rating: 5,
    text: 'Já sou cliente há mais de 2 anos e gosto muito do atendimento de toda equipe, muito cordiais, respeitosos e profissionais de excelência. Destaque para o barbeiro Victor que sempre me atende e é um ótimo profissional!',
    date: '4 meses atrás',
    reply: 'Agradecemos a avaliação e preferência de sempre Marlon',
    avatarInitial: 'M'
  },
  {
    id: 'r4',
    author: 'Felipe Ribeiro',
    rating: 5,
    text: 'Ótimo lugar para cortar cabelo e fazer a barba com excelentes profissionais 👏👏👏',
    date: '6 meses atrás',
    avatarInitial: 'F'
  },
  {
    id: 'r5',
    author: 'Julio Cesar',
    rating: 5,
    text: 'Tooooop dms, recomendo.. além de inúmeros serviços, pessoal é muito gente boa.',
    date: '8 meses atrás',
    avatarInitial: 'J'
  },
  {
    id: 'r6',
    author: 'Carlos Eduardo',
    rating: 5,
    text: 'Ótimo atendimento, excelente localização que facilita a vida do caminhoneiro!',
    date: '9 meses atrás',
    avatarInitial: 'C'
  }
];

export const PEAK_HOURS: Record<string, PeakHour[]> = {
  'Sexta-feira': [
    { hour: '09h', level: 25 },
    { hour: '10h', level: 35 },
    { hour: '11h', level: 50 },
    { hour: '12h', level: 60 },
    { hour: '13h', level: 55 },
    { hour: '14h', level: 65 },
    { hour: '15h', level: 85 },
    { hour: '16h', level: 90 },
    { hour: '17h', level: 100 },
    { hour: '18h', level: 100 },
    { hour: '19h', level: 85 },
    { hour: '20h', level: 60 },
    { hour: '21h', level: 30 }
  ],
  'Sábado': [
    { hour: '08h', level: 40 },
    { hour: '09h', level: 60 },
    { hour: '10h', level: 80 },
    { hour: '11h', level: 90 },
    { hour: '12h', level: 95 },
    { hour: '13h', level: 80 },
    { hour: '14h', level: 85 },
    { hour: '15h', level: 95 },
    { hour: '16h', level: 100 },
    { hour: '17h', level: 90 },
    { hour: '18h', level: 70 },
    { hour: '19h', level: 35 }
  ],
  'Dias de Semana': [
    { hour: '09h', level: 15 },
    { hour: '10h', level: 25 },
    { hour: '11h', level: 35 },
    { hour: '12h', level: 45 },
    { hour: '13h', level: 40 },
    { hour: '14h', level: 45 },
    { hour: '15h', level: 55 },
    { hour: '16h', level: 70 },
    { hour: '17h', level: 80 },
    { hour: '18h', level: 85 },
    { hour: '19h', level: 75 },
    { hour: '20h', level: 40 }
  ]
};

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];
