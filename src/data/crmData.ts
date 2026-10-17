export interface MetricItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  color: string;
}

export interface OpportunityItem {
  id: string;
  company: string;
  amount: string;
  rawAmount: number;
  timeAgo: string;
  ownerAvatar: string;
  ownerName: string;
  stage: 'prospeccion' | 'calificacion' | 'propuesta' | 'negociacion' | 'cerradas';
}

export interface ActivityItem {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  type: 'call' | 'meeting' | 'demo' | 'closing';
  durationMinutes?: number;
  contactName?: string;
  contactRole?: string;
  contactPhone?: string;
  contactEmail?: string;
  accountName?: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  priority?: 'alta' | 'media' | 'baja';
  repName?: string;
}

export interface RecentContactItem {
  id: string;
  name: string;
  companyRole: string;
  timeAgo: string;
  avatar: string;
}

export interface RecentAuditItem {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  type: 'contact' | 'opportunity' | 'task' | 'comment' | 'account';
}

export interface LeadSourceItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export const METRICS_DATA: MetricItem[] = [
  {
    id: 'm-1',
    title: 'Contactos',
    value: '428',
    change: '12%',
    isPositive: true,
    icon: 'Users',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    id: 'm-2',
    title: 'Cuentas',
    value: '96',
    change: '8%',
    isPositive: true,
    icon: 'Building2',
    color: 'text-indigo-600 bg-indigo-50'
  },
  {
    id: 'm-3',
    title: 'Oportunidades',
    value: '32',
    change: '15%',
    isPositive: true,
    icon: 'Target',
    color: 'text-purple-600 bg-purple-50'
  },
  {
    id: 'm-4',
    title: 'Ventas cerradas (MTD)',
    value: '$248,500',
    change: '22%',
    isPositive: true,
    icon: 'DollarSign',
    color: 'text-emerald-600 bg-emerald-50'
  }
];

export const PIPELINE_STAGES = [
  { id: 'prospeccion', name: 'Prospección', dotColor: 'bg-slate-400' },
  { id: 'calificacion', name: 'Calificación', dotColor: 'bg-blue-500' },
  { id: 'propuesta', name: 'Propuesta', dotColor: 'bg-purple-500' },
  { id: 'negociacion', name: 'Negociación', dotColor: 'bg-amber-500' },
  { id: 'cerradas', name: 'Cerradas', dotColor: 'bg-emerald-500' }
] as const;

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  // Prospección
  {
    id: 'opp-1',
    company: 'Grupo Innovar',
    amount: '$12,000',
    rawAmount: 12000,
    timeAgo: 'Hace 2 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Ana Torres',
    stage: 'prospeccion'
  },
  {
    id: 'opp-2',
    company: 'Soluciones del Sur',
    amount: '$8,500',
    rawAmount: 8500,
    timeAgo: 'Hace 3 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Carlos Méndez',
    stage: 'prospeccion'
  },
  {
    id: 'opp-3',
    company: 'AgroTech',
    amount: '$15,000',
    rawAmount: 15000,
    timeAgo: 'Hace 5 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Ana Torres',
    stage: 'prospeccion'
  },

  // Calificación
  {
    id: 'opp-4',
    company: 'Global Services',
    amount: '$25,000',
    rawAmount: 25000,
    timeAgo: 'Hoy',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Ana Torres',
    stage: 'calificacion'
  },
  {
    id: 'opp-5',
    company: 'Nexos S.A.',
    amount: '$18,000',
    rawAmount: 18000,
    timeAgo: 'Hace 2 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Jorge Castillo',
    stage: 'calificacion'
  },
  {
    id: 'opp-6',
    company: 'InnovaTech',
    amount: '$32,000',
    rawAmount: 32000,
    timeAgo: 'Hace 3 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Carlos Méndez',
    stage: 'calificacion'
  },

  // Propuesta
  {
    id: 'opp-7',
    company: 'Constructora Alfa',
    amount: '$45,000',
    rawAmount: 45000,
    timeAgo: 'Hace 1 día',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Ana Torres',
    stage: 'propuesta'
  },
  {
    id: 'opp-8',
    company: 'Distribuidora L & L',
    amount: '$22,000',
    rawAmount: 22000,
    timeAgo: 'Hace 3 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Ana Torres',
    stage: 'propuesta'
  },
  {
    id: 'opp-9',
    company: 'Servicios Pro',
    amount: '$38,000',
    rawAmount: 38000,
    timeAgo: 'Hace 4 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Carlos Méndez',
    stage: 'propuesta'
  },

  // Negociación
  {
    id: 'opp-10',
    company: 'Grupo Horizonte',
    amount: '$60,000',
    rawAmount: 60000,
    timeAgo: 'Hace 2 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Ana Torres',
    stage: 'negociacion'
  },
  {
    id: 'opp-11',
    company: 'Delta Corp',
    amount: '$42,000',
    rawAmount: 42000,
    timeAgo: 'Hace 3 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Ana Torres',
    stage: 'negociacion'
  },
  {
    id: 'opp-12',
    company: 'TecnoSol',
    amount: '$28,000',
    rawAmount: 28000,
    timeAgo: 'Hace 5 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Jorge Castillo',
    stage: 'negociacion'
  },

  // Cerradas
  {
    id: 'opp-13',
    company: 'Alfa Ingeniería',
    amount: '$50,000',
    rawAmount: 50000,
    timeAgo: 'Hace 1 día',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Ana Torres',
    stage: 'cerradas'
  },
  {
    id: 'opp-14',
    company: 'Best Solutions',
    amount: '$33,000',
    rawAmount: 33000,
    timeAgo: 'Hace 2 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Carlos Méndez',
    stage: 'cerradas'
  },
  {
    id: 'opp-15',
    company: 'Grupo Éxito',
    amount: '$27,000',
    rawAmount: 27000,
    timeAgo: 'Hace 4 días',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ownerName: 'Ana Torres',
    stage: 'cerradas'
  }
];

