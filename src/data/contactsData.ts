export interface ContactInteraction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  date: string;
  description: string;
  user: string;
}

export interface ContactOpportunity {
  id: string;
  title: string;
  amount: string;
  stage: string;
  status: 'open' | 'won' | 'lost';
}

export interface ContactEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'call' | 'meeting';
}

export interface Contact {
  id: string;
  fullName: string;
  role: string;
  email: string;
  primaryPhone: string;
  secondaryPhone?: string;
  account: string;
  tags: string[];
  notes: string;
  avatar: string;
  status: 'active' | 'prospect' | 'lead';
  createdAt: string;
  interactions: ContactInteraction[];
  opportunities: ContactOpportunity[];
  upcomingEvents: ContactEvent[];
}

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'ct-1',
    fullName: 'María López',
    role: 'CEO & Co-Founder',
    email: 'm.lopez@innovar.com',
    primaryPhone: '+52 55 4123 8901',
    secondaryPhone: '+52 55 4123 8909',
    account: 'Grupo Innovar',
    tags: ['Decisor', 'VIP', 'Enterprise'],
    notes: 'Interesada en el paquete Enterprise con módulo de automatización comercial. Prefiere reuniones por la mañana.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
    status: 'active',
    createdAt: '12 Sep 2026',
    interactions: [
      {
        id: 'int-1',
        type: 'meeting',
        title: 'Presentación de propuesta técnica',
        date: 'Ayer, 16:00',
        description: 'Se revisó la propuesta comercial y los SLA de implementación.',
        user: 'Ana Torres'
      },
      {
        id: 'int-2',
        type: 'call',
        title: 'Llamada de alineación de alcance',
        date: '14 Oct 2026',
        description: 'Confirmó que el presupuesto fue aprobado preliminarmente por finanzas.',
        user: 'Ana Torres'
      },
      {
        id: 'int-3',
        type: 'email',
        title: 'Envío de cotización v2',
        date: '10 Oct 2026',
        description: 'Cotización con descuento por licenciamiento anual.',
        user: 'Ana Torres'
      }
    ],
    opportunities: [
      {
        id: 'opp-1',
        title: 'Implementación ERP Grupo Innovar',
        amount: '$12,000 USD',
        stage: 'Propuesta',
        status: 'open'
      }
    ],
    upcomingEvents: [
      {
        id: 'ev-1',
        title: 'Firma de contrato de confidencialidad',
        date: 'Mañana',
        time: '11:00',
        type: 'meeting'
      }
    ]
  },
  {
    id: 'ct-2',
    fullName: 'Carlos Méndez',
    role: 'Gerente Comercial',
    email: 'carlos.mendez@nexos.com.mx',
    primaryPhone: '+52 81 8345 6789',
    secondaryPhone: '+52 81 8345 6700',
    account: 'Nexos S.A.',
    tags: ['Decisor', 'Comercial'],
    notes: 'Requiere capacitación para un equipo comercial de 18 personas.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    status: 'active',
    createdAt: '18 Sep 2026',
    interactions: [
      {
        id: 'int-4',
        type: 'call',
        title: 'Seguimiento de demostración',
        date: 'Hoy, 10:30',
        description: 'Carlos solicitó acceso de prueba para 2 usuarios clave de su equipo.',
        user: 'Ana Torres'
      },
      {
        id: 'int-5',
        type: 'meeting',
        title: 'Demo plataforma en vivo',
        date: '12 Oct 2026',
        description: 'Presentación enfocada en analíticas y embudo de ventas.',
        user: 'Ana Torres'
      }
    ],
    opportunities: [
      {
        id: 'opp-5',
        title: 'Licenciamiento Pro Nexos',
        amount: '$18,000 USD',
        stage: 'Calificación',
        status: 'open'
      }
    ],
    upcomingEvents: [
      {
        id: 'ev-2',
        title: 'Reunión de dudas con Dirección Técnica',
        date: '20 Oct 2026',
        time: '15:30',
        type: 'call'
      }
    ]
  },
  {
    id: 'ct-3',
    fullName: 'Sofía Ramírez',
    role: 'Directora de Marketing',
    email: 's.ramirez@innovatech.io',
    primaryPhone: '+52 33 3678 9123',
    secondaryPhone: '',
    account: 'InnovaTech',
    tags: ['Marketing', 'Inbound', 'Lead Calificado'],
    notes: 'Interés principal en la integración con Meta Ads y Google Analytics 4.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces',
    status: 'active',
    createdAt: '22 Sep 2026',
    interactions: [
      {
        id: 'int-6',
        type: 'note',
        title: 'Revisión técnica de APIs',
        date: '15 Oct 2026',
        description: 'Sus desarrolladores verificaron la documentación de webhooks.',
        user: 'Ana Torres'
      }
    ],
    opportunities: [
      {
        id: 'opp-6',
        title: 'Suite de Marketing InnovaTech',
        amount: '$32,000 USD',
        stage: 'Calificación',
        status: 'open'
      }
    ],
    upcomingEvents: []
  },
  {
    id: 'ct-4',
    fullName: 'Jorge Castillo',
    role: 'Director General',
    email: 'jcastillo@deltacorp.com',
    primaryPhone: '+52 55 5890 1234',
    secondaryPhone: '+52 55 5890 9999',
    account: 'Delta Corp',
    tags: ['VIP', 'C-Level', 'Negociación'],
    notes: 'Cliente de alto valor. Requiere contrato personalizado y hosting dedicado.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    status: 'active',
    createdAt: '01 Oct 2026',
    interactions: [
      {
        id: 'int-7',
        type: 'meeting',
        title: 'Reunión de cierre contractual',
        date: 'Hoy, 09:00',
        description: 'Ajuste de cláusulas legales y definición de fecha de kick-off.',
        user: 'Ana Torres'
      }
    ],
    opportunities: [
      {
        id: 'opp-11',
        title: 'Transformación Digital Delta Corp',
        amount: '$42,000 USD',
        stage: 'Negociación',
        status: 'open'
      }
    ],
    upcomingEvents: [
      {
        id: 'ev-3',
        title: 'Llamada de cierre con Finanzas',
        date: 'Hoy',
        time: '16:30',
        type: 'call'
      }
    ]
  },
  {
    id: 'ct-5',
    fullName: 'Valentina Torres',
    role: 'Jefa de Compras & Adquisiciones',
    email: 'vtorres@tecnosol.mx',
    primaryPhone: '+52 44 2198 7654',
    secondaryPhone: '',
    account: 'TecnoSol',
    tags: ['Compras', 'Proveedores'],
    notes: 'Punto focal para alta en padrón de proveedores y facturación.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces',
    status: 'active',
    createdAt: '05 Oct 2026',
    interactions: [
      {
        id: 'int-8',
        type: 'email',
        title: 'Recepción de constancia fiscal y cuenta bancaria',
        date: '13 Oct 2026',
        description: 'Validación de documentos para orden de compra.',
        user: 'Ana Torres'
      }
    ],
    opportunities: [
      {
        id: 'opp-12',
        title: 'Soporte y Consultoría TecnoSol',
        amount: '$28,000 USD',
        stage: 'Negociación',
        status: 'open'
      }
    ],
    upcomingEvents: []
  },
  {
    id: 'ct-6',
    fullName: 'Laura Gómez',
    role: 'Gerente de Operaciones',
    email: 'lgomez@solucionesdelsur.com',
    primaryPhone: '+52 99 9123 4567',
    secondaryPhone: '',
    account: 'Soluciones del Sur',
    tags: ['Operaciones', 'Lead'],
    notes: 'Necesita seguimiento continuo por cambio de sede operativa.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
    status: 'lead',
    createdAt: '11 Oct 2026',
    interactions: [
      {
        id: 'int-9',
        type: 'call',
        title: 'Contacto inicial de prospección',
        date: 'Hace 1 h',
        description: 'Primer contacto vía formulario web solicitando demo.',
        user: 'Ana Torres'
      }
    ],
    opportunities: [
      {
        id: 'opp-2',
        title: 'Plan Inicial Soluciones del Sur',
        amount: '$8,500 USD',
        stage: 'Prospección',
        status: 'open'
      }
    ],
    upcomingEvents: [
      {
        id: 'ev-4',
        title: 'Demostración de la plataforma',
        date: 'Hoy',
        time: '14:00',
        type: 'meeting'
      }
    ]
  }
];
