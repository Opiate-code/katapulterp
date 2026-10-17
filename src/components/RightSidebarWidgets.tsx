import React from 'react';
import { Phone, Users, Monitor, Award, ArrowRight } from 'lucide-react';
import { UPCOMING_ACTIVITIES, RECENT_CONTACTS, ActivityItem, RecentContactItem } from '../data/crmData';

const activityIconMap: Record<ActivityItem['type'], { icon: React.FC<{ className?: string }>; bg: string; text: string }> = {
  call: { icon: Phone, bg: 'bg-blue-50', text: 'text-blue-600' },
  meeting: { icon: Users, bg: 'bg-purple-50', text: 'text-purple-600' },
  demo: { icon: Monitor, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  closing: { icon: Award, bg: 'bg-amber-50', text: 'text-amber-600' }
};

export const RightSidebarWidgets: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Próximas actividades widget */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Próximas actividades</h3>
            <p className="text-[11px] text-slate-400">Hoy, 17 de Octubre</p>
          </div>
          <button className="text-xs font-semibold text-[#E11D48] hover:text-[#BE123C] flex items-center gap-1 cursor-pointer">
            <span>Ver todas</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {UPCOMING_ACTIVITIES.map((act) => {
            const config = activityIconMap[act.type] || activityIconMap.call;
            const Icon = config.icon;

            return (
              <div
                key={act.id}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <div className="shrink-0 text-center w-12 py-1 px-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200/70 transition-colors">
                  <span className="text-[11px] font-bold text-slate-700 block">{act.time}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-[#E11D48] transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{act.subtitle}</p>
                </div>

                <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${config.bg} ${config.text}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contactos recientes widget */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Contactos recientes</h3>
            <p className="text-[11px] text-slate-400">Últimas interacciones</p>
          </div>
          <button className="text-xs font-semibold text-[#E11D48] hover:text-[#BE123C] flex items-center gap-1 cursor-pointer">
            <span>Ver todos</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {RECENT_CONTACTS.map((contact: RecentContactItem) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0 group-hover:ring-[#E11D48] transition-all"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-[#E11D48] transition-colors">
                    {contact.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{contact.companyRole}</p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 shrink-0 font-medium pl-2">
                {contact.timeAgo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
