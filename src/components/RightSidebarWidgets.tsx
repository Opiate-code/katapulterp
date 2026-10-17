import React, { useState } from 'react';
import {
  Phone,
  Calendar,
  Video,
  Globe,
  Share2,
  Users2,
  Megaphone,
  CalendarDays,
  MoreHorizontal,
  X,
  Clock,
  Building2,
  User,
  MapPin,
  ExternalLink,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Mail
} from 'lucide-react';
import {
  UPCOMING_ACTIVITIES,
  RECENT_CONTACTS,
  LEAD_SOURCES,
  ActivityItem,
  RecentContactItem
} from '../data/crmData';

const activityIconMap: Record<string, { icon: React.FC<{ className?: string }>; bg: string; text: string; label: string }> = {
  call: { icon: Phone, bg: 'bg-blue-50', text: 'text-blue-500', label: 'Llamada' },
  meeting: { icon: Calendar, bg: 'bg-purple-50', text: 'text-purple-600', label: 'Reunión' },
  demo: { icon: Video, bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'Demostración' },
  closing: { icon: PhoneCall, bg: 'bg-rose-50', text: 'text-[#E11D48]', label: 'Llamada Cierre' }
};

const leadIconMap: Record<string, React.FC<{ className?: string }>> = {
  'Sitio web': Globe,
  'Redes sociales': Share2,
  'Referidos': Users2,
  'Campañas pagadas': Megaphone,
  'Eventos': CalendarDays,
  'Otros': MoreHorizontal
};

interface RightSidebarWidgetsProps {
  onNavigate?: (nav: string) => void;
}

