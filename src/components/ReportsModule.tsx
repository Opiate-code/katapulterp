import React, { useState } from 'react';
import {
  FileBarChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Activity as PulseIcon,
  Download,
  Printer,
  Calendar,
  Filter,
  ArrowUpRight,
  ChevronRight,
  Award,
  Sparkles,
  BarChart3,
  PieChart,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  REPORTS_DATA,
  LeadSourceMetric,
  FunnelStageMetric,
  RepPerformanceMetric,
  PortfolioSegment,
} from '../data/reportsData';

export const ReportsModule: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'gerencial' | 'embudo' | 'cartera' | 'operativo'>('gerencial');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const data = REPORTS_DATA;

  // CSV Export helper
  const handleExportCSV = () => {
    const rows = [
      ['Modulo', 'Metrica', 'Valor', 'Tendencia'],
      ['Leads', 'Total Leads Generados', data.summaryKpis.totalLeads.value, data.summaryKpis.totalLeads.trend],
      ['Embudo', 'Valor Bruto Pipeline', data.summaryKpis.pipelineValue.value, data.summaryKpis.pipelineValue.trend],
      ['Embudo', 'Valor Ponderado Forecast', data.summaryKpis.weightedForecast.value, data.summaryKpis.weightedForecast.trend],
      ['Cartera', 'Valor Total Cartera', data.summaryKpis.portfolioTotalValue.value, data.summaryKpis.portfolioTotalValue.trend],
      ['Cartera', 'MRR Recurrente', data.summaryKpis.monthlyRecurringRevenue.value, data.summaryKpis.monthlyRecurringRevenue.trend],
      ['Operativo', 'Indice Cumplimiento', data.summaryKpis.operationalActivityIndex.value, data.summaryKpis.operationalActivityIndex.trend],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `katapult-informe-gerencial-${selectedRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#F8FAFC] overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center font-bold shadow-xs">
            <FileBarChart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                Módulo de Reportes & Panel Gerencial
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#E11D48] border border-rose-100">
                Business Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Indicadores clave de rendimiento (KPIs), analítica de embudo, cartera de clientes y pulso operativo.
            </p>
          </div>
        </div>

        {/* Date Selector & Export Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedRange('month')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedRange === 'month'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Este Mes (Octubre)
            </button>
            <button
              onClick={() => setSelectedRange('quarter')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedRange === 'quarter'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Q3 2026
            </button>
            <button
              onClick={() => setSelectedRange('year')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedRange === 'year'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Año 2026
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            title="Descargar informe en formato CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#E11D48]" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1128] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Imprimir / Exportar a PDF"
          >
            <Printer className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Hero 4 KPI Cards (The 4 user requests: Leads, Pipeline, Portfolio, Operational pulse) */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* KPI 1: Volumen de Leads */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50/70 to-blue-50/20 border border-blue-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-700 text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Volumen de Leads</span>
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {data.summaryKpis.totalLeads.trend}
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-blue-950 tracking-tight">
                {data.summaryKpis.totalLeads.value}
              </div>
              <div className="text-[10px] text-blue-700/80 font-medium mt-0.5">
                {data.summaryKpis.totalLeads.comparisonText}
              </div>
            </div>
          </div>

          {/* KPI 2: Rendimiento del Embudo (Pipeline) */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-50/70 to-rose-50/20 border border-rose-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-700 text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#E11D48]" />
                <span>Rendimiento del Embudo</span>
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {data.summaryKpis.pipelineValue.trend}
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-rose-950 tracking-tight">
                {data.summaryKpis.pipelineValue.value}
              </div>
              <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
                Ponderado: {data.summaryKpis.weightedForecast.value}
              </div>
            </div>
          </div>

          {/* KPI 3: Valor de Cartera (Portfolio & MRR) */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-emerald-50/20 border border-emerald-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Valor de Cartera</span>
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {data.summaryKpis.portfolioTotalValue.trend}
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-950 tracking-tight">
                {data.summaryKpis.portfolioTotalValue.value}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                MRR: {data.summaryKpis.monthlyRecurringRevenue.value}
              </div>
            </div>
          </div>

          {/* KPI 4: Pulso Operativo */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50/70 to-purple-50/20 border border-purple-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-purple-700 text-xs font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <PulseIcon className="w-4 h-4 text-purple-600" />
                <span>Pulso Operativo</span>
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {data.summaryKpis.operationalActivityIndex.trend}
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-950 tracking-tight">
                {data.summaryKpis.operationalActivityIndex.value}
              </div>
              <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                Respuesta: {data.operationalHealth.avgResponseMinutes} • Win: {data.summaryKpis.winRate.value}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Strip */}
      <div className="bg-white border-b border-slate-200 px-5 py-2 shrink-0 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('gerencial')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gerencial'
              ? 'bg-[#0A1128] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Panel Gerencial Global</span>
        </button>

        <button
          onClick={() => setActiveTab('embudo')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'embudo'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Embudo de Ventas & Conversión</span>
        </button>

        <button
          onClick={() => setActiveTab('cartera')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'cartera'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Valor de Cartera & MRR</span>
        </button>

        <button
          onClick={() => setActiveTab('operativo')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'operativo'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Pulso Operativo & Rendimiento Comercial</span>
        </button>

        {copiedNotification && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg ml-auto animate-in fade-in duration-200">
            ✓ Archivo CSV descargado con éxito
          </span>
        )}
      </div>

      {/* Main Content Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5 space-y-5">
        {/* TAB 1: PANEL GERENCIAL GLOBAL */}
        {activeTab === 'gerencial' && (
          <div className="space-y-5 max-w-7xl mx-auto">
            {/* Top Grid: Tendencia Mensual + Canales de Adquisición */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Monthly Trend Card (2 cols) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Evolución Histórica de Ingresos y Nuevos Leads (Últimos 6 Meses)
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Comparativa de volumen de captación vs. facturación generada
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    +43.8% Crecimiento Semestral
                  </span>
                </div>

                {/* SVG Visual Bar/Trend Chart */}
                <div className="h-56 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                  {data.monthlyTrends.map((item, idx) => {
                    const maxRevenue = 2500000;
                    const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
                    const isLast = idx === data.monthlyTrends.length - 1;

                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                        {/* Tooltip value */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-[#0A1128] text-white px-2 py-0.5 rounded mb-1 whitespace-nowrap shadow-md pointer-events-none">
                          ${(item.revenue / 1000).toLocaleString()}k MXN • {item.leads} leads
                        </div>

                        {/* Bar */}
                        <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t-xl transition-all duration-500 ${
                              isLast
                                ? 'bg-gradient-to-t from-[#BE123C] to-[#E11D48] shadow-md shadow-rose-200'
                                : 'bg-gradient-to-t from-slate-700 to-slate-900 group-hover:from-rose-600 group-hover:to-rose-500'
                            }`}
                          />
                        </div>

                        {/* Month Label */}
                        <span className="text-[11px] font-bold text-slate-600 mt-2 truncate w-full text-center">
                          {item.month}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400">
                          {item.leads} leads
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 px-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
                      <span className="w-2.5 h-2.5 rounded bg-[#E11D48]" />
                      Ingresos Mensuales MTD
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-slate-500 text-[11px]">
                      <span className="w-2.5 h-2.5 rounded bg-slate-800" />
                      Histórico Anterior
                    </span>
                  </div>
                  <span className="font-bold text-[#E11D48]">
                    Meta Octubre: $2,500,000 (95% alcanzado)
                  </span>
                </div>
              </div>

              {/* Acquisition Channels (1 col) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Fuentes de Adquisición
                    </h2>
                    <span className="text-[10px] font-bold text-slate-400">348 leads totales</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4 font-medium">
                    Efectividad y volumen por cada canal comercial
                  </p>

                  <div className="space-y-3">
                    {data.leadSources.map((source) => (
                      <div key={source.source} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-800 flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: source.color }}
                            />
                            {source.source}
                          </span>
                          <span className="text-slate-500">
                            {source.leads} ({source.conversionRate}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(source.leads / 348) * 100}%`,
                              backgroundColor: source.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                  <span className="font-bold text-slate-800 block">Canal más rentable:</span>
                  <span className="text-emerald-700 font-semibold">
                    Referidos / Clientes (45.8% de cierre, $890,000 generados)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Grid: Resumen Ejecutivo de Salud del Negocio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Box 1: Velocidad Comercial */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-rose-600">
                  <Clock className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Ciclo Medio de Venta
                  </h3>
                </div>
                <div className="text-xl font-black text-slate-900">26 Días</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Reducción de 4 días respecto al trimestre anterior gracias a la automatización de cotizaciones y respuestas rápidas.
                </p>
              </div>

              {/* Box 2: Tasa de Retención Neta (NDR) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Net Dollar Retention (NDR)
                  </h3>
                </div>
                <div className="text-xl font-black text-emerald-700">108.5%</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Los clientes existentes están expandiendo su consumo de módulos y servicios adicionales por encima de las bajas (churn &lt; 2%).
                </p>
              </div>

              {/* Box 3: Satisfacción y Pulso */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-purple-600">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Índice NPS & Satisfacción
                  </h3>
                </div>
                <div className="text-xl font-black text-purple-900">
                  {data.operationalHealth.npsScore} NPS • {data.operationalHealth.customerSatisfactionScore}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Calificación de servicio basada en encuestas de post-entrega y soporte a cuentas activas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EMBUDO DE VENTAS & CONVERSIÓN */}
        {activeTab === 'embudo' && (
          <div className="space-y-5 max-w-7xl mx-auto">
            {/* Funnel Visualizer */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Análisis Integral del Embudo Comercial (Pipeline Funnel)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Flujo de prospectos desde la captación inicial hasta el cierre comercial ganado.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Tasa de Cierre Global: <strong className="text-[#E11D48]">{data.summaryKpis.winRate.value}</strong>
                  </span>
                </div>
              </div>

              {/* Visual Funnel Stack */}
              <div className="space-y-2.5">
                {data.funnelStages.map((stage, idx) => {
                  const widthPercentage = 100 - idx * 14;
                  return (
                    <div key={stage.stage} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{stage.stage}</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-medium">
                            {stage.count} oportunidades
                          </span>
                          <span className="font-extrabold text-slate-900">
                            ${stage.value.toLocaleString()} MXN
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black">
                            {stage.conversionRate}% paso
                          </span>
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-slate-100 rounded-xl h-7 overflow-hidden p-0.5">
                        <div
                          style={{ width: `${widthPercentage}%` }}
                          className={`h-full rounded-lg flex items-center justify-between px-3 text-white text-[11px] font-bold transition-all duration-500 ${
                            idx === 4
                              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-sm'
                              : 'bg-gradient-to-r from-[#0A1128] to-[#1E293B]'
                          }`}
                        >
                          <span>{stage.count} tratos activos</span>
                          <span className="text-[10px] opacity-90">
                            {stage.avgDaysInStage > 0 ? `${stage.avgDaysInStage} días prom.` : 'Cerrada'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conversion Details Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Desglose de Efectividad y Pérdidas por Etapa
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  Actualizado en tiempo real con datos de Oportunidades
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-4">Etapa del Embudo</th>
                      <th className="py-2.5 px-4 text-center">Volumen</th>
                      <th className="py-2.5 px-4 text-right">Monto Estimado</th>
                      <th className="py-2.5 px-4 text-center">Tasa Conversión</th>
                      <th className="py-2.5 px-4 text-center">Permanencia Media</th>
                      <th className="py-2.5 px-4">Riesgo / Bottleneck</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">1. Prospección</td>
                      <td className="py-2.5 px-4 text-center font-bold">64</td>
                      <td className="py-2.5 px-4 text-right font-black text-slate-800">$680,000 MXN</td>
                      <td className="py-2.5 px-4 text-center font-bold text-blue-600">65.6%</td>
                      <td className="py-2.5 px-4 text-center text-slate-500">4 días</td>
                      <td className="py-2.5 px-4 text-emerald-600 font-semibold">Saludable</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">2. Calificación (SQL)</td>
                      <td className="py-2.5 px-4 text-center font-bold">42</td>
                      <td className="py-2.5 px-4 text-right font-black text-slate-800">$590,000 MXN</td>
                      <td className="py-2.5 px-4 text-center font-bold text-blue-600">66.7%</td>
                      <td className="py-2.5 px-4 text-center text-slate-500">6 días</td>
                      <td className="py-2.5 px-4 text-emerald-600 font-semibold">Saludable</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">3. Presentación Propuesta</td>
                      <td className="py-2.5 px-4 text-center font-bold">28</td>
                      <td className="py-2.5 px-4 text-right font-black text-slate-800">$780,000 MXN</td>
                      <td className="py-2.5 px-4 text-center font-bold text-amber-600">64.3%</td>
                      <td className="py-2.5 px-4 text-center text-amber-600 font-bold">9 días</td>
                      <td className="py-2.5 px-4 text-amber-600 font-semibold">Alerta de tiempo (seguimientos pendientes)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">4. Negociación / Legal</td>
                      <td className="py-2.5 px-4 text-center font-bold">18</td>
                      <td className="py-2.5 px-4 text-right font-black text-slate-800">$524,000 MXN</td>
                      <td className="py-2.5 px-4 text-center font-bold text-blue-600">66.7%</td>
                      <td className="py-2.5 px-4 text-center text-slate-500">7 días</td>
                      <td className="py-2.5 px-4 text-emerald-600 font-semibold">Saludable</td>
                    </tr>
                    <tr className="bg-emerald-50/40">
                      <td className="py-2.5 px-4 font-black text-emerald-900">5. Cerradas Ganadas MTD</td>
                      <td className="py-2.5 px-4 text-center font-black text-emerald-900">12</td>
                      <td className="py-2.5 px-4 text-right font-black text-emerald-900">$395,000 MXN</td>
                      <td className="py-2.5 px-4 text-center font-black text-emerald-700">100%</td>
                      <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">Cerrado</td>
                      <td className="py-2.5 px-4 text-emerald-700 font-bold">Objetivo Superado</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VALOR DE CARTERA & FINANZAS MRR */}
        {activeTab === 'cartera' && (
          <div className="space-y-5 max-w-7xl mx-auto">
            {/* Portfolio Summary Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.portfolioSegments.map((segment) => (
                <div
                  key={segment.segment}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                        {segment.segment}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {segment.clientsCount} cuentas
                      </span>
                    </div>

                    <div className="text-2xl font-black text-slate-900 mt-2">
                      ${segment.totalValue.toLocaleString()} MXN
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                      <div
                        style={{
                          width: `${segment.percentage}%`,
                          backgroundColor: segment.color,
                        }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Aporte al MRR:</span>
                    <span className="font-extrabold text-emerald-700">
                      ${segment.mrrContribution.toLocaleString()} MXN / mes
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Revenue Generators Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Cuentas Estratégicas de Mayor Valor (Top Contributors)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Clientes clave con mayor aporte recurrente y oportunidades de venta cruzada
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  MRR Total: $345,000 MXN
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-4">Cuenta / Razón Social</th>
                      <th className="py-2.5 px-4">Segmento</th>
                      <th className="py-2.5 px-4 text-right">Valor Cartera</th>
                      <th className="py-2.5 px-4 text-right">MRR Contratado</th>
                      <th className="py-2.5 px-4 text-center">Estado</th>
                      <th className="py-2.5 px-4 text-center">Potencial Expansión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">InnovaTech Soluciones</td>
                      <td className="py-2.5 px-4 text-slate-500 font-medium">Enterprise B2B</td>
                      <td className="py-2.5 px-4 text-right font-black text-slate-800">$1,450,000 MXN</td>
                      <td className="py-2.5 px-4 text-right font-black text-emerald-700">$95,000 / mes</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">Activa</span>
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-[#E11D48]">Alta (IA + SLA)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">Grupo Salinas & Asociados</td>
                      <td className="py-2.5 px-4 text-slate-500 font-medium">Corporativo B2B</td>
                      <td className="py-2.5 px-4 text-right font-black text-slate-800">$1,230,000 MXN</td>
                      <td className="py-2.5 px-4 text-right font-black text-emerald-700">$75,000 / mes</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">Activa</span>
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-blue-600">Venta Cruzada ERP</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">Logística Avanzada del Norte</td>
                      <td className="py-2.5 px-4 text-slate-500 font-medium">PYME B2B</td>
                      <td className="py-2.5 px-4 text-right font-black text-slate-800">$640,000 MXN</td>
                      <td className="py-2.5 px-4 text-right font-black text-emerald-700">$48,000 / mes</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">Activa</span>
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-500">Kickoff Q4</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">BioSalud Farmacéutica</td>
                      <td className="py-2.5 px-4 text-slate-500 font-medium">Enterprise B2B</td>
                      <td className="py-2.5 px-4 text-right font-black text-slate-800">$510,000 MXN</td>
                      <td className="py-2.5 px-4 text-right font-black text-emerald-700">$42,000 / mes</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">Renovación</span>
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-amber-600">SLA 24/7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PULSO OPERATIVO & RENDIMIENTO COMERCIAL */}
        {activeTab === 'operativo' && (
          <div className="space-y-5 max-w-7xl mx-auto">
            {/* Reps Leaderboard */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Leaderboard & Rendimiento por Representante Comercial
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Cumplimiento de cuota de ventas, volumen cerrado y actividades ejecutadas
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  Cuota Total Q4: $2,700,000 (107.4% Alcanzada)
                </span>
              </div>

              <div className="space-y-3">
                {data.repLeaderboard.map((rep, idx) => (
                  <div
                    key={rep.name}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white"
                  >
                    {/* Left: Rep Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <img
                          src={rep.avatar}
                          alt={rep.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        {idx === 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[10px] text-white shadow-xs">
                            ★
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{rep.name}</h4>
                          <span className="text-[10px] font-bold text-slate-400">
                            #{idx + 1} en ranking
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{rep.role}</p>
                      </div>
                    </div>

                    {/* Center: Quota Progress */}
                    <div className="flex-1 max-w-xs space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500 text-[10px]">Cuota ({rep.quotaAttainment}%)</span>
                        <span className="text-slate-800">
                          ${rep.revenueGenerated.toLocaleString()} / ${rep.targetQuota.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          style={{ width: `${Math.min(rep.quotaAttainment, 100)}%` }}
                          className={`h-full rounded-full ${
                            rep.quotaAttainment >= 100
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                              : 'bg-gradient-to-r from-amber-500 to-amber-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Right: Stats pills */}
                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <div className="text-xs font-black text-slate-900">{rep.dealsWon}</div>
                        <div className="text-[10px] font-semibold text-slate-400">Tratos Ganados</div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-purple-700">{rep.activitiesCompleted}</div>
                        <div className="text-[10px] font-semibold text-slate-400">Actividades</div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">
                          ${(rep.avgDealSize / 1000).toFixed(1)}k
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400">Ticket Medio</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Activities Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
                  Distribución de Actividades Realizadas
                </h3>
                <p className="text-[11px] text-slate-500 mb-4 font-medium">
                  Total de 376 gestiones operativas en el período
                </p>

                <div className="space-y-3">
                  {data.operationalHealth.activitiesByType.map((act) => (
                    <div key={act.type} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{act.type}</span>
                        <span className="text-slate-500">
                          {act.count} gestiones ({act.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          style={{ width: `${act.percentage}%` }}
                          className={`h-full rounded-full ${act.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Level Agreement & Operational KPIs */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
                    Nivel de Servicio Comercial (SLAs)
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-4 font-medium">
                    Tiempos de respuesta y puntualidad del equipo comercial
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Tiempo de Respuesta
                      </span>
                      <div className="text-lg font-black text-slate-800 mt-0.5">14 Minutos</div>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        -6 min vs estándar SLA
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Puntualidad en Tareas
                      </span>
                      <div className="text-lg font-black text-emerald-700 mt-0.5">94.2%</div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Cumplimiento de fechas
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-purple-950 block">Pulso Comercial Saludable</span>
                    <span className="text-[11px] text-purple-700">
                      Capacidad operativa disponible para recibir +25% de volumen en Q4.
                    </span>
                  </div>
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsModule;
