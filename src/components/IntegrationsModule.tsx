import React, { useState } from 'react';
import {
  Boxes,
  Globe,
  Share2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Terminal,
  Zap,
  ShieldCheck,
  Key,
  Layers,
  ArrowRight,
  Send,
  Sliders,
  Sparkles,
  Lock,
  Activity,
  MessageSquare,
  Target,
  Clock
} from 'lucide-react';
import {
  INITIAL_CHANNELS,
  INITIAL_WEBHOOK_LOGS,
  INITIAL_FIELD_MAPPINGS,
  IntegrationChannel,
  WebhookLog,
  FieldMappingItem,
} from '../data/integrationsData';

export const IntegrationsModule: React.FC = () => {
  const [channels, setChannels] = useState<IntegrationChannel[]>(INITIAL_CHANNELS);
  const [logs, setLogs] = useState<WebhookLog[]>(INITIAL_WEBHOOK_LOGS);
  const [fieldMappings] = useState<FieldMappingItem[]>(INITIAL_FIELD_MAPPINGS);
  const [activeTab, setActiveTab] = useState<'canales' | 'logs' | 'mapeo' | 'apikeys'>('canales');

  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Selected Channel for inspector/configuration
  const [selectedChannel, setSelectedChannel] = useState<IntegrationChannel | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testPayloadType, setTestPayloadType] = useState<'landing' | 'meta'>('landing');
  const [simulatedSuccessAlert, setSimulatedSuccessAlert] = useState<string | null>(null);

  // Copy to clipboard helper
  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Simulate incoming webhook event
  const handleSimulateWebhook = (type: 'landing' | 'meta') => {
    const isLanding = type === 'landing';
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLog: WebhookLog = isLanding
      ? {
          id: `LOG-${Math.floor(8900 + Math.random() * 900)}`,
          timestamp: timeStr,
          source: 'Landing Page Corporativa',
          event: 'lead.created',
          status: 'success',
          statusCode: 200,
          parsedLeadName: 'Lic. Mariana Villarreal (Grupo Inmobiliario)',
          payloadSnippet: JSON.stringify({
            name: 'Mariana Villarreal',
            email: 'm.villarreal@grupoinmuebles.mx',
            phone: '+52 55 7711 2233',
            service: 'Suite Katapult ERP',
            utm_source: 'landing_direct',
            utm_campaign: 'web_form_conversion',
          }),
          latencyMs: Math.floor(110 + Math.random() * 40),
        }
      : {
          id: `LOG-${Math.floor(8900 + Math.random() * 900)}`,
          timestamp: timeStr,
          source: 'Meta Instagram',
          event: 'lead.created',
          status: 'success',
          statusCode: 200,
          parsedLeadName: 'Carlos Santillán (Santillán Consulting)',
          payloadSnippet: JSON.stringify({
            leadgen_id: '9921827361',
            form_id: '44910283',
            full_name: 'Carlos Santillán',
            email: 'csantillan@consulting.com',
            phone: '+52 81 8899 0011',
            platform: 'instagram_reels',
          }),
          latencyMs: Math.floor(150 + Math.random() * 60),
        };

    setLogs([newLog, ...logs]);

    // Update channel count
    setChannels((prev) =>
      prev.map((c) => {
        if (isLanding && c.id === 'landing-page') {
          return { ...c, leadsCapturedMonth: c.leadsCapturedMonth + 1, lastSync: 'Hace unos segundos' };
        }
        if (!isLanding && c.id === 'meta-ads') {
          return { ...c, leadsCapturedMonth: c.leadsCapturedMonth + 1, lastSync: 'Hace unos segundos' };
        }
        return c;
      })
    );

    setSimulatedSuccessAlert(
      isLanding
        ? '¡Webhook de Landing Page procesado! Prospecto "Mariana Villarreal" registrado en el CRM.'
        : '¡Lead Ad de Meta recibido vía Graph API! Prospecto "Carlos Santillán" registrado en el CRM.'
    );

    setTimeout(() => setSimulatedSuccessAlert(null), 5000);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#F8FAFC] overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center font-bold shadow-xs">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                Módulo de Integración & Tráfico Web
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Backend Conectado
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Conexión del backend con la landing page corporativa y las APIs oficiales de Meta para Facebook e Instagram.
            </p>
          </div>
        </div>

        {/* Action Controls & Simulator Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleSimulateWebhook('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-blue-200 shadow-xs"
            title="Simular envío de formulario desde la Landing Page"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Simular Lead Landing</span>
          </button>

          <button
            onClick={() => handleSimulateWebhook('meta')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            title="Simular evento de Lead Ad entrante de Facebook/Instagram"
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
            <span>Simular Meta Lead Ad</span>
          </button>
        </div>
      </div>

      {/* Hero Strip: Key Integration Metrics */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Card 1 */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold mb-1">
              <span>Leads Captados Este Mes</span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">410</span>
              <span className="text-[10px] text-emerald-600 font-bold">+28% vs mes ant.</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center justify-between text-emerald-700 text-[11px] font-semibold mb-1">
              <span>Tasa de Entrega Webhook</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-emerald-900">99.8%</span>
              <span className="text-[10px] text-emerald-700 font-bold">0 errores</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
            <div className="flex items-center justify-between text-blue-700 text-[11px] font-semibold mb-1">
              <span>Meta Graph API</span>
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-blue-900">v20.0</span>
              <span className="text-[10px] text-blue-700 font-bold">4 formularios activos</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
            <div className="flex items-center justify-between text-purple-700 text-[11px] font-semibold mb-1">
              <span>Latencia Media</span>
              <Clock className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-purple-900">142 ms</span>
              <span className="text-[10px] text-purple-700 font-bold">tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification banner if simulation triggered */}
      {simulatedSuccessAlert && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 flex items-center justify-between text-xs text-emerald-900 font-bold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{simulatedSuccessAlert}</span>
          </div>
          <button
            onClick={() => setSimulatedSuccessAlert(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation Strip */}
      <div className="bg-white border-b border-slate-200 px-5 py-2 shrink-0 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('canales')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'canales'
              ? 'bg-[#0A1128] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Canales de Captación ({channels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Consola de Logs y Eventos en Vivo</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full ml-1">
            {logs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mapeo')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'mapeo'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Mapeo de Campos de Formulario</span>
        </button>

        <button
          onClick={() => setActiveTab('apikeys')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'apikeys'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Webhooks & Claves de API</span>
        </button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5 space-y-5">
        {/* TAB 1: CANALES DE CONEXIÓN */}
        {activeTab === 'canales' && (
          <div className="space-y-5 max-w-7xl mx-auto">
            {/* CANAL 1: LANDING PAGE CORPORATIVA */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">
                        Landing Page Corporativa
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● Conexión Activa
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sincronización en tiempo real desde formularios de contacto web y cotizadores hacia el CRM.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateWebhook('landing')}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <span>Enviar Test Payload</span>
                  </button>
                </div>
              </div>

              {/* Landing Technical Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {/* Endpoint Webhook */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Webhook Endpoint URL (POST para el formulario web)
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <code className="text-xs font-mono font-bold text-slate-800 truncate flex-1">
                      https://api.katapulterp.com/v1/webhooks/landing-page
                    </code>
                    <button
                      onClick={() =>
                        handleCopy(
                          'https://api.katapulterp.com/v1/webhooks/landing-page',
                          'landing-url'
                        )
                      }
                      className="px-2.5 py-1 text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedKey === 'landing-url' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar URL</span>
                        </>
                      )}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Acepta peticiones HTTP POST con cuerpo application/json y firma HMAC-SHA256 en cabecera `X-Katapult-Signature`.
                  </span>
                </div>

                {/* Secret Key */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Webhook Secret Key
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <code className="text-xs font-mono font-bold text-slate-800 truncate flex-1">
                      whsec_ktplt_99812480_live
                    </code>
                    <button
                      onClick={() =>
                        handleCopy('whsec_ktplt_99812480_live_38bf8c9', 'landing-sec')
                      }
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                      title="Copiar Secret"
                    >
                      {copiedKey === 'landing-sec' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    ✓ SSL TLS 1.3 Verificado • UTM Tracking Activo
                  </span>
                </div>
              </div>

              {/* Landing Stats Strip */}
              <div className="mt-4 p-3 bg-blue-50/40 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between text-xs text-blue-950 gap-2">
                <div className="flex items-center gap-3">
                  <span><strong>148 leads</strong> captados en el mes</span>
                  <span>•</span>
                  <span><strong>142 ms</strong> latencia media</span>
                  <span>•</span>
                  <span><strong>0 errores</strong> en los últimos 30 días</span>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  Último evento hace 2 minutos
                </span>
              </div>
            </div>

            {/* CANAL 2: META API OFICIAL (FACEBOOK & INSTAGRAM) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0 border border-rose-100">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">
                        Vinculación Oficial con Meta (Facebook & Instagram)
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● Graph API v20.0
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Descarga automática de leads desde formularios instantáneos (Meta Lead Ads) y retorno server-side con Conversions API (CAPI).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateWebhook('meta')}
                    className="px-3 py-1.5 text-xs font-bold bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Test Lead Ads</span>
                  </button>
                </div>
              </div>

              {/* Meta Account Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                {/* Meta Detail 1 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Página de Facebook
                  </span>
                  <div className="font-extrabold text-slate-800 text-xs mt-0.5 truncate">
                    Katapult Marketing Oficial
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">ID: 109283746192837</span>
                </div>

                {/* Meta Detail 2 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Cuenta de Instagram
                  </span>
                  <div className="font-extrabold text-slate-800 text-xs mt-0.5 truncate">
                    @katapult.studio
                  </div>
                  <span className="text-[10px] text-purple-600 font-bold">Perfil Comercial Conectado</span>
                </div>

                {/* Meta Detail 3 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Meta Pixel & CAPI
                  </span>
                  <div className="font-extrabold text-slate-800 text-xs mt-0.5 font-mono">
                    883920194829102
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">Server-Side Activo (100%)</span>
                </div>

                {/* Meta Detail 4 */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Formularios Instantáneos
                  </span>
                  <div className="font-extrabold text-slate-800 text-xs mt-0.5">
                    4 Formularios Activos
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Sincronización instantánea</span>
                </div>
              </div>

              {/* Meta Features Checkboxes */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Webhooks `leadgen` verificados
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Conversions API (CAPI) deduplicada
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Token de Sistema de Larga Duración
                  </span>
                </div>
                <span className="text-[11px] font-bold text-rose-700">
                  122 leads captados este mes
                </span>
              </div>
            </div>

            {/* SECONDARY CHANNELS: WHATSAPP CLOUD & GOOGLE ADS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* WhatsApp Cloud API */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        WhatsApp Cloud API (Meta)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Conectado
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Envío automático de alerta por WhatsApp al asesor comercial cuando entra un lead desde la Landing o Meta.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>86 notificaciones enviadas</span>
                  <span className="text-emerald-700 font-bold">Tiempo entrega: &lt; 2s</span>
                </div>
              </div>

              {/* Google Ads Conversions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Target className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Google Ads Offline Conversions
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      Conectado
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Retorno del GCLID y valor de los tratos ganados para optimizar el Smart Bidding de Google Ads.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>54 conversiones reportadas</span>
                  <span className="text-blue-700 font-bold">ROAS tracking activo</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONSOLA DE LOGS Y EVENTOS EN VIVO */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs max-w-7xl mx-auto">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Consola de Peticiones y Webhooks en Vivo (Audit Trail)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Registro detallado de payloads HTTP POST recibidos desde la landing page y las APIs de Meta
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">
                  {logs.length} eventos registrados
                </span>
                <button
                  onClick={() => setLogs(INITIAL_WEBHOOK_LOGS)}
                  className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Restablecer
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-4">Fecha / Hora</th>
                    <th className="py-2.5 px-4">Canal de Origen</th>
                    <th className="py-2.5 px-4">Evento</th>
                    <th className="py-2.5 px-4">Prospecto Detectado</th>
                    <th className="py-2.5 px-4 text-center">HTTP Status</th>
                    <th className="py-2.5 px-4 text-right">Latencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full ${
                            log.source === 'Landing Page Corporativa'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : log.source.includes('Meta')
                              ? 'bg-rose-50 text-[#E11D48] border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {log.source}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-700">
                        {log.event}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-xs">
                          {log.parsedLeadName || 'Evento de Píxel'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs mt-0.5">
                          {log.payloadSnippet}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800">
                          {log.statusCode} OK
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500 font-semibold">
                        {log.latencyMs} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MAPEO DE CAMPOS (FIELD MAPPING) */}
        {activeTab === 'mapeo' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs max-w-7xl mx-auto">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Mapeo de Campos de Formulario hacia Katapult CRM
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Configura cómo se traducen los campos recibidos en el webhook hacia Contactos, Cuentas y Oportunidades.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                10 campos vinculados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-4">Campo en Origen (Payload)</th>
                    <th className="py-2.5 px-4">Canal</th>
                    <th className="py-2.5 px-4">Módulo Destino</th>
                    <th className="py-2.5 px-4">Campo en Katapult ERP</th>
                    <th className="py-2.5 px-4 text-center">Obligatorio</th>
                    <th className="py-2.5 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fieldMappings.map((map, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {map.sourceField}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            map.sourceType === 'Landing Web'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-rose-50 text-[#E11D48]'
                          }`}
                        >
                          {map.sourceType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">
                        {map.targetModule}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        {map.targetField}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {map.isRequired ? (
                          <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            Sí
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400">Opcional</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-emerald-700 font-bold flex items-center justify-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mapeado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: API KEYS & WEBHOOKS SALIENTES */}
        {activeTab === 'apikeys' && (
          <div className="space-y-5 max-w-7xl mx-auto">
            {/* API Keys Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Credenciales API del Backend (Bearer Tokens)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Utiliza estas credenciales para autorizar llamadas seguras a los endpoints de la API de Katapult.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('ktplt_live_sec_89102839481920384756', 'api-key')}
                  className="px-3 py-1.5 bg-[#0A1128] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {copiedKey === 'api-key' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-rose-400" />
                      <span>Copiar Clave Maestra</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Producción (Read & Write)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Activa
                    </span>
                  </div>
                  <code className="text-xs font-mono text-slate-600 block">
                    ktplt_live_sec_89102839481920384756••••••••
                  </code>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Creada el 15 de Octubre de 2026 • Acceso total a /v1/contacts, /v1/accounts y /v1/opportunities
                  </span>
                </div>
              </div>
            </div>

            {/* Outgoing Webhooks Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Webhooks Salientes hacia Sistemas Externos
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Notifica a plataformas externas (Slack, ERP Contable, Email Marketing) cuando se gane un negocio o se cree una cuenta.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-xs">
                    Notificación de Tratos Ganados (Slack Sales Channel)
                  </div>
                  <code className="text-[11px] font-mono text-slate-500">
                    https://hooks.slack.com/services/T00/B00/KatapultDealsWon
                  </code>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Activo
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationsModule;
