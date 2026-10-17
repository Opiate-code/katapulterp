export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Director Comercial' | 'Ejecutivo Comercial' | 'Customer Success' | 'Finanzas';
  status: 'activo' | 'inactivo';
  avatar: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
}

export interface RolePermission {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
}

export interface PipelineStageConfig {
  id: string;
  name: string;
  probability: number;
  color: string;
  badgeBg: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  category: 'industria' | 'servicio' | 'etiqueta';
  itemCount: number;
}

export interface OperationalRules {
  leadAssignmentMethod: 'round_robin' | 'territory' | 'manual';
  dealAutoArchiveDays: number;
  activityOverdueAlerts: boolean;
  requireTwoFactor: boolean;
  allowDataExport: boolean;
  defaultCurrency: 'MXN' | 'USD';
  timezone: string;
  companyName: string;
  primaryColor: string;
}

export const INITIAL_USERS: SystemUser[] = [
  {
    id: 'USR-001',
    name: 'Ana Gómez',
    email: 'ana.gomez@katapult.com',
    role: 'Super Admin',
    status: 'activo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    lastLogin: 'Hace 5 minutos (Sesión actual)',
    twoFactorEnabled: true,
  },
  {
    id: 'USR-002',
    name: 'Mateo Rossi',
    email: 'mateo.rossi@katapult.com',
    role: 'Ejecutivo Comercial',
    status: 'activo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    lastLogin: 'Hoy a las 09:14 AM',
    twoFactorEnabled: true,
  },
  {
    id: 'USR-003',
    name: 'David Benítez',
    email: 'david.benitez@katapult.com',
    role: 'Director Comercial',
    status: 'activo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    lastLogin: 'Ayer a las 06:30 PM',
    twoFactorEnabled: true,
  },
  {
    id: 'USR-004',
    name: 'Sofía Castro',
    email: 'sofia.castro@katapult.com',
    role: 'Customer Success',
    status: 'activo',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    lastLogin: 'Hoy a las 08:45 AM',
    twoFactorEnabled: false,
  },
  {
    id: 'USR-005',
    name: 'Lic. Roberto Morales',
    email: 'roberto.morales@katapult.com',
    role: 'Finanzas',
    status: 'activo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    lastLogin: '14 de Octubre de 2026',
    twoFactorEnabled: true,
  },
];

export const INITIAL_ROLE_PERMISSIONS: Record<string, RolePermission[]> = {
  'Super Admin': [
    { module: 'Contactos', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    { module: 'Cuentas', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    { module: 'Oportunidades', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    { module: 'Actividades', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    { module: 'Reportes Gerenciales', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    { module: 'Integraciones & APIs', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    { module: 'Configuración ERP', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
  ],
  'Director Comercial': [
    { module: 'Contactos', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    { module: 'Cuentas', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: true },
    { module: 'Oportunidades', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    { module: 'Actividades', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    { module: 'Reportes Gerenciales', canView: true, canCreate: false, canEdit: false, canDelete: false, canExport: true },
    { module: 'Integraciones & APIs', canView: true, canCreate: false, canEdit: false, canDelete: false, canExport: false },
    { module: 'Configuración ERP', canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
  ],
  'Ejecutivo Comercial': [
    { module: 'Contactos', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: false },
    { module: 'Cuentas', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: false },
    { module: 'Oportunidades', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: false },
    { module: 'Actividades', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: false },
    { module: 'Reportes Gerenciales', canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
    { module: 'Integraciones & APIs', canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
    { module: 'Configuración ERP', canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
  ],
  'Customer Success': [
    { module: 'Contactos', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: false },
    { module: 'Cuentas', canView: true, canCreate: false, canEdit: true, canDelete: false, canExport: false },
    { module: 'Oportunidades', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: false },
    { module: 'Actividades', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: false },
    { module: 'Reportes Gerenciales', canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
    { module: 'Integraciones & APIs', canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
    { module: 'Configuración ERP', canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
  ],
};

export const INITIAL_PIPELINE_STAGES: PipelineStageConfig[] = [
  { id: 'stg-1', name: 'Prospección', probability: 15, color: '#3B82F6', badgeBg: 'bg-blue-50 text-blue-700' },
  { id: 'stg-2', name: 'Calificación (SQL)', probability: 35, color: '#8B5CF6', badgeBg: 'bg-purple-50 text-purple-700' },
  { id: 'stg-3', name: 'Presentación Propuesta', probability: 60, color: '#F59E0B', badgeBg: 'bg-amber-50 text-amber-700' },
  { id: 'stg-4', name: 'Negociación / Legal', probability: 80, color: '#E11D48', badgeBg: 'bg-rose-50 text-[#E11D48]' },
  { id: 'stg-5', name: 'Cerrada Ganada', probability: 100, color: '#10B981', badgeBg: 'bg-emerald-50 text-emerald-700' },
];

export const INITIAL_CATALOGS: CatalogItem[] = [
  // Industrias
  { id: 'ind-1', name: 'Tecnología & Cloud SaaS', category: 'industria', itemCount: 12 },
  { id: 'ind-2', name: 'Servicios Financieros & Capital', category: 'industria', itemCount: 8 },
  { id: 'ind-3', name: 'Logística & Cadena de Suministro', category: 'industria', itemCount: 9 },
  { id: 'ind-4', name: 'Farmacéutica & Salud', category: 'industria', itemCount: 6 },
  { id: 'ind-5', name: 'Retail & Comercio Omnicanal', category: 'industria', itemCount: 11 },
  { id: 'ind-6', name: 'Agroindustria & Exportación', category: 'industria', itemCount: 5 },
  // Servicios
  { id: 'srv-1', name: 'Módulo Katapult ERP Enterprise', category: 'servicio', itemCount: 18 },
  { id: 'srv-2', name: 'Consultoría de Procesos & BI', category: 'servicio', itemCount: 14 },
  { id: 'srv-3', name: 'Soporte Continuo & SLA 24/7', category: 'servicio', itemCount: 22 },
  { id: 'srv-4', name: 'Automatización de Marketing & Leads', category: 'servicio', itemCount: 16 },
  { id: 'srv-5', name: 'Asesoría Patrimonial Particular VIP', category: 'servicio', itemCount: 7 },
  // Etiquetas
  { id: 'tag-1', name: 'Cliente VIP', category: 'etiqueta', itemCount: 8 },
  { id: 'tag-2', name: 'Alta Prioridad', category: 'etiqueta', itemCount: 15 },
  { id: 'tag-3', name: 'Venta Cruzada', category: 'etiqueta', itemCount: 12 },
  { id: 'tag-4', name: 'En Renovación Q4', category: 'etiqueta', itemCount: 9 },
  { id: 'tag-5', name: 'Cuenta Estratégica', category: 'etiqueta', itemCount: 6 },
];

export const INITIAL_OPERATIONAL_RULES: OperationalRules = {
  leadAssignmentMethod: 'round_robin',
  dealAutoArchiveDays: 90,
  activityOverdueAlerts: true,
  requireTwoFactor: true,
  allowDataExport: true,
  defaultCurrency: 'MXN',
  timezone: 'America/Mexico_City (GMT-6)',
  companyName: 'Katapult Marketing Studio',
  primaryColor: '#E11D48',
};
