import React from 'react';
import { Users, Building2, Target, DollarSign, ArrowUp } from 'lucide-react';
import { METRICS_DATA, MetricItem } from '../data/crmData';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Users,
  Building2,
  Target,
  DollarSign
};

export const MetricCards: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
      {METRICS_DATA.map((metric: MetricItem) => {
        const IconComponent = iconMap[metric.icon] || Users;

        return (
          <div
            key={metric.id}
            className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="mb-1.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${metric.color}`}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-slate-500 block truncate">
                {metric.title}
              </span>
              <div className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                {metric.value}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2 font-medium">
              <span className="text-emerald-600 font-bold flex items-center">
                <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                {metric.change}
              </span>
              <span>vs. mes anterior</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