export const UPCOMING_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    time: '09:00',
    title: 'Llamada con Grupo Innovar',
    subtitle: 'Seguimiento propuesta comercial',
    type: 'call',
    durationMinutes: 30,
    contactName: 'María López',
    contactRole: 'CEO & Co-Founder',
    contactPhone: '+52 55 4123 8901',
    contactEmail: 'm.lopez@innovar.com',
    accountName: 'Grupo Innovar',
    location: 'Llamada Telefónica',
    priority: 'alta',
    repName: 'Ana Torres',
    notes: 'Confirmar si finanzas aprobó la cotización v2 con el descuento anual y definir fecha para firma de contrato.'
  },
  {
    id: 'act-2',
    time: '11:30',
    title: 'Reunión con Nexos S.A.',
    subtitle: 'Presentación de solución técnica',
    type: 'meeting',
    durationMinutes: 45,
    contactName: 'Carlos Méndez',
    contactRole: 'Gerente Comercial',
    contactPhone: '+52 81 8345 6789',
    contactEmail: 'carlos.mendez@nexos.com.mx',
    accountName: 'Nexos S.A.',
    location: 'Google Meet',
    meetingLink: 'https://meet.google.com/nex-sol-kat',
    priority: 'alta',
    repName: 'Ana Torres',
    notes: 'Presentación enfocada en el módulo de embudo de ventas y trazabilidad para su equipo de 18 asesores comerciales.'
  },
  {
    id: 'act-3',
    time: '14:00',
    title: 'Demo con Soluciones del Sur',
    subtitle: 'Demostración plataforma + Q&A',
    type: 'demo',
    durationMinutes: 60,
    contactName: 'Laura Gómez',
    contactRole: 'Gerente de Operaciones',
    contactPhone: '+52 99 9123 4567',
    contactEmail: 'lgomez@solucionesdelsur.com',
    accountName: 'Soluciones del Sur',
    location: 'Zoom Video',
    meetingLink: 'https://zoom.us/j/8892102948',
    priority: 'media',
    repName: 'Ana Torres',
    notes: 'Revisión en vivo de la captura de leads desde landing page y flujo de asignación a representantes.'
  },
  {
    id: 'act-4',
    time: '16:30',
    title: 'Llamada de cierre – Delta Corp',
    subtitle: 'Negociación contractual y SLA',
    type: 'closing',
    durationMinutes: 30,
    contactName: 'Jorge Castillo',
    contactRole: 'Director General',
    contactPhone: '+52 55 5890 1234',
    contactEmail: 'jcastillo@deltacorp.com',
    accountName: 'Delta Corp',
    location: 'Llamada Telefónica',
    priority: 'alta',
    repName: 'Ana Torres',
    notes: 'Afinar la cláusula de soporte 24/7 y confirmar la transferencia inicial para dar inicio al kickoff.'
  }
];

export const RECENT_CONTACTS: RecentContactItem[] = [
  {
    id: 'c-1',
    name: 'María López',
    companyRole: 'Grupo Innovar · CEO',
    timeAgo: 'Hace 2 h',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'c-2',
    name: 'Carlos Méndez',
    companyRole: 'Nexos S.A. · Gerente Comercial',
    timeAgo: 'Hace 4 h',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'c-3',
    name: 'Sofía Ramírez',
    companyRole: 'InnovaTech · Marketing',
    timeAgo: 'Hace 5 h',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'c-4',
    name: 'Jorge Castillo',
    companyRole: 'Delta Corp. · Director',
    timeAgo: 'Hace 6 h',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'c-5',
    name: 'Valentina Torres',
    companyRole: 'TecnoSol · Compras',
    timeAgo: 'Hace 7 h',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces'
  }
];

export const RECENT_AUDIT: RecentAuditItem[] = [
  {
    id: 'aud-1',
    title: 'Nuevo contacto',
    subtitle: 'Laura Gómez – Soluciones del Sur',
    timeAgo: 'Hace 1 h',
    type: 'contact'
  },
  {
    id: 'aud-2',
    title: 'Oportunidad actualizada',
    subtitle: 'Grupo Innovar – Etapa: Propuesta',
    timeAgo: 'Hace 2 h',
    type: 'opportunity'
  },
  {
    id: 'aud-3',
    title: 'Tarea completada',
    subtitle: 'Llamada de seguimiento – Nexos S.A.',
    timeAgo: 'Hace 3 h',
    type: 'task'
  },
  {
    id: 'aud-4',
    title: 'Nuevo comentario',
    subtitle: 'Ana Torres – Oportunidad: Delta Corp',
    timeAgo: 'Hace 5 h',
    type: 'comment'
  },
  {
    id: 'aud-5',
    title: 'Cuenta creada',
    subtitle: 'TecnoSol',
    timeAgo: 'Hace 6 h',
    type: 'account'
  }
];

export const LEAD_SOURCES: LeadSourceItem[] = [
  { name: 'Sitio web', count: 124, percentage: 29, color: '#3B82F6' },
  { name: 'Redes sociales', count: 96, percentage: 22, color: '#6366F1' },
  { name: 'Referidos', count: 72, percentage: 17, color: '#10B981' },
  { name: 'Campañas pagadas', count: 68, percentage: 16, color: '#F59E0B' },
  { name: 'Eventos', count: 42, percentage: 10, color: '#8B5CF6' },
  { name: 'Otros', count: 26, percentage: 6, color: '#64748B' }
];
