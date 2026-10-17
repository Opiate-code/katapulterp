import React, { useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { PIPELINE_STAGES, INITIAL_OPPORTUNITIES, OpportunityItem } from '../data/crmData';

const stageCounts: Record<string, { count: number; more: number }> = {
  prospeccion: { count: 8, more: 5 },
  calificacion: { count: 6, more: 3 },
  propuesta: { count: 5, more: 2 },
  negociacion: { count: 4, more: 1 },
  cerradas: { count: 3, more: 0 }
};

interface PipelineKanbanProps {
  onNavigate?: (nav: string) => void;
}

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({ onNavigate }) => {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(INITIAL_OPPORTUNITIES);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter((opp) => opp.stage === stageId).slice(0, 3);
  };

  const handleMoveStage = (oppId: string, nextStage: OpportunityItem['stage']) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === oppId ? { ...opp, stage: nextStage } : opp))
    );
    if (selectedOpp && selectedOpp.id === oppId) {
      setSelectedOpp((prev) => (prev ? { ...prev, stage: nextStage } : null));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col justify-between shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h2 className="text-xs font-bold text-slate-900">
          Pipeline de oportunidades
        </h2>

        <button
          onClick={() => onNavigate?.('oportunidades')}
          className="text-[11px] font-semibold text-slate-500 hover:text-[#E11D48] flex items-center gap-1 cursor-pointer transition-colors"
          title="Ver todas las oportunidades en el módulo"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#E11D48]" />
        </button>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-5 gap-2 mt-2">
        {PIPELINE_STAGES.map((stage) => {
          const stageOpps = getOpportunitiesByStage(stage.id);
          const meta = stageCounts[stage.id] || { count: stageOpps.length, more: 0 };

          return (
            <div
              key={stage.id}
              className="bg-slate-50/70 rounded-lg p-1.5 flex flex-col justify-between border border-slate-100/90"
            >
              {/* Column Title */}
              <div className="flex items-center justify-between mb-1.5 px-1 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${stage.dotColor}`}></span>
                  <span className="text-[10px] font-bold text-slate-800">{stage.name}</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400">
                  {meta.count}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-1.5">
                {stageOpps.map((opp) => (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOpp(opp)}
                    className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs hover:border-[#E11D48]/40 hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="text-[10px] font-bold text-slate-800 truncate group-hover:text-[#E11D48]">
                      {opp.company}
                    </div>

                    <div className="text-[10px] font-extrabold text-slate-900 mt-0.5">
                      {opp.amount}
                    </div>

                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-50 text-[9px] text-slate-400">
                      <span>{opp.timeAgo}</span>
                      <img
                        src={opp.ownerAvatar}
                        alt=""
                        className="w-4 h-4 rounded-full object-cover ring-1 ring-slate-100"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* More counter at bottom */}
              {meta.more > 0 ? (
                <button
                  onClick={() => onNavigate?.('oportunidades')}
                  className="w-full text-center pt-1.5 pb-0.5 text-[9px] font-bold text-slate-400 hover:text-[#E11D48] cursor-pointer transition-colors block"
                  title={`Ver las ${meta.more} oportunidades adicionales de ${stage.name} en el módulo`}
                >
                  + {meta.more} más
                </button>
              ) : (
                <div className="py-1"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Move Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-50 text-[#E11D48] rounded">
                  Oportunidad
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedOpp.company}</h3>
                <p className="text-lg font-black text-slate-900">{selectedOpp.amount}</p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] font-bold text-slate-700 mt-4 mb-2">Mover etapa:</p>
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {PIPELINE_STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleMoveStage(selectedOpp.id, s.id as OpportunityItem['stage'])}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${
                    selectedOpp.stage === s.id
                      ? 'bg-[#E11D48] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedOpp(null)}
              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
