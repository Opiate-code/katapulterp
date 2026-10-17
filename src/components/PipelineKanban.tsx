import React, { useState } from 'react';
import { Plus, MoreHorizontal, Clock } from 'lucide-react';
import { PIPELINE_STAGES, INITIAL_OPPORTUNITIES, OpportunityItem } from '../data/crmData';

interface PipelineKanbanProps {
  onAddOpportunity?: () => void;
}

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({ onAddOpportunity }) => {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(INITIAL_OPPORTUNITIES);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

  // Group opportunities by stage
  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter((opp) => opp.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    const total = opportunities
      .filter((opp) => opp.stage === stageId)
      .reduce((sum, opp) => sum + opp.rawAmount, 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(total);
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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Pipeline de oportunidades
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              {opportunities.length} activas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Arrastra o gestiona el progreso de tus tratos comerciales
          </p>
        </div>

        <button
          onClick={onAddOpportunity}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nueva oportunidad</span>
        </button>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 mt-4 overflow-x-auto pb-2">
        {PIPELINE_STAGES.map((stage) => {
          const stageOpps = getOpportunitiesByStage(stage.id);
          const stageTotal = getStageTotal(stage.id);

          return (
            <div
              key={stage.id}
              className="bg-slate-50/70 rounded-xl p-3 flex flex-col min-w-[210px] border border-slate-100"
            >
              {/* Column Title */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stage.dotColor}`}></span>
                  <span className="text-xs font-bold text-slate-800">{stage.name}</span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.2 rounded-md border border-slate-200">
                    {stageOpps.length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stage Amount Total */}
              <div className="text-[11px] font-semibold text-slate-400 mb-3 pl-4">
                Total: <span className="text-slate-700 font-bold">{stageTotal}</span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 flex-1">
                {stageOpps.map((opp) => (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOpp(opp)}
                    className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#E11D48]/40 transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors line-clamp-1">
                      {opp.company}
                    </div>

                    <div className="text-sm font-extrabold text-slate-900 mt-1">
                      {opp.amount}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span>{opp.timeAgo}</span>
                      </div>

                      <img
                        src={opp.ownerAvatar}
                        alt={opp.ownerName}
                        title={opp.ownerName}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    </div>
                  </div>
                ))}

                {stageOpps.length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-[11px]">
                    Sin oportunidades
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Opportunity Detail Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-50 text-[#E11D48] rounded-md">
                  Detalle de Oportunidad
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedOpp.company}</h3>
                <p className="text-2xl font-black text-slate-900 mt-1">{selectedOpp.amount}</p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="my-5 p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Responsable:</span>
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <img
                    src={selectedOpp.ownerAvatar}
                    alt=""
                    className="w-4 h-4 rounded-full"
                  />
                  {selectedOpp.ownerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Última actualización:</span>
                <span className="text-slate-800 font-semibold">{selectedOpp.timeAgo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Etapa actual:</span>
                <span className="capitalize font-bold text-[#E11D48]">{selectedOpp.stage}</span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-700 mb-2">Mover a otra etapa:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-6">
              {PIPELINE_STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleMoveStage(selectedOpp.id, s.id as OpportunityItem['stage'])}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center cursor-pointer transition-all ${
                    selectedOpp.stage === s.id
                      ? 'bg-[#E11D48] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedOpp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
