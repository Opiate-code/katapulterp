export interface WebhookLog {
  id: string;
  timestamp: string;
  source: 'Landing Page Corporativa' | 'Meta Facebook Ads' | 'Meta Instagram' | 'Google Ads' | 'WhatsApp Cloud';
  event: 'lead.created' | 'form.submitted' | 'pixel.pageview' | 'capi.conversion';
  status: 'success' | 'warning' | 'error';
  statusCode: number;
  payloadSnippet: string;
  parsedLeadName?: string;
  latencyMs: number;
}

export interface IntegrationChannel {
  id: string;
  name: string;
  category: 'Landing & Web' | 'Meta Social' | 'Google Ecosystem' | 'Mensajería Directa';
  description: string;
  icon: string;
  status: 'conectado' | 'en_espera' | 'desconectado' | 'sincronizando';
  leadsCapturedMonth: number;
  lastSync: string;
  apiEndpoint?: string;
  metaDetails?: {
    pageName: string;
    pageId: string;
    instagramAccount: string;
    pixelId: string;
    leadFormsCount: number;
    tokenExpiry: string;
  };
  landingDetails?: {
    domain: string;
    webhookUrl: string;
    secretKey: string;
    sslActive: boolean;
    utmTrackingEnabled: boolean;
  };
}

export interface FieldMappingItem {
  sourceField: string;
  sourceType: 'Landing Web' | 'Meta Lead Ads';
  targetModule: 'Contactos' | 'Oportunidades' | 'Cuentas';
  targetField: string;
  isRequired: boolean;
}

export const INITIAL_CHANNELS: IntegrationChannel[] = [
  {
    id: 'landing-page',
    name: 'Landing Page Corporativa',
    category: 'Landing & Web',
    description: 'Recepción directa de prospectos desde formularios web, páginas de destino de campañas y cotizadores en línea.',
    icon: 'Globe',
    status: 'conectado',
    leadsCapturedMonth: 148,
    lastSync: 'Hace 2 minutos',
    landingDetails: {
      domain: 'https://katapultmarketing.com/contacto',
      webhookUrl: 'https://api.katapulterp.com/v1/webhooks/landing-page',
      secretKey: 'whsec_ktplt_99812480_live_38bf8c9',
      sslActive: true,
      utmTrackingEnabled: true,
    },
  },
  {
    id: 'meta-ads',
    name: 'Meta API Oficial (Facebook & Instagram)',
    category: 'Meta Social',
    description: 'Sincronización bidireccional mediante Graph API v20.0 para formularios instantáneos (Lead Ads) y Meta Conversions API (CAPI).',
    icon: 'Share2',
    status: 'conectado',
    leadsCapturedMonth: 122,
    lastSync: 'Hace 4 minutos',
    metaDetails: {
      pageName: 'Katapult Marketing Oficial',
      pageId: '109283746192837',
      instagramAccount: '@katapult.studio (Empresarial)',
      pixelId: '883920194829102',
      leadFormsCount: 4,
      tokenExpiry: '2027-01-15 (Token de Sistema de Larga Duración)',
    },
  },
  {
    id: 'whatsapp-cloud',
    name: 'WhatsApp Cloud API (Meta)',
    category: 'Mensajería Directa',
    description: 'Alertas inmediatas en tiempo real a los ejecutivos comerciales ante la entrada de un nuevo prospecto.',
    icon: 'MessageSquare',
    status: 'conectado',
    leadsCapturedMonth: 86,
    lastSync: 'Hace 6 minutos',
  },
  {
    id: 'google-ads',
    name: 'Google Ads & Conversions API',
    category: 'Google Ecosystem',
    description: 'Retroalimentación de conversiones offline calificadas y sincronización de leads de extensiones de formulario.',
    icon: 'Target',
    status: 'conectado',
    leadsCapturedMonth: 54,
    lastSync: 'Hace 12 minutos',
  },
];

