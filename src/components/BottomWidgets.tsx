import React from 'react';
import {
  UserPlus,
  TrendingUp,
  CheckCircle2,
  MessageSquare,
  Building,
  Globe,
  Share2,
  Users2,
  Megaphone,
  CalendarDays,
  MoreVertical
} from 'lucide-react';
import { RECENT_AUDIT, LEAD_SOURCES, RecentAuditItem } from '../data/crmData';

const auditIconConfig: Record<RecentAuditItem['type'], { icon: React.FC<{ className?: string }>; bg: string; text: string }> = {
  contact: { icon: UserPlus, bg: 'bg-blue-50', text: 'text-blue-600' },
  opportunity: { icon: TrendingUp, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  task: { icon: CheckCircle2, bg: 'bg-purple-50', text: 'text-purple-600' },
  comment: { icon: MessageSquare, bg: 'bg-amber-50', text: 'text-amber-600' },
  account: { icon: Building, bg: 'bg-indigo-50', text: 'text-indigo-600' }
};

const sourceIcons: Record<string, React.FC<{ className?: string }>> = {
  'Sitio web': Globe,
  'Redes sociales': Share2,
  'Referidos': Users2,
  'Campañas pagadas': Megaphone,
  'Eventos': CalendarDays
};

export const BottomWidgets: React.FC = () => {
  // SVG Donut chart calculations
  const totalLeads = LEAD_SOURCES.reduce((acc, curr) => acc + curr.count, 0);
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Actividad reciente (Audit log) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Actividad reciente</h3>
            <p className="text-[11px] text-slate-400">Historial de acciones</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5">
          {RECENT_AUDIT.map((item) => {
            const config = auditIconConfig[item.type] || auditIconConfig.contact;
            const Icon = config.icon;

            return (
              <div key={item.id} className="flex items-start gap-3 group">
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${config.bg} ${config.text} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                  {item.timeAgo}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Resumen por fuente (Donut chart + breakdown) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Resumen por fuente</h3>
            <p className="text-[11px] text-slate-400">Distribución de leads activos</p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
            {totalLeads} total
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut graphic */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
              {LEAD_SOURCES.map((source, index) => {
                const strokeDasharray = `${(source.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += source.percentage;

                return (
                  <circle
                    key={index}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={source.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 hover:opacity-85"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl font-black text-slate-900 leading-none">428</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Leads</span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="flex-1 w-full space-y-2">
            {LEAD_SOURCES.map((source) => {
              const SourceIcon = sourceIcons[source.name] || Globe;
              return (
                <div key={source.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: source.color }}
                    ></span>
                    <span className="font-medium text-slate-700">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">{source.count}</span>
                    <span className="font-bold text-slate-800 w-8 text-right">
                      {source.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
