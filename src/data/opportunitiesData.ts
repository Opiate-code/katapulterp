export interface DetailedOpportunity {
  id: string;
  title: string;
  company: string;          // Cuenta asociada
  accountId: string;        // ID para enlace con el módulo de Cuentas
  dealType: 'new_business' | 'cross_selling' | 'upselling' | 'renewal';
  amount: string;
  rawAmount: number;
  probability: number;      // 0 - 100%
  expectedCloseDate: string;// YYYY-MM-DD o formato legible
  ownerName: string;
  ownerAvatar: string;
  stage: 'prospeccion' | 'calificacion' | 'propuesta' | 'negociacion' | 'cerrada_ganada' | 'cerrada_perdida';
  contactPerson: string;
  contactRole: string;
  contactPhone: string;
  contactEmail: string;
  serviceInterest: string;  // Servicio adicional o módulo de interés
  nextActivity: string;
  notes: string;
  createdAt: string;
}

export interface PipelineStageConfig {
  id: DetailedOpportunity['stage'];
  name: string;
  defaultProbability: number;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
}

export const STAGES_CONFIG: PipelineStageConfig[] = [
  {
    id: 'prospeccion',
    name: 'Prospección',
    defaultProbability: 10,
    dotColor: 'bg-slate-400',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700'
  },
  {
    id: 'calificacion',
    name: 'Calificación',
    defaultProbability: 25,
    dotColor: 'bg-blue-500',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700'
  },
  {
    id: 'propuesta',
    name: 'Propuesta',
    defaultProbability: 50,
    dotColor: 'bg-purple-500',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700'
  },
  {
    id: 'negociacion',
    name: 'Negociación',
    defaultProbability: 80,
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800'
  },
  {
    id: 'cerrada_ganada',
    name: 'Ganada',
    defaultProbability: 100,
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700'
  }
];

