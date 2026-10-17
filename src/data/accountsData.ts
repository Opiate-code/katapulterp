export interface AccountContactItem {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  isPrimary: boolean;
}

export interface AccountOpportunityItem {
  id: string;
  title: string;
  amount: string;
  rawAmount: number;
  stage: string;
  status: 'open' | 'won' | 'lost';
  closeDate: string;
}

export interface AccountActivityItem {
  id: string;
  date: string;
  type: 'call' | 'meeting' | 'contract' | 'deal' | 'support';
  title: string;
  description: string;
  user: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'empresa' | 'particular'; // B2B vs B2C
  status: 'activa' | 'potencial' | 'inactiva';
  tier: 'VIP Enterprise' | 'Corporativo' | 'PYME' | 'Particular VIP' | 'Estándar';
  industry: string;
  website?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxId?: string; // RFC o NIF
  healthScore: 'excelente' | 'estable' | 'en_riesgo';
  accountOwner: string;
  totalPipelineValue: number; // Cartera potencial
  lifetimeRevenue: number;    // Ingresos generados
  mrr?: number;               // Ingreso mensual recurrente
  createdAt: string;
  logo: string;
  notes: string;
  contacts: AccountContactItem[];
  opportunities: AccountOpportunityItem[];
  activities: AccountActivityItem[];
}

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'Grupo Innovar',
    type: 'empresa',
    status: 'activa',
    tier: 'VIP Enterprise',
    industry: 'Tecnología & Software',
    website: 'https://innovar-group.com',
    email: 'contacto@innovar.com',
    phone: '+52 55 4123 8900',
    address: 'Av. Paseo de la Reforma 404, Piso 18',
    city: 'Ciudad de México',
    country: 'México',
    taxId: 'GIN-180422-9K2',
    healthScore: 'excelente',
    accountOwner: 'Ana Torres',
    totalPipelineValue: 48000,
    lifetimeRevenue: 135000,
    mrr: 4500,
    createdAt: '15 Ene 2025',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
    notes: 'Cuenta clave regional. Proyecto actual de migración multisede y automatización comercial con soporte dedicado 24/7.',
    contacts: [
      {
        id: 'ct-1',
        name: 'María López',
        role: 'CEO & Co-Founder',
        email: 'm.lopez@innovar.com',
        phone: '+52 55 4123 8901',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
        isPrimary: true
      },
      {
        id: 'ct-1b',
        name: 'Alejandro Riva',
        role: 'Director de TI',
        email: 'a.riva@innovar.com',
        phone: '+52 55 4123 8905',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
        isPrimary: false
      }
    ],
    opportunities: [
      {
        id: 'opp-1',
        title: 'Implementación ERP Grupo Innovar',
        amount: '$12,000 USD',
        rawAmount: 12000,
        stage: 'Propuesta',
        status: 'open',
        closeDate: '30 Oct 2026'
      },
      {
        id: 'opp-1b',
        title: 'Renovación Licenciamiento Cloud Anual',
        amount: '$36,000 USD',
        rawAmount: 36000,
        stage: 'Negociación',
        status: 'open',
        closeDate: '15 Dic 2026'
      }
    ],
    activities: [
      {
        id: 'act-1',
        date: 'Ayer, 16:00',
        type: 'meeting',
        title: 'Presentación de propuesta técnica',
        description: 'Revisión con María López y equipo directivo.',
        user: 'Ana Torres'
      },
      {
        id: 'act-2',
        date: '05 Oct 2026',
        type: 'deal',
        title: 'Adición de 10 usuarios al plan',
        description: 'Ampliación solicitada para el equipo de ventas.',
        user: 'Ana Torres'
      }
    ]
  },
  {
    id: 'acc-2',
    name: 'Nexos S.A.',
    type: 'empresa',
    status: 'activa',
    tier: 'Corporativo',
    industry: 'Comercio Exterior & Logística',
    website: 'https://nexoslogistics.com',
    email: 'contacto@nexos.com.mx',
    phone: '+52 81 8345 6700',
    address: 'Parque Industrial Milenium, Bodega 4',
    city: 'Monterrey',
    country: 'México',
    taxId: 'NEX-120911-3X1',
    healthScore: 'excelente',
    accountOwner: 'Carlos Méndez',
    totalPipelineValue: 35000,
    lifetimeRevenue: 82000,
    mrr: 3200,
    createdAt: '20 Feb 2025',
    logo: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=100&h=100&fit=crop',
    notes: 'Operaciones en Monterrey y Guadalajara. Excelente historial de pago y alto interés en integraciones API.',
    contacts: [
      {
        id: 'ct-2',
        name: 'Carlos Méndez',
        role: 'Gerente Comercial',
        email: 'carlos.mendez@nexos.com.mx',
        phone: '+52 81 8345 6789',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
        isPrimary: true
      }
    ],
    opportunities: [
      {
        id: 'opp-5',
        title: 'Licenciamiento Pro Nexos',
        amount: '$18,000 USD',
        rawAmount: 18000,
        stage: 'Calificación',
        status: 'open',
        closeDate: '10 Nov 2026'
      }
    ],
    activities: [
      {
        id: 'act-3',
        date: 'Hoy, 10:30',
        type: 'call',
        title: 'Llamada de seguimiento',
        description: 'Revisión de accesos de prueba para el equipo.',
        user: 'Carlos Méndez'
      }
    ]
  },
  {
    id: 'acc-3',
    name: 'Delta Corp',
    type: 'empresa',
    status: 'potencial',
    tier: 'VIP Enterprise',
    industry: 'Ingeniería & Construcción',
    website: 'https://deltacorp.global',
    email: 'corporativo@deltacorp.com',
    phone: '+52 55 5890 1200',
    address: 'Torre del Parque 800, Piso 25',
    city: 'Ciudad de México',
    country: 'México',
    taxId: 'DEL-080315-7B8',
    healthScore: 'estable',
    accountOwner: 'Ana Torres',
    totalPipelineValue: 102000,
    lifetimeRevenue: 45000,
    createdAt: '10 Mar 2026',
    logo: 'https://images.unsplash.com/photo-1554774853-719586f82d77?w=100&h=100&fit=crop',
    notes: 'En proceso de licitación para la modernización de su ERP central. Decisor directo: Jorge Castillo.',
    contacts: [
      {
        id: 'ct-4',
        name: 'Jorge Castillo',
        role: 'Director General',
        email: 'jcastillo@deltacorp.com',
        phone: '+52 55 5890 1234',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
        isPrimary: true
      }
    ],
    opportunities: [
      {
        id: 'opp-11',
        title: 'Transformación Digital Delta Corp',
        amount: '$42,000 USD',
        rawAmount: 42000,
        stage: 'Negociación',
        status: 'open',
        closeDate: '25 Oct 2026'
      },
      {
        id: 'opp-11b',
        title: 'Infraestructura en la nube dedicada',
        amount: '$60,000 USD',
        rawAmount: 60000,
        stage: 'Propuesta',
        status: 'open',
        closeDate: '20 Nov 2026'
      }
    ],
    activities: [
      {
        id: 'act-4',
        date: 'Hoy, 09:00',
        type: 'meeting',
        title: 'Reunión de cierre contractual',
        description: 'Negociación de cláusulas finales con dirección.',
        user: 'Ana Torres'
      }
    ]
  },
  {
    id: 'acc-4',
    name: 'InnovaTech',
    type: 'empresa',
    status: 'potencial',
    tier: 'Corporativo',
    industry: 'Marketing Digital & Medios',
    website: 'https://innovatech.io',
    email: 'hello@innovatech.io',
    phone: '+52 33 3678 9100',
    address: 'Av. Américas 1500, Providencia',
    city: 'Guadalajara',
    country: 'México',
    taxId: 'INT-210602-5L3',
    healthScore: 'excelente',
    accountOwner: 'Ana Torres',
    totalPipelineValue: 32000,
    lifetimeRevenue: 28000,
    createdAt: '05 Abr 2026',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop',
    notes: 'Agencia de rápido crecimiento. Buscan automatizar la captación de leads con Katapult Studio.',
    contacts: [
      {
        id: 'ct-3',
        name: 'Sofía Ramírez',
        role: 'Directora de Marketing',
        email: 's.ramirez@innovatech.io',
        phone: '+52 33 3678 9123',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces',
        isPrimary: true
      }
    ],
    opportunities: [
      {
        id: 'opp-6',
        title: 'Suite de Marketing InnovaTech',
        amount: '$32,000 USD',
        rawAmount: 32000,
        stage: 'Calificación',
        status: 'open',
        closeDate: '18 Nov 2026'
      }
    ],
    activities: [
      {
        id: 'act-5',
        date: '15 Oct 2026',
        type: 'support',
        title: 'Revisión técnica de APIs y webhooks',
        description: 'Validación de compatibilidad con Google Analytics 4.',
        user: 'Ana Torres'
      }
    ]
  },
  {
    id: 'acc-5',
    name: 'Dr. Roberto Villanueva (Clínica Privada)',
    type: 'particular',
    status: 'activa',
    tier: 'Particular VIP',
    industry: 'Salud & Medicina Especializada',
    website: 'https://drvillanueva.com',
    email: 'dr.villanueva@medicina.mx',
    phone: '+52 55 9876 5432',
    address: 'Hospital Ángeles Lomas, Consultorio 612',
    city: 'Huixquilucan',
    country: 'México',
    taxId: 'VIGR-781105-8A1',
    healthScore: 'excelente',
    accountOwner: 'Ana Torres',
    totalPipelineValue: 15000,
    lifetimeRevenue: 64000,
    mrr: 1800,
    createdAt: '12 Nov 2025',
    logo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop',
    notes: 'Cliente particular de alto perfil. Utiliza el módulo de contactos y agenda para pacientes privados VIP.',
    contacts: [
      {
        id: 'ct-rv',
        name: 'Dr. Roberto Villanueva',
        role: 'Médico Titular & Cirujano',
        email: 'dr.villanueva@medicina.mx',
        phone: '+52 55 9876 5432',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&h=120&fit=crop&crop=faces',
        isPrimary: true
      }
    ],
    opportunities: [
      {
        id: 'opp-rv',
        title: 'Módulo de Facturación Automática Médica',
        amount: '$15,000 USD',
        rawAmount: 15000,
        stage: 'Negociación',
        status: 'open',
        closeDate: '05 Nov 2026'
      }
    ],
    activities: [
      {
        id: 'act-6',
        date: '11 Oct 2026',
        type: 'meeting',
        title: 'Alineación de requerimientos fiscales',
        description: 'Configuración de timbrado CFDI para recibos de honorarios.',
        user: 'Ana Torres'
      }
    ]
  },
  {
    id: 'acc-6',
    name: 'TecnoSol',
    type: 'empresa',
    status: 'activa',
    tier: 'PYME',
    industry: 'Energía Solar & Renovables',
    website: 'https://tecnosol.mx',
    email: 'info@tecnosol.mx',
    phone: '+52 44 2198 7600',
    address: 'Av. 5 de Febrero 1300, San Pablo',
    city: 'Querétaro',
    country: 'México',
    taxId: 'TSO-190704-2Z4',
    healthScore: 'estable',
    accountOwner: 'Jorge Castillo',
    totalPipelineValue: 28000,
    lifetimeRevenue: 52000,
    mrr: 2100,
    createdAt: '18 Jun 2025',
    logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=100&h=100&fit=crop',
    notes: 'Proyectos solares comerciales. En proceso de alta en compras con Valentina Torres.',
    contacts: [
      {
        id: 'ct-5',
        name: 'Valentina Torres',
        role: 'Jefa de Compras & Adquisiciones',
        email: 'vtorres@tecnosol.mx',
        phone: '+52 44 2198 7654',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces',
        isPrimary: true
      }
    ],
    opportunities: [
      {
        id: 'opp-12',
        title: 'Soporte y Consultoría TecnoSol',
        amount: '$28,000 USD',
        rawAmount: 28000,
        stage: 'Negociación',
        status: 'open',
        closeDate: '30 Oct 2026'
      }
    ],
    activities: [
      {
        id: 'act-7',
        date: '13 Oct 2026',
        type: 'contract',
        title: 'Validación de expediente de proveedor',
        description: 'Envío de carátula bancaria y constancia fiscal.',
        user: 'Jorge Castillo'
      }
    ]
  },
  {
    id: 'acc-7',
    name: 'Soluciones del Sur',
    type: 'empresa',
    status: 'potencial',
    tier: 'PYME',
    industry: 'Servicios Profesionales',
    website: 'https://solucionesdelsur.com',
    email: 'contacto@solucionesdelsur.com',
    phone: '+52 99 9123 4500',
    address: 'Calle 60 #450, Centro',
    city: 'Mérida',
    country: 'México',
    taxId: 'SDS-220110-1A9',
    healthScore: 'excelente',
    accountOwner: 'Ana Torres',
    totalPipelineValue: 8500,
    lifetimeRevenue: 12000,
    createdAt: '28 Jul 2026',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
    notes: 'Prospecto calificado. Demo agendada para revisar capacidades de automatización.',
    contacts: [
      {
        id: 'ct-6',
        name: 'Laura Gómez',
        role: 'Gerente de Operaciones',
        email: 'lgomez@solucionesdelsur.com',
        phone: '+52 99 9123 4567',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
        isPrimary: true
      }
    ],
    opportunities: [
      {
        id: 'opp-2',
        title: 'Plan Inicial Soluciones del Sur',
        amount: '$8,500 USD',
        rawAmount: 8500,
        stage: 'Prospección',
        status: 'open',
        closeDate: '15 Nov 2026'
      }
    ],
    activities: [
      {
        id: 'act-8',
        date: 'Hace 1 h',
        type: 'call',
        title: 'Contacto inicial de prospección',
        description: 'Laura solicitó información detallada de planes.',
        user: 'Ana Torres'
      }
    ]
  },
  {
    id: 'acc-8',
    name: 'Arq. Mariana Esteves (Estudio de Arquitectura)',
    type: 'particular',
    status: 'inactiva',
    tier: 'Estándar',
    industry: 'Diseño & Arquitectura',
    website: 'https://marianaesteves.mx',
    email: 'mariana@estevesarq.com',
    phone: '+52 55 3344 5566',
    address: 'Colonia Condesa, Ámsterdam 120',
    city: 'Ciudad de México',
    country: 'México',
    taxId: 'EASM-840912-4H7',
    healthScore: 'en_riesgo',
    accountOwner: 'Carlos Méndez',
    totalPipelineValue: 0,
    lifetimeRevenue: 18500,
    createdAt: '02 Feb 2025',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    notes: 'Proyecto finalizado en mayo 2026. Requiere campaña de reactivación para nuevos desarrollos residenciales.',
    contacts: [
      {
        id: 'ct-me',
        name: 'Arq. Mariana Esteves',
        role: 'Titular de Despacho',
        email: 'mariana@estevesarq.com',
        phone: '+52 55 3344 5566',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces',
        isPrimary: true
      }
    ],
    opportunities: [],
    activities: [
      {
        id: 'act-9',
        date: '20 May 2026',
        type: 'deal',
        title: 'Cierre satisfactorio de proyecto',
        description: 'Entrega final y finiquito de contrato de consultoría.',
        user: 'Carlos Méndez'
      }
    ]
  }
];
