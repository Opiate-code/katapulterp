import React from 'react';
import {
  Phone,
  Calendar,
  Video,
  Globe,
  Share2,
  Users2,
  Megaphone,
  CalendarDays,
  MoreHorizontal
} from 'lucide-react';
import {
  UPCOMING_ACTIVITIES,
  RECENT_CONTACTS,
  LEAD_SOURCES,
  ActivityItem,
  RecentContactItem
} from '../data/crmData';

const activityIconMap: Record<string, { icon: React.FC<{ className?: string }>; bg: string; text: string }> = {
  call: { icon: Phone, bg: 'bg-blue-50', text: 'text-blue-500' },
  meeting: { icon: Calendar, bg: 'bg-blue-50', text: 'text-blue-500' },
  demo: { icon: Video, bg: 'bg-blue-50', text: 'text-blue-500' },
  closing: { icon: Phone, bg: 'bg-teal-50', text: 'text-teal-500' }
};

const leadIconMap: Record<string, React.FC<{ className?: string }>> = {
  'Sitio web': Globe,
  'Redes sociales': Share2,
  'Referidos': Users2,
  'Campañas pagadas': Megaphone,
  'Eventos': CalendarDays,
  'Otros': MoreHorizontal
};

export const RightSidebarWidgets: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full gap-3">
      {/* 1. Próximas actividades */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900">Próximas actividades</h3>
          <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
            Ver calendario
          </button>
        </div>

        <div className="space-y-2 my-auto">
          {UPCOMING_ACTIVITIES.map((act) => {
            const config = activityIconMap[act.type] || activityIconMap.call;
            const Icon = config.icon;

            return (
              <div key={act.id} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center ${config.bg} ${config.text}`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 w-9 shrink-0">
                  {act.time}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-bold text-slate-800 truncate leading-tight">
                    {act.title}
                  </h4>
                  <p className="text-[9px] text-slate-400 truncate leading-tight">
                    {act.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Contactos recientes */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900">Contactos recientes</h3>
          <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
            Ver todos
          </button>
        </div>

        <div className="space-y-1.5 my-auto">
          {RECENT_CONTACTS.slice(0, 5).map((contact: RecentContactItem) => (
            <div key={contact.id} className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-100"
                />
                <div className="min-w-0">
                  <h4 className="text-[10px] font-bold text-slate-800 truncate leading-tight">
                    {contact.name}
                  </h4>
                  <p className="text-[9px] text-slate-400 truncate leading-tight">
                    {contact.companyRole}
                  </p>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 shrink-0 font-medium">
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
          <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
            Ver todas
          </button>
        </div>

        <div className="space-y-1.5 my-auto">
          {LEAD_SOURCES.map((source) => {
            const Icon = leadIconMap[source.name] || Globe;

            return (
              <div key={source.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                    <Icon className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-medium text-slate-700 text-[9px]">{source.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold text-[9px]">{source.count}</span>
                  <span className="text-slate-400 text-[9px] w-6 text-right">
                    {source.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
