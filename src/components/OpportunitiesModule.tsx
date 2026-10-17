import React, { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  Clock,
  User,
  Users,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List,
  Phone,
  Mail,
  X,
  Shuffle,
  ArrowUpRight,
  FileText,
  BadgePercent
} from 'lucide-react';
import {
  DetailedOpportunity,
  INITIAL_DETAILED_OPPORTUNITIES,
  STAGES_CONFIG,
  PipelineStageConfig
} from '../data/opportunitiesData';

interface OpportunitiesModuleProps {
  onNavigateToAccount?: (accountName: string) => void;
}

export const OpportunitiesModule: React.FC<OpportunitiesModuleProps> = ({ onNavigateToAccount }) => {
  const [opportunities, setOpportunities] = useState<DetailedOpportunity[]>(INITIAL_DETAILED_OPPORTUNITIES);
  const [selectedOpp, setSelectedOpp] = useState<DetailedOpportunity | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [dealTypeFilter, setDealTypeFilter] = useState<'all' | DetailedOpportunity['dealType']>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');

  // New Opportunity Modal
  const [isNewOppModalOpen, setIsNewOppModalOpen] = useState(false);
  const [newOppForm, setNewOppForm] = useState({
    title: '',
    company: 'Grupo Innovar',
    dealType: 'new_business' as DetailedOpportunity['dealType'],
    amount: '',
    rawAmount: 15000,
    stage: 'calificacion' as DetailedOpportunity['stage'],
    probability: 25,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ownerName: 'Ana Torres',
    contactPerson: '',
    serviceInterest: '',
    notes: ''
  });

  // Calculate Indicator KPIs
  const kpis = useMemo(() => {
    const activeOpps = opportunities.filter((o) => o.stage !== 'cerrada_perdida');
    const openOpps = opportunities.filter((o) => o.stage !== 'cerrada_ganada' && o.stage !== 'cerrada_perdida');
    const wonOpps = opportunities.filter((o) => o.stage === 'cerrada_ganada');

    // Total gross pipeline
    const pipelineGross = openOpps.reduce((sum, o) => sum + o.rawAmount, 0);

    // Weighted pipeline (Monto * Probabilidad)
    const pipelineWeighted = openOpps.reduce((sum, o) => sum + (o.rawAmount * o.probability) / 100, 0);

    // Won MTD revenue
    const wonRevenue = wonOpps.reduce((sum, o) => sum + o.rawAmount, 0);

    // Cross-selling / Upselling value in pipeline
    const expansionValue = opportunities
      .filter((o) => o.dealType === 'cross_selling' || o.dealType === 'upselling')
      .reduce((sum, o) => sum + o.rawAmount, 0);

    const formatCurrency = (val: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return {
      pipelineGross: formatCurrency(pipelineGross),
      pipelineWeighted: formatCurrency(pipelineWeighted),
      wonRevenue: formatCurrency(wonRevenue),
      expansionValue: formatCurrency(expansionValue),
      activeCount: openOpps.length,
      wonCount: wonOpps.length
    };
  }, [opportunities]);

  // Unique owners for filter
  const uniqueOwners = useMemo(() => {
    return Array.from(new Set(opportunities.map((o) => o.ownerName)));
  }, [opportunities]);

  // Filtered list
  const filteredOpps = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.serviceInterest.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = dealTypeFilter === 'all' || opp.dealType === dealTypeFilter;
      const matchesOwner = ownerFilter === 'all' || opp.ownerName === ownerFilter;
      const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;

      return matchesSearch && matchesType && matchesOwner && matchesStage;
    });
  }, [opportunities, searchQuery, dealTypeFilter, ownerFilter, stageFilter]);

  // Handle stage change
  const handleStageChange = (oppId: string, newStage: DetailedOpportunity['stage']) => {
    const stageConfig = STAGES_CONFIG.find((s) => s.id === newStage);
    const newProb = stageConfig ? stageConfig.defaultProbability : 50;

    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, stage: newStage, probability: newProb } : o))
    );

    if (selectedOpp && selectedOpp.id === oppId) {
      setSelectedOpp((prev) => (prev ? { ...prev, stage: newStage, probability: newProb } : null));
    }
  };

  // Handle Create Opportunity
  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOppForm.title || !newOppForm.company) return;

    const rawVal = parseFloat(newOppForm.amount.replace(/[^0-9.]/g, '')) || 10000;
    const formattedAmount = `$${rawVal.toLocaleString()} USD`;

    const newDeal: DetailedOpportunity = {
      id: `opp-${Date.now()}`,
      title: newOppForm.title,
      company: newOppForm.company,
      accountId: 'acc-custom',
      dealType: newOppForm.dealType,
      amount: formattedAmount,
      rawAmount: rawVal,
      probability: newOppForm.probability,
      expectedCloseDate: newOppForm.expectedCloseDate,
      ownerName: newOppForm.ownerName,
      ownerAvatar:
        newOppForm.ownerName === 'Carlos Méndez'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      stage: newOppForm.stage,
      contactPerson: newOppForm.contactPerson || 'Contacto Principal',
      contactRole: 'Responsable',
      contactPhone: '+52 55 0000 0000',
      contactEmail: 'contacto@cuenta.com',
      serviceInterest: newOppForm.serviceInterest || 'Módulo Comercial',
      nextActivity: 'Llamada de seguimiento inicial',
      notes: newOppForm.notes || 'Trato registrado en el pipeline.',
      createdAt: 'Hoy'
    };

    setOpportunities([newDeal, ...opportunities]);
    setSelectedOpp(newDeal);
    setIsNewOppModalOpen(false);
    setNewOppForm({
      title: '',
      company: 'Grupo Innovar',
      dealType: 'new_business',
      amount: '',
      rawAmount: 15000,
      stage: 'calificacion',
      probability: 25,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ownerName: 'Ana Torres',
      contactPerson: '',
      serviceInterest: '',
      notes: ''
    });
  };

  // Helper badge for deal type
  const renderDealTypeBadge = (type: DetailedOpportunity['dealType']) => {
    switch (type) {
      case 'cross_selling':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.2 bg-purple-50 text-purple-700 border border-purple-100 rounded">
            <Shuffle className="w-2.5 h-2.5" />
            Venta Cruzada
          </span>
        );
      case 'upselling':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded">
            <TrendingUp className="w-2.5 h-2.5" />
            Upselling / Expansión
          </span>
        );
      case 'renewal':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-100 rounded">
            Renovación
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded">
            Nuevo Cliente
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#F8FAFC] overflow-hidden">
      {/* 1. Header & KPIs Panel */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-3 shrink-0 space-y-3">
        {/* Title + Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 tracking-tight">Oportunidades</h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                  Embudo de Ventas (Pipeline)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Monitoreo comercial, valor ponderado, probabilidades de cierre y venta cruzada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('kanban')}
                title="Vista Tablero Kanban"
                className={`p-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'kanban'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablero</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                title="Vista Lista / Tabla"
                className={`p-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lista</span>
              </button>
            </div>

            <button
              onClick={() => setIsNewOppModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Nueva oportunidad</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {/* Valor Bruto */}
          <div className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Cartera Total (Bruto)</span>
            <div className="text-lg font-black text-slate-900 mt-1 leading-tight truncate">{kpis.pipelineGross}</div>
            <span className="text-[9px] text-slate-400 mt-0.5 font-medium">{kpis.activeCount} tratos activos</span>
          </div>

          {/* Valor Ponderado */}
          <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-800 uppercase">Valor Ponderado</span>
              <span className="text-[9px] font-black text-purple-600 bg-purple-100 px-1.5 py-0.2 rounded">% Cierre</span>
            </div>
            <div className="text-lg font-black text-purple-900 mt-1 leading-tight truncate">{kpis.pipelineWeighted}</div>
            <span className="text-[9px] text-purple-700/80 mt-0.5 font-semibold">Probabilidad estimada</span>
          </div>

          {/* Venta Cruzada & Upselling */}
          <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-800 uppercase">Expansión Cuentas</span>
              <Shuffle className="w-3 h-3 text-indigo-500" />
            </div>
            <div className="text-lg font-black text-indigo-900 mt-1 leading-tight truncate">{kpis.expansionValue}</div>
            <span className="text-[9px] text-indigo-700/80 mt-0.5 font-semibold">Cross-selling / Upsell</span>
          </div>

          {/* Cerradas Ganadas MTD */}
          <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Cerradas Ganadas</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-lg font-black text-emerald-900 mt-1 leading-tight truncate">{kpis.wonRevenue}</div>
            <span className="text-[9px] text-emerald-700/80 mt-0.5 font-semibold">{kpis.wonCount} tratos cerrados MTD</span>
          </div>

          {/* Tasa de Éxito Estimada */}
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-rose-300 uppercase">Tasa de Conversión</span>
            <div className="text-lg font-black text-white mt-1 leading-tight">68.4%</div>
            <span className="text-[9px] text-slate-300 mt-0.5 font-medium">+14% vs. trimestre anterior</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por trato, cuenta, contacto o servicio..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
              />
            </div>

            {/* Deal Type Filter */}
            <select
              value={dealTypeFilter}
              onChange={(e) => setDealTypeFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
            >
              <option value="all">Tipo: Todos los tratos</option>
              <option value="new_business">Nuevo Cliente (New Business)</option>
              <option value="cross_selling">Venta Cruzada (Cross-selling)</option>
              <option value="upselling">Expansión (Upselling)</option>
              <option value="renewal">Renovación de Contrato</option>
            </select>

            {/* Owner Filter */}
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
            >
              <option value="all">Responsable: Todos</option>
              {uniqueOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>

            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="hidden lg:block px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
            >
              <option value="all">Etapa: Todas</option>
              {STAGES_CONFIG.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[11px] font-semibold text-slate-400">
            Mostrando <b className="text-slate-700">{filteredOpps.length}</b> de {opportunities.length}
          </span>
        </div>
      </div>

      {/* 2. Main Body View (Kanban vs Table) */}
      <div className="flex-1 p-3 min-h-0 overflow-y-auto">
        {/* VISTA 1: TABLERO KANBAN */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 h-full items-start">
            {STAGES_CONFIG.map((stage) => {
              const stageDeals = filteredOpps.filter((o) => o.stage === stage.id);
              const stageSum = stageDeals.reduce((sum, d) => sum + d.rawAmount, 0);

              return (
                <div
                  key={stage.id}
                  className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/80 flex flex-col min-h-[450px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${stage.dotColor}`}></span>
                      <span className="text-xs font-extrabold text-slate-900">{stage.name}</span>
                      <span className="text-[10px] font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600">
                        {stageDeals.length}
                      </span>
                    </div>

                    <span className="text-[10px] font-extrabold text-slate-700">
                      ${stageSum.toLocaleString()}
                    </span>
                  </div>

                  {/* Deals Cards */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        onClick={() => setSelectedOpp(deal)}
                        className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group space-y-2"
                      >
                        {/* Deal Title + Type Badge */}
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            {renderDealTypeBadge(deal.dealType)}
                            <span className="text-[9px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                              {deal.probability}% prob.
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors leading-snug">
                            {deal.title}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{deal.company}</span>
                          </div>
                        </div>

                        {/* Amount & Weighted Value */}
                        <div className="flex items-baseline justify-between pt-1 border-t border-slate-50">
                          <span className="text-xs font-black text-slate-900">{deal.amount}</span>
                          <span className="text-[10px] font-medium text-slate-400">
                            Cierre: {deal.expectedCloseDate}
                          </span>
                        </div>

                        {/* Footer info: Owner & Service Interest */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[10px] text-slate-400">
                          <span className="truncate max-w-[120px] font-medium text-slate-500">
                            {deal.serviceInterest}
                          </span>
                          <img
                            src={deal.ownerAvatar}
                            alt={deal.ownerName}
                            title={`Responsable: ${deal.ownerName}`}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />
                        </div>
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="h-28 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[11px] text-slate-400">
                        Sin tratos en esta etapa
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VISTA 2: LISTA DETALLADA */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Oportunidad / Negocio</th>
                  <th className="py-3 px-3">Cuenta Asociada</th>
                  <th className="py-3 px-3">Tipo de Venta</th>
                  <th className="py-3 px-3">Etapa</th>
                  <th className="py-3 px-3 text-right">Monto Estimado</th>
                  <th className="py-3 px-3 text-center">Probabilidad</th>
                  <th className="py-3 px-3 text-right">Ponderado</th>
                  <th className="py-3 px-3">Cierre Estimado</th>
                  <th className="py-3 px-4">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOpps.map((deal) => {
                  const stageMeta = STAGES_CONFIG.find((s) => s.id === deal.stage);
                  const weightedVal = (deal.rawAmount * deal.probability) / 100;

                  return (
                    <tr
                      key={deal.id}
                      onClick={() => setSelectedOpp(deal)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 hover:text-[#E11D48] transition-colors">
                          {deal.title}
                        </div>
                        <span className="text-[10px] text-slate-400">{deal.serviceInterest}</span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{deal.company}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">{renderDealTypeBadge(deal.dealType)}</td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            stageMeta ? `${stageMeta.badgeBg} ${stageMeta.badgeText}` : 'bg-slate-100'
                          }`}
                        >
                          {stageMeta?.name || deal.stage}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-black text-slate-900 text-right">{deal.amount}</td>

                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          {deal.probability}%
                        </span>
                      </td>

                      <td className="py-3 px-3 font-extrabold text-slate-700 text-right">
                        ${weightedVal.toLocaleString()} USD
                      </td>

                      <td className="py-3 px-3 text-slate-500 font-medium">{deal.expectedCloseDate}</td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={deal.ownerAvatar}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <span className="font-semibold text-slate-800">{deal.ownerName}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Modal / Inspector Detallado de Oportunidad */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200 max-h-[92vh] overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {renderDealTypeBadge(selectedOpp.dealType)}
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                    ID: {selectedOpp.id}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">{selectedOpp.title}</h3>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOpp.company}</span>
                  <span>·</span>
                  <span className="text-slate-400">Responsable: {selectedOpp.ownerName}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pipeline Stage Interactive Progress Bar */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Etapa Comercial del Pipeline
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {STAGES_CONFIG.map((s) => {
                  const isCurrent = selectedOpp.stage === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStageChange(selectedOpp.id, s.id)}
                      className={`py-2 px-1.5 rounded-lg text-center cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[#E11D48] text-white shadow-xs font-black ring-2 ring-[#E11D48]/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold'
                      }`}
                    >
                      <span className="block text-[11px] leading-tight">{s.name}</span>
                      <span className="text-[9px] opacity-80 mt-0.5 block">{s.defaultProbability}%</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial Value Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Monto Estimado</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{selectedOpp.amount}</span>
              </div>

              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl">
                <span className="text-[10px] font-bold text-purple-700 uppercase block">Probabilidad</span>
                <span className="text-base font-black text-purple-900 mt-0.5 block">{selectedOpp.probability}%</span>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Valor Ponderado</span>
                <span className="text-base font-black text-emerald-900 mt-0.5 block">
                  ${((selectedOpp.rawAmount * selectedOpp.probability) / 100).toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Conectividad con la Cuenta y Venta Cruzada */}
            <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Conectividad de Cuenta & Venta Cruzada</span>
                </span>
                <span className="text-[10px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                  {selectedOpp.dealType === 'cross_selling'
                    ? 'Cross-selling Activo'
                    : selectedOpp.dealType === 'upselling'
                    ? 'Expansión de Cuenta'
                    : 'Relación con Cuenta'}
                </span>
              </div>

              <p className="text-xs text-indigo-950 font-medium">
                Servicio o módulo objetivo: <b className="text-indigo-900">{selectedOpp.serviceInterest}</b>
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-indigo-200/60 text-xs">
                <span className="text-slate-600">
                  Contacto: <b>{selectedOpp.contactPerson}</b> ({selectedOpp.contactRole})
                </span>

                <button
                  onClick={() => {
                    setSelectedOpp(null);
                    if (onNavigateToAccount) {
                      onNavigateToAccount(selectedOpp.company);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[#E11D48] hover:text-[#BE123C] font-bold cursor-pointer"
                >
                  <span>Ir a ficha de cuenta</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Next Activity & Notes */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Próxima Actividad</span>
                <span className="font-semibold text-slate-800 mt-0.5 block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E11D48]" />
                  {selectedOpp.nextActivity}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Notas del Trato</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{selectedOpp.notes}</p>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex gap-2">
                <button
                  onClick={() => handleStageChange(selectedOpp.id, 'cerrada_ganada')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Marcar Ganada</span>
                </button>

                <button
                  onClick={() => handleStageChange(selectedOpp.id, 'cerrada_perdida')}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Perdida</span>
                </button>
              </div>

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

      {/* 4. Modal: Nueva Oportunidad */}
      {isNewOppModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Registrar nueva oportunidad</h3>
                <p className="text-xs text-slate-400">Administra nuevos tratos o venta cruzada en cuentas existentes</p>
              </div>
              <button
                onClick={() => setIsNewOppModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del negocio / Trato *</label>
                <input
                  type="text"
                  required
                  value={newOppForm.title}
                  onChange={(e) => setNewOppForm({ ...newOppForm, title: e.target.value })}
                  placeholder="Ej. Implementación ERP y Módulo de Finanzas"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cuenta asociada *</label>
                  <select
                    value={newOppForm.company}
                    onChange={(e) => setNewOppForm({ ...newOppForm, company: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    <option value="Grupo Innovar">Grupo Innovar</option>
                    <option value="Nexos S.A.">Nexos S.A.</option>
                    <option value="Delta Corp">Delta Corp</option>
                    <option value="InnovaTech">InnovaTech</option>
                    <option value="TecnoSol">TecnoSol</option>
                    <option value="Soluciones del Sur">Soluciones del Sur</option>
                    <option value="Dr. Roberto Villanueva">Dr. Roberto Villanueva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de venta *</label>
                  <select
                    value={newOppForm.dealType}
                    onChange={(e) => setNewOppForm({ ...newOppForm, dealType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    <option value="new_business">Nuevo Cliente (New Business)</option>
                    <option value="cross_selling">Venta Cruzada (Cross-selling)</option>
                    <option value="upselling">Expansión (Upselling)</option>
                    <option value="renewal">Renovación de Contrato</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monto estimado (USD) *</label>
                  <input
                    type="text"
                    required
                    value={newOppForm.amount}
                    onChange={(e) => setNewOppForm({ ...newOppForm, amount: e.target.value })}
                    placeholder="Ej. $25,000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Etapa inicial</label>
                  <select
                    value={newOppForm.stage}
                    onChange={(e) => {
                      const st = e.target.value as DetailedOpportunity['stage'];
                      const meta = STAGES_CONFIG.find((s) => s.id === st);
                      setNewOppForm({
                        ...newOppForm,
                        stage: st,
                        probability: meta ? meta.defaultProbability : 25
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    {STAGES_CONFIG.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.defaultProbability}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha prevista de cierre *</label>
                  <input
                    type="date"
                    required
                    value={newOppForm.expectedCloseDate}
                    onChange={(e) => setNewOppForm({ ...newOppForm, expectedCloseDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Responsable comercial</label>
                  <select
                    value={newOppForm.ownerName}
                    onChange={(e) => setNewOppForm({ ...newOppForm, ownerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    <option value="Ana Torres">Ana Torres</option>
                    <option value="Carlos Méndez">Carlos Méndez</option>
                    <option value="Jorge Castillo">Jorge Castillo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Servicio o módulo de interés</label>
                <input
                  type="text"
                  value={newOppForm.serviceInterest}
                  onChange={(e) => setNewOppForm({ ...newOppForm, serviceInterest: e.target.value })}
                  placeholder="Ej. Módulo de Automatización Comercial e IA"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notas del trato</label>
                <textarea
                  rows={2}
                  value={newOppForm.notes}
                  onChange={(e) => setNewOppForm({ ...newOppForm, notes: e.target.value })}
                  placeholder="Detalles de la negociación, requerimientos especiales..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewOppModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Guardar oportunidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