export const INITIAL_WEBHOOK_LOGS: WebhookLog[] = [
  {
    id: 'LOG-8891',
    timestamp: '2026-10-17 10:32:15',
    source: 'Landing Page Corporativa',
    event: 'lead.created',
    status: 'success',
    statusCode: 200,
    parsedLeadName: 'Ing. Rodrigo Valenzuela (TechLogistics)',
    payloadSnippet: '{"name":"Rodrigo Valenzuela","email":"r.valenzuela@techlog.mx","phone":"+52 55 9812 3456","service":"Módulo ERP Enterprise","utm_source":"google_search","utm_campaign":"q4_launch"}',
    latencyMs: 142,
  },
  {
    id: 'LOG-8890',
    timestamp: '2026-10-17 10:24:40',
    source: 'Meta Facebook Ads',
    event: 'lead.created',
    status: 'success',
    statusCode: 200,
    parsedLeadName: 'Lic. Paulina Durán (Grupo Hotelero del Sol)',
    payloadSnippet: '{"leadgen_id":"7761529102","form_id":"44910283","full_name":"Paulina Durán","email":"pduran@hotelesdelsol.com","phone":"+52 998 123 4567","platform":"facebook"}',
    latencyMs: 188,
  },
  {
    id: 'LOG-8889',
    timestamp: '2026-10-17 10:15:02',
    source: 'Meta Instagram',
    event: 'lead.created',
    status: 'success',
    statusCode: 200,
    parsedLeadName: 'Dr. Alejandro Soto (Clínica Integral)',
    payloadSnippet: '{"leadgen_id":"7761528994","form_id":"44910283","full_name":"Alejandro Soto","email":"asoto@clinicaintegral.mx","phone":"+52 33 4455 6677","platform":"instagram"}',
    latencyMs: 210,
  },
  {
    id: 'LOG-8888',
    timestamp: '2026-10-17 09:58:19',
    source: 'Landing Page Corporativa',
    event: 'capi.conversion',
    status: 'success',
    statusCode: 200,
    payloadSnippet: '{"event_name":"LeadQualified","user_data":{"em":"f8a9...","ph":"33c2..."},"custom_data":{"currency":"MXN","value":180000}}',
    latencyMs: 95,
  },
  {
    id: 'LOG-8887',
    timestamp: '2026-10-17 09:41:30',
    source: 'Google Ads',
    event: 'form.submitted',
    status: 'success',
    statusCode: 200,
    parsedLeadName: 'Gabriela Meza (Moda & Accesorios)',
    payloadSnippet: '{"gclid":"CjwKCAjw...","user_column_data":{"NAME":"Gabriela Meza","EMAIL":"gaby@modameza.com","PHONE":"+52 55 1122 3344"}}',
    latencyMs: 165,
  },
];

export const INITIAL_FIELD_MAPPINGS: FieldMappingItem[] = [
  {
    sourceField: 'full_name / nombre_completo',
    sourceType: 'Landing Web',
    targetModule: 'Contactos',
    targetField: 'Nombre Completo',
    isRequired: true,
  },
  {
    sourceField: 'email / correo_electronico',
    sourceType: 'Landing Web',
    targetModule: 'Contactos',
    targetField: 'Correo Electrónico',
    isRequired: true,
  },
  {
    sourceField: 'phone_number / telefono',
    sourceType: 'Landing Web',
    targetModule: 'Contactos',
    targetField: 'Teléfono Principal',
    isRequired: true,
  },
  {
    sourceField: 'company_name / empresa',
    sourceType: 'Landing Web',
    targetModule: 'Cuentas',
    targetField: 'Nombre de Cuenta (B2B)',
    isRequired: false,
  },
  {
    sourceField: 'service_interest / interes',
    sourceType: 'Landing Web',
    targetModule: 'Oportunidades',
    targetField: 'Título de Oportunidad',
    isRequired: true,
  },
  {
    sourceField: 'utm_source & utm_campaign',
    sourceType: 'Landing Web',
    targetModule: 'Contactos',
    targetField: 'Etiquetas de Canal y Campaña',
    isRequired: false,
  },
  {
    sourceField: 'fb_leadgen_full_name',
    sourceType: 'Meta Lead Ads',
    targetModule: 'Contactos',
    targetField: 'Nombre Completo',
    isRequired: true,
  },
  {
    sourceField: 'fb_leadgen_email',
    sourceType: 'Meta Lead Ads',
    targetModule: 'Contactos',
    targetField: 'Correo Electrónico',
    isRequired: true,
  },
  {
    sourceField: 'fb_leadgen_phone',
    sourceType: 'Meta Lead Ads',
    targetModule: 'Contactos',
    targetField: 'Teléfono Principal',
    isRequired: true,
  },
  {
    sourceField: 'fb_ad_name / campaign_id',
    sourceType: 'Meta Lead Ads',
    targetModule: 'Oportunidades',
    targetField: 'Origen de la Oportunidad',
    isRequired: false,
  },
];