export const RightSidebarWidgets: React.FC<RightSidebarWidgetsProps> = ({ onNavigate }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  // Helper for Google Calendar Link with Google Meet
  const getGoogleCalendarUrl = (act: ActivityItem) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const [hours, minutes] = act.time.split(':');
    const startStr = `${dateStr}T${hours}${minutes}00`;
    const dur = act.durationMinutes || 30;
    const endMinutes = Number(minutes) + dur;
    const endHour = Math.floor(endMinutes / 60) + Number(hours);
    const finalMinutes = endMinutes % 60;
    const endStr = `${dateStr}T${String(endHour).padStart(2, '0')}${String(finalMinutes).padStart(2, '0')}00`;

    const meetLink = act.meetingLink || `https://meet.google.com/kat-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`;
    const details = `🎥 Enlace de Google Meet: ${meetLink}\n\nContacto: ${act.subtitle}\n${act.notes ? `Notas: ${act.notes}\n\n` : ''}---\nAgendado desde Katapult Marketing Studio ERP`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `[Katapult] ${act.title}`,
      dates: `${startStr}/${endStr}`,
      details: details,
      location: meetLink,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div className="flex flex-col justify-between h-full gap-3 select-none">
      {/* 1. Próximas actividades (AHORA INTERACTIVAS) */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-slate-900">Próximas actividades</h3>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-[#E11D48]">
              Hoy
            </span>
          </div>
          <button
            onClick={() => onNavigate?.('actividades')}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Ver calendario
          </button>
        </div>

        <div className="space-y-1.5 my-auto">
          {UPCOMING_ACTIVITIES.map((act) => {
            const config = activityIconMap[act.type] || activityIconMap.call;
            const Icon = config.icon;

            return (
              <div
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200/80 group"
                title="Haz clic para ver el detalle de la cita"
              >
                <div
                  className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center ${config.bg} ${config.text} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 w-9 shrink-0">
                  {act.time}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-bold text-slate-800 truncate leading-tight group-hover:text-[#E11D48] transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[9px] text-slate-400 truncate leading-tight">
                    {act.subtitle}
                  </p>
                </div>
                <span className="text-[9px] font-bold text-slate-300 group-hover:text-[#E11D48] transition-colors">
                  →
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Contactos recientes */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900">Contactos recientes</h3>
          <button
            onClick={() => onNavigate?.('contactos')}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Ver todos
          </button>
        </div>

        <div className="space-y-1.5 my-auto">
          {RECENT_CONTACTS.slice(0, 5).map((contact: RecentContactItem) => (
            <div
              key={contact.id}
              onClick={() => onNavigate?.('contactos')}
              className="flex items-center justify-between gap-1.5 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
              title={`Ver ficha de ${contact.name}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-100 group-hover:ring-[#E11D48] transition-all"
                />
                <div className="min-w-0">
                  <h4 className="text-[10px] font-bold text-slate-800 truncate leading-tight group-hover:text-[#E11D48] transition-colors">
                    {contact.name}
                  </h4>
                  <p className="text-[9px] text-slate-400 truncate leading-tight">
                    {contact.companyRole}
                  </p>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-medium shrink-0">
                {contact.timeAgo}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Fuentes de leads */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900">Fuentes de leads</h3>
          <button
            onClick={() => onNavigate?.('reportes')}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Detalles
          </button>
        </div>

        <div className="space-y-2 my-auto">
          {LEAD_SOURCES.slice(0, 4).map((source) => {
            const Icon = leadIconMap[source.name] || Globe;

            return (
              <div key={source.name} className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Icon className="w-3 h-3 text-slate-400" />
                    <span>{source.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    {source.percentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${source.color}`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: DETALLE DE LA CITA / ACTIVIDAD */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                      Cita Hoy a las {selectedActivity.time}
                    </span>
                    <span className="text-[10px] font-bold text-rose-400">
                      {activityIconMap[selectedActivity.type]?.label || 'Actividad'}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white leading-tight">
                    {selectedActivity.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3.5 text-xs">
              {/* Account & Contact Box */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Cuenta & Contacto
                  </span>
                  {selectedActivity.priority && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-100 text-red-700">
                      Prioridad {selectedActivity.priority}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#E11D48]" />
                      <span>{selectedActivity.accountName || selectedActivity.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{selectedActivity.contactName} ({selectedActivity.contactRole})</span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedActivity(null);
                      onNavigate?.('cuentas');
                    }}
                    className="text-[10px] font-bold text-[#E11D48] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span>Ficha</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Direct Contact links */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                  {selectedActivity.contactPhone && (
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${selectedActivity.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola, me comunico desde Katapult Marketing Studio sobre la reunión: ${selectedActivity.title}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold"
                        title="Enviar WhatsApp"
                      >
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${selectedActivity.contactPhone}`}
                        className="flex items-center gap-1 hover:text-blue-600 font-medium"
                      >
                        <Phone className="w-3 h-3 text-blue-500" />
                        <span>{selectedActivity.contactPhone}</span>
                      </a>
                    </div>
                  )}
                  {selectedActivity.contactEmail && (
                    <a
                      href={`mailto:${selectedActivity.contactEmail}`}
                      className="flex items-center gap-1 hover:text-blue-600 font-medium truncate"
                    >
                      <Mail className="w-3 h-3 text-purple-500" />
                      <span className="truncate">{selectedActivity.contactEmail}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Time, Duration & Platform */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-bold text-slate-400 block">HORARIO</span>
                  <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedActivity.time} ({selectedActivity.durationMinutes || 30} min)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-bold text-slate-400 block">LUGAR / VIRTUAL</span>
                  <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{selectedActivity.location || 'Online'}</span>
                  </div>
                </div>
              </div>

              {/* Virtual Meeting Link Button (if exists) */}
              {selectedActivity.meetingLink && (
                <a
                  href={selectedActivity.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>Unirse a la Videollamada (Google Meet / Zoom)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* Notes / Objetivos */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Objetivo de la Cita & Notas
                </span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed">
                  {selectedActivity.notes || selectedActivity.subtitle}
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <a
                href={getGoogleCalendarUrl(selectedActivity)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
                <span>Google Calendar</span>
              </a>

              <button
                onClick={() => {
                  setSelectedActivity(null);
                  onNavigate?.('actividades');
                }}
                className="px-3.5 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>Ver en Agenda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RightSidebarWidgets;
