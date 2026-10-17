import React from 'react';
import { Users, Building2, Target, DollarSign, ArrowUpRight } from 'lucide-react';
import { METRICS_DATA, MetricItem } from '../data/crmData';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Users,
  Building2,
  Target,
  DollarSign
};

export const MetricCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS_DATA.map((metric: MetricItem) => {
        const IconComponent = iconMap[metric.icon] || Users;

        return (
          <div
            key={metric.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">{metric.title}</span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${metric.color}`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {metric.value}
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                <span>+{metric.change}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 font-medium">
              vs. mes anterior
            </p>
          </div>
        );
      })}
    </div>
  );
};