export const INITIAL_DETAILED_OPPORTUNITIES: DetailedOpportunity[] = [
  // 1. Prospección
  {
    id: 'opp-1',
    title: 'Migración a Katapult ERP Cloud',
    company: 'Soluciones del Sur',
    accountId: 'acc-7',
    dealType: 'new_business',
    amount: '$8,500 USD',
    rawAmount: 8500,
    probability: 15,
    expectedCloseDate: '2026-11-20',
    ownerName: 'Ana Torres',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    stage: 'prospeccion',
    contactPerson: 'Laura Gómez',
    contactRole: 'Gerente de Operaciones',
    contactPhone: '+52 99 9123 4567',
    contactEmail: 'lgomez@solucionesdelsur.com',
    serviceInterest: 'Plan Inicial Katapult + Capacitación',
    nextActivity: 'Demostración de la plataforma (Hoy, 14:00)',
    notes: 'Primer acercamiento positivo. Requieren facilidad de uso y reporte de ventas para sucursales.',
    createdAt: '11 Oct 2026'
  },
  {
    id: 'opp-2',
    title: 'Venta Cruzada: Módulo de Automatización IA',
    company: 'Grupo Innovar',
    accountId: 'acc-1',
    dealType: 'cross_selling',
    amount: '$18,000 USD',
    rawAmount: 18000,
    probability: 20,
    expectedCloseDate: '2026-11-30',
    ownerName: 'Ana Torres',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    stage: 'prospeccion',
    contactPerson: 'María López',
    contactRole: 'CEO & Co-Founder',
    contactPhone: '+52 55 4123 8901',
    contactEmail: 'm.lopez@innovar.com',
    serviceInterest: 'Servicio Adicional: Katapult AI Insights & Bots',
    nextActivity: 'Envío de casos de éxito y ROI estimado',
    notes: 'Oportunidad de cross-selling detectada por alto volumen de leads no atendidos a tiempo.',
    createdAt: '14 Oct 2026'
  },

  // 2. Calificación
  {
    id: 'opp-3',
    title: 'Suite de Marketing & Captación de Leads',
    company: 'InnovaTech',
    accountId: 'acc-4',
    dealType: 'new_business',
    amount: '$32,000 USD',
    rawAmount: 32000,
    probability: 35,
    expectedCloseDate: '2026-11-18',
    ownerName: 'Ana Torres',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    stage: 'calificacion',
    contactPerson: 'Sofía Ramírez',
    contactRole: 'Directora de Marketing',
    contactPhone: '+52 33 3678 9123',
    contactEmail: 's.ramirez@innovatech.io',
    serviceInterest: 'Integración Webhooks + Google Analytics 4',
    nextActivity: 'Reunión de dudas con Dirección Técnica (20 Oct)',
    notes: 'Presupuesto validado para Q4. Quieren sustituir HubSpot con Katapult Studio.',
    createdAt: '08 Oct 2026'
  },
  {
    id: 'opp-4',
    title: 'Upselling: Expansión de 20 a 50 Licencias',
    company: 'Nexos S.A.',
    accountId: 'acc-2',
    dealType: 'upselling',
    amount: '$18,000 USD',
    rawAmount: 18000,
    probability: 40,
    expectedCloseDate: '2026-11-10',
    ownerName: 'Carlos Méndez',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    stage: 'calificacion',
    contactPerson: 'Carlos Méndez',
    contactRole: 'Gerente Comercial',
    contactPhone: '+52 81 8345 6789',
    contactEmail: 'carlos.mendez@nexos.com.mx',
    serviceInterest: 'Adición de 30 usuarios y módulo aduanal',
    nextActivity: 'Llamada de confirmación de accesos de prueba',
    notes: 'Cuentan con nuevo equipo comercial en Guadalajara que requiere incorporarse al CRM.',
    createdAt: '05 Oct 2026'
  },

  // 3. Propuesta
  {
    id: 'opp-5',
    title: 'Implementación ERP Grupo Innovar',
    company: 'Grupo Innovar',
    accountId: 'acc-1',
    dealType: 'renewal',
    amount: '$12,000 USD',
    rawAmount: 12000,
    probability: 60,
    expectedCloseDate: '2026-10-30',
    ownerName: 'Ana Torres',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    stage: 'propuesta',
    contactPerson: 'María López',
    contactRole: 'CEO & Co-Founder',
    contactPhone: '+52 55 4123 8901',
    contactEmail: 'm.lopez@innovar.com',
    serviceInterest: 'Renovación y SLA Platinum Multisede',
    nextActivity: 'Firma de contrato de confidencialidad',
    notes: 'Cotización v2 enviada con descuento anual. Esperando visto bueno del CFO.',
    createdAt: '28 Sep 2026'
  },
  {
    id: 'opp-6',
    title: 'Venta Cruzada: Servidor Dedicado Cloud',
    company: 'Delta Corp',
    accountId: 'acc-3',
    dealType: 'cross_selling',
    amount: '$60,000 USD',
    rawAmount: 60000,
    probability: 55,
    expectedCloseDate: '2026-11-20',
    ownerName: 'Ana Torres',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    stage: 'propuesta',
    contactPerson: 'Jorge Castillo',
    contactRole: 'Director General',
    contactPhone: '+52 55 5890 1234',
    contactEmail: 'jcastillo@deltacorp.com',
    serviceInterest: 'Servicio Adicional: Infraestructura y Hosting Aislado',
    nextActivity: 'Revisión de SLA de latencia con Arquitectura',
    notes: 'Complemento de infraestructura para soportar 200 empleados simultáneos.',
    createdAt: '01 Oct 2026'
  },

  // 4. Negociación
  {
    id: 'opp-7',
    title: 'Transformación Digital Delta Corp',
    company: 'Delta Corp',
    accountId: 'acc-3',
    dealType: 'new_business',
    amount: '$42,000 USD',
    rawAmount: 42000,
    probability: 85,
    expectedCloseDate: '2026-10-25',
    ownerName: 'Ana Torres',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    stage: 'negociacion',
    contactPerson: 'Jorge Castillo',
    contactRole: 'Director General',
    contactPhone: '+52 55 5890 1234',
    contactEmail: 'jcastillo@deltacorp.com',
    serviceInterest: 'Katapult ERP Enterprise Full Suite',
    nextActivity: 'Llamada de cierre con Finanzas (Hoy, 16:30)',
    notes: 'Etapa final. Redacción de términos de pago Net 30 y kickoff para noviembre.',
    createdAt: '15 Sep 2026'
  },
  {
    id: 'opp-8',
    title: 'Soporte y Consultoría TecnoSol',
    company: 'TecnoSol',
    accountId: 'acc-6',
    dealType: 'renewal',
    amount: '$28,000 USD',
    rawAmount: 28000,
    probability: 80,
    expectedCloseDate: '2026-10-30',
    ownerName: 'Jorge Castillo',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    stage: 'negociacion',
    contactPerson: 'Valentina Torres',
    contactRole: 'Jefa de Compras & Adquisiciones',
    contactPhone: '+52 44 2198 7654',
    contactEmail: 'vtorres@tecnosol.mx',
    serviceInterest: 'Consultoría y SLA Anual Renovable',
    nextActivity: 'Envío de orden de compra validada',
    notes: 'Documentación fiscal aprobada en compras. Falta emisión de la orden oficial.',
    createdAt: '20 Sep 2026'
  },
  {
    id: 'opp-9',
    title: 'Módulo de Facturación Automática Médica',
    company: 'Dr. Roberto Villanueva (Clínica Privada)',
    accountId: 'acc-5',
    dealType: 'cross_selling',
    amount: '$15,000 USD',
    rawAmount: 15000,
    probability: 90,
    expectedCloseDate: '2026-11-05',
    ownerName: 'Ana Torres',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    stage: 'negociacion',
    contactPerson: 'Dr. Roberto Villanueva',
    contactRole: 'Médico Titular & Cirujano',
    contactPhone: '+52 55 9876 5432',
    contactEmail: 'dr.villanueva@medicina.mx',
    serviceInterest: 'Servicio Adicional: Conector CFDI 4.0 Médico',
    nextActivity: 'Revisión final de plantillas con su contador',
    notes: 'Interés directo para agilizar timbrado de recibos de honorarios de consultas privadas.',
    createdAt: '02 Oct 2026'
  },

  // 5. Cerradas Ganadas (MTD)
  {
    id: 'opp-10',
    title: 'Despliegue ERP y CRM Alfa Ingeniería',
    company: 'Alfa Ingeniería',
    accountId: 'acc-alfa',
    dealType: 'new_business',
    amount: '$50,000 USD',
    rawAmount: 50000,
    probability: 100,
    expectedCloseDate: '2026-10-15',
    ownerName: 'Ana Torres',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    stage: 'cerrada_ganada',
    contactPerson: 'Ing. Fernando Mora',
    contactRole: 'Director de Operaciones',
    contactPhone: '+52 55 7788 9900',
    contactEmail: 'fmora@alfaing.com',
    serviceInterest: 'Contrato Anual Enterprise',
    nextActivity: 'Kickoff de proyecto completado',
    notes: 'Trato cerrado exitosamente. Facturado y cobrado el 50% de anticipo.',
    createdAt: '01 Sep 2026'
  },
  {
    id: 'opp-11',
    title: 'Suite Comercial Best Solutions',
    company: 'Best Solutions',
    accountId: 'acc-best',
    dealType: 'new_business',
    amount: '$33,000 USD',
    rawAmount: 33000,
    probability: 100,
    expectedCloseDate: '2026-10-14',
    ownerName: 'Carlos Méndez',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    stage: 'cerrada_ganada',
    contactPerson: 'Lic. Claudia Vega',
    contactRole: 'Directora Comercial',
    contactPhone: '+52 81 2233 4455',
    contactEmail: 'cvega@bestsolutions.mx',
    serviceInterest: 'Katapult Pro 25 Usuarios',
    nextActivity: 'Onboarding de usuarios en proceso',
    notes: 'Trato cerrado con pago anual anticipado.',
    createdAt: '15 Sep 2026'
  }
];
