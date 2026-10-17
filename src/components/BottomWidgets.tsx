import React from 'react';
import {
  UserPlus,
  TrendingUp,
  CheckCircle2,
  MessageSquare,
  Building
} from 'lucide-react';
import { RECENT_AUDIT, LEAD_SOURCES, RecentAuditItem } from '../data/crmData';

const auditIconConfig: Record<RecentAuditItem['type'], { icon: React.FC<{ className?: string }>; bg: string; text: string }> = {
  contact: { icon: UserPlus, bg: 'bg-blue-50', text: 'text-blue-600' },
  opportunity: { icon: TrendingUp, bg: 'bg-purple-50', text: 'text-purple-600' },
  task: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  comment: { icon: MessageSquare, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  account: { icon: Building, bg: 'bg-violet-50', text: 'text-violet-600' }
};

interface BottomWidgetsProps {
  onNavigate?: (nav: string) => void;
}

export const BottomWidgets: React.FC<BottomWidgetsProps> = ({ onNavigate }) => {
  // SVG Donut chart calculations
  const size = 120;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="grid grid-cols-2 gap-3 shrink-0">
      {/* 1. Actividad reciente */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-1">
          <h3 className="text-xs font-bold text-slate-900">Actividad reciente</h3>
          <button
            onClick={() => onNavigate?.('actividades')}
            className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
          >
            Ver todas
          </button>
        </div>

        <div className="space-y-1.5">
          {RECENT_AUDIT.slice(0, 5).map((item) => {
            const config = auditIconConfig[item.type] || auditIconConfig.contact;
            const Icon = config.icon;

            return (
              <div key={item.id} className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center ${config.bg} ${config.text}`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate leading-tight">
                    {item.subtitle}
                  </p>
                </div>
                <span className="text-[9px] text-slate-400 shrink-0 font-medium">
                  {item.timeAgo}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Resumen por fuente */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-1">
          <h3 className="text-xs font-bold text-slate-900">Resumen por fuente</h3>
        </div>

        <div className="flex items-center justify-around gap-2 my-auto">
          {/* Donut graphic */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
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
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-sm font-black text-slate-900 leading-none">428</span>
              <span className="text-[9px] text-slate-400 font-medium mt-0.5">contactos</span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="space-y-1 text-[10px] shrink-0">
            {LEAD_SOURCES.map((source) => (
              <div key={source.name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: source.color }}
                  ></span>
                  <span className="text-slate-600 font-medium text-[9px]">{source.name}</span>
                </div>
                <span className="font-bold text-slate-800 text-[9px] w-6 text-right">
                  {source.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
