export type ActivityType = 'meeting' | 'call' | 'task' | 'email' | 'proposal' | 'review';
export type ActivityPriority = 'alta' | 'media' | 'baja';
export type ActivityStatus = 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';

export interface ActivityAssignedUser {
  name: string;
  avatar: string;
  role: string;
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  priority: ActivityPriority;
  status: ActivityStatus;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  durationMinutes: number;
  accountName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  opportunityTitle?: string;
  assignedTo: ActivityAssignedUser;
  location: string;
  meetingLink?: string;
  description: string;
  outcomeNotes?: string;
  completedAt?: string;
  tags: string[];
}

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'ACT-101',
    title: 'Demo Técnica y Alcance de Módulo IA',
    type: 'meeting',
    priority: 'alta',
    status: 'pendiente',
    dueDate: '2026-10-17',
    dueTime: '11:30',
    durationMinutes: 45,
    accountName: 'InnovaTech Soluciones',
    contactName: 'Carlos Mendoza',
    contactEmail: 'carlos.mendoza@innovatech.com',
    contactPhone: '+52 55 4123 8901',
    opportunityTitle: 'Expansión de Licencias Enterprise + Módulo IA',
    assignedTo: {
      name: 'Ana Gómez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: 'Directora Comercial',
    },
    location: 'Google Meet',
    meetingLink: 'https://meet.google.com/kat-demo-tech',
    description: 'Presentar demo interactiva sobre las capacidades del módulo predictivo para el equipo técnico de InnovaTech.',
    tags: ['Demo', 'Enterprise', 'IA'],
  },
  {
    id: 'ACT-102',
    title: 'Llamada de seguimiento a propuesta económica',
    type: 'call',
    priority: 'alta',
    status: 'pendiente',
    dueDate: '2026-10-17',
    dueTime: '15:00',
    durationMinutes: 20,
    accountName: 'Grupo Salinas & Asociados',
    contactName: 'Mariana Silva',
    contactEmail: 'mariana.silva@salinascorp.mx',
    contactPhone: '+52 55 9876 5432',
    opportunityTitle: 'Suite Integral de Automatización B2B',
    assignedTo: {
      name: 'Mateo Rossi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Senior Sales Rep',
    },
    location: 'Llamada Telefónica',
    description: 'Confirmar si la junta directiva revisó la propuesta con el descuento escalonado por pago anual.',
    tags: ['Negociación', 'Finanzas'],
  },
  {
    id: 'ACT-103',
    title: 'Ajuste de cláusula de confidencialidad y SLA',
    type: 'task',
    priority: 'media',
    status: 'en_progreso',
    dueDate: '2026-10-17',
    dueTime: '17:00',
    durationMinutes: 60,
    accountName: 'BioSalud Farmacéutica',
    contactName: 'Elena Morales',
    contactEmail: 'elena.morales@biosalud.com.mx',
    contactPhone: '+52 33 2211 4455',
    opportunityTitle: 'Renovación y Expansión Cloud Analytics',
    assignedTo: {
      name: 'Ana Gómez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: 'Directora Comercial',
    },
    location: 'Oficina Katapult / Legal',
    description: 'Coordinar con el abogado de la empresa la adecuación de la cláusula de soporte 24/7 exigida por auditoría farmacéutica.',
    tags: ['Legal', 'SLA', 'Contrato'],
  },
  {
    id: 'ACT-104',
    title: 'Revisión y firma de contrato de consultoría',
    type: 'meeting',
    priority: 'alta',
    status: 'pendiente',
    dueDate: '2026-10-18',
    dueTime: '10:00',
    durationMinutes: 60,
    accountName: 'Logística Avanzada del Norte',
    contactName: 'Roberto Gómez',
    contactEmail: 'roberto.gomez@logistica-norte.com',
    contactPhone: '+52 81 3344 5566',
    opportunityTitle: 'Consultoría Estratégica en Supply Chain 4.0',
    assignedTo: {
      name: 'David Benítez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      role: 'Solutions Architect',
    },
    location: 'Oficinas del Cliente (Monterrey)',
    description: 'Reunión presencial para la firma del acuerdo marco y definición del kickoff del proyecto.',
    tags: ['Firma', 'Kickoff', 'Presencial'],
  },
  {
    id: 'ACT-105',
    title: 'Enviar comparativa de planes de inversión privada',
    type: 'email',
    priority: 'media',
    status: 'pendiente',
    dueDate: '2026-10-18',
    dueTime: '12:30',
    durationMinutes: 15,
    accountName: 'Carlos Eduardo Ramírez',
    contactName: 'Carlos Eduardo Ramírez',
    contactEmail: 'carlos.ramirez@inversiones-privadas.com',
    contactPhone: '+52 55 1290 8822',
    opportunityTitle: 'Asesoría de Portafolio e Inversión VIP',
    assignedTo: {
      name: 'Sofía Castro',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      role: 'Private Wealth Advisor',
    },
    location: 'Correo Katapult Mail',
    description: 'Mandar dossier en PDF con los rendimientos esperados del fondo B2C y desglose de comisiones preferenciales.',
    tags: ['Particular', 'Portafolio'],
  },
  {
    id: 'ACT-106',
    title: 'Presentación formal de propuesta comercial Omnicanal',
    type: 'proposal',
    priority: 'alta',
    status: 'pendiente',
    dueDate: '2026-10-20',
    dueTime: '16:00',
    durationMinutes: 50,
    accountName: 'UrbanStyle Retail',
    contactName: 'Javier Torres',
    contactEmail: 'jtorres@urbanstyle.mx',
    contactPhone: '+52 55 7788 9900',
    opportunityTitle: 'Transformación Omnicanal y E-commerce Retail',
    assignedTo: {
      name: 'Ana Gómez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: 'Directora Comercial',
    },
    location: 'Zoom Video',
    meetingLink: 'https://zoom.us/j/9981273948',
    description: 'Presentación con el equipo de Marketing y Dirección General de UrbanStyle para 12 sucursales integradas.',
    tags: ['Retail', 'Propuesta', 'Omnicanal'],
  },
  {
    id: 'ACT-107',
    title: 'Auditoría y revisión trimestral de servicio de telemetría',
    type: 'review',
    priority: 'baja',
    status: 'pendiente',
    dueDate: '2026-10-22',
    dueTime: '11:00',
    durationMinutes: 40,
    accountName: 'AgroExport del Valle',
    contactName: 'Ing. Fernando Ruiz',
    contactEmail: 'fernando.ruiz@agroexport.com.mx',
    contactPhone: '+52 66 7712 3456',
    opportunityTitle: 'Renovación de Telemetría Agrícola',
    assignedTo: {
      name: 'David Benítez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      role: 'Solutions Architect',
    },
    location: 'Google Meet',
    meetingLink: 'https://meet.google.com/agro-review-q4',
    description: 'Revisar reporte de telemetría y sensores en invernaderos del último trimestre para renovar el SLA anual.',
    tags: ['QBR', 'Retención', 'Agro'],
  },
  {
    id: 'ACT-108',
    title: 'Llamada de contacto en frío / Prospección inicial',
    type: 'call',
    priority: 'media',
    status: 'pendiente',
    dueDate: '2026-10-15', // Vencida
    dueTime: '10:00',
    durationMinutes: 15,
    accountName: 'Alimentos La Pradera',
    contactName: 'Guillermo Ochoa',
    contactEmail: 'gochoa@lapradera.com.mx',
    contactPhone: '+52 44 2233 4455',
    assignedTo: {
      name: 'Mateo Rossi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Senior Sales Rep',
    },
    location: 'Llamada Telefónica',
    description: 'Validar requerimientos del departamento de compras para el módulo de facturación masiva.',
    tags: ['Prospección', 'Vencida'],
  },
  {
    id: 'ACT-109',
    title: 'Sesión de onboarding y capacitación a usuarios clave',
    type: 'meeting',
    priority: 'media',
    status: 'completada',
    dueDate: '2026-10-16',
    dueTime: '14:00',
    durationMinutes: 60,
    accountName: 'Finanzas & Capital SA',
    contactName: 'Lic. Claudia Paredes',
    contactEmail: 'cparedes@finanzascapital.com',
    contactPhone: '+52 55 6677 8899',
    assignedTo: {
      name: 'Sofía Castro',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      role: 'Customer Success',
    },
    location: 'Google Meet',
    meetingLink: 'https://meet.google.com/finanzas-onboarding',
    description: 'Capacitación al equipo de analistas de crédito en el uso del portal web Katapult.',
    outcomeNotes: 'Sesión muy exitosa. 8 usuarios capacitados y con acceso activo. Se enviaron las grabaciones.',
    completedAt: '2026-10-16T15:05:00Z',
    tags: ['Onboarding', 'Customer Success'],
  },
  {
    id: 'ACT-110',
    title: 'Envío de cotización final con desglose de IVA y retenciones',
    type: 'email',
    priority: 'alta',
    status: 'completada',
    dueDate: '2026-10-16',
    dueTime: '17:30',
    durationMinutes: 20,
    accountName: 'Dra. Sofía Mendoza',
    contactName: 'Dra. Sofía Mendoza',
    contactEmail: 'sofia.mendoza@clinicasanrafael.mx',
    contactPhone: '+52 55 3344 1122',
    opportunityTitle: 'Plan Integral de Marketing Médico & Agendamiento',
    assignedTo: {
      name: 'Ana Gómez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: 'Directora Comercial',
    },
    location: 'Correo Electrónico',
    description: 'Enviar la cotización revisada aceptando el plan trimestral anticipado con 5% de descuento.',
    outcomeNotes: 'Cotización enviada y recibida confirmación de lectura. La clienta solicitó llamada para firma el lunes.',
    completedAt: '2026-10-16T17:42:00Z',
    tags: ['Cotización', 'Particular'],
  },
];

export const ACTIVITY_TYPE_CONFIG: Record<
  ActivityType,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  meeting: {
    label: 'Reunión / Demo',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: 'Video',
  },
  call: {
    label: 'Llamada telefónica',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: 'PhoneCall',
  },
  task: {
    label: 'Tarea operativa',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: 'CheckSquare',
  },
  email: {
    label: 'Envío de correo',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: 'Mail',
  },
  proposal: {
    label: 'Presentación Propuesta',
    bg: 'bg-rose-50',
    text: 'text-[#E11D48]',
    border: 'border-rose-200',
    icon: 'Presentation',
  },
  review: {
    label: 'Revisión técnica / SLA',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: 'FileCheck',
  },
};

export const PRIORITY_CONFIG: Record<
  ActivityPriority,
  { label: string; badge: string; dot: string }
> = {
  alta: {
    label: 'Alta',
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
  media: {
    label: 'Media',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  baja: {
    label: 'Baja',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export function generateMeetLink(prefix = 'kat'): string {
  const segment1 = Math.random().toString(36).substring(2, 5);
  const segment2 = Math.random().toString(36).substring(2, 6);
  return `https://meet.google.com/${prefix}-${segment1}-${segment2}`;
}

export function generateGoogleCalendarUrl(activity: {
  title: string;
  dueDate: string;
  dueTime: string;
  durationMinutes: number;
  description: string;
  location: string;
  meetingLink?: string;
  contactEmail?: string;
  contactName?: string;
  accountName?: string;
}): string {
  const [year, month, day] = activity.dueDate.split('-');
  const [hour, minute] = activity.dueTime.split(':');
  const startDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute)
  );
  const endDate = new Date(startDate.getTime() + activity.durationMinutes * 60000);

  const formatGCalDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  // Generar o usar el enlace directo de Google Meet
  const meetLink = activity.meetingLink || generateMeetLink();

  const detailsList = [
    `🎥 Enlace de Google Meet: ${meetLink}`,
    activity.contactName ? `👤 Contacto: ${activity.contactName}` : '',
    activity.accountName ? `🏢 Cuenta: ${activity.accountName}` : '',
    activity.description ? `\n📝 Objetivos de la reunión:\n${activity.description}` : '',
    `\n---\nAgendado automáticamente desde Katapult Marketing Studio ERP`
  ].filter(Boolean);

  const datesParam = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[Katapult] ${activity.title}`,
    dates: datesParam,
    details: detailsList.join('\n'),
    location: meetLink,
  });

  if (activity.contactEmail) {
    params.set('add', activity.contactEmail);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadActivityIcs(activity: {
  title: string;
  dueDate: string;
  dueTime: string;
  durationMinutes: number;
  description: string;
  location: string;
  meetingLink?: string;
  contactEmail?: string;
  contactName?: string;
  accountName?: string;
}) {
  const [year, month, day] = activity.dueDate.split('-');
  const [hour, minute] = activity.dueTime.split(':');
  const startDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute)
  );
  const endDate = new Date(startDate.getTime() + activity.durationMinutes * 60000);

  const formatIcs = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const meetLink = activity.meetingLink || generateMeetLink();

  const icsDescription = [
    `Enlace de Google Meet: ${meetLink}`,
    activity.contactName ? `Contacto: ${activity.contactName}` : '',
    activity.accountName ? `Cuenta: ${activity.accountName}` : '',
    activity.description ? `Notas: ${activity.description}` : '',
  ].filter(Boolean).join('\\n');

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Katapult Marketing Studio//CRM ERP//ES
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:[Katapult] ${activity.title}
DESCRIPTION:${icsDescription.replace(/\n/g, '\\n')}
LOCATION:${meetLink}
DTSTART:${formatIcs(startDate)}
DTEND:${formatIcs(endDate)}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `katapult-cita-${activity.dueDate}-${activity.dueTime.replace(':', '')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
