import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { PipelineKanban } from './components/PipelineKanban';
import { RightSidebarWidgets } from './components/RightSidebarWidgets';
import { BottomWidgets } from './components/BottomWidgets';
import { Calendar, Filter, Download, Plus, Menu, X } from 'lucide-react';

export function App() {
  const [activeNav, setActiveNav] = useState('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNewOppModalOpen, setIsNewOppModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:static transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          activeNav={activeNav}
          onSelectNav={(nav) => {
            setActiveNav(nav);
            setMobileMenuOpen(false);
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        {/* Mobile menu trigger button */}
        <div className="lg:hidden px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-xs font-bold text-slate-700">Katapult CRM</span>
        </div>

        {/* Page Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Welcome Banner / Header Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Buenos días, Ana
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Aquí tienes un resumen de lo más importante de tu negocio.
              </p>
            </div>

            {/* Top Action Pills */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Últimos 30 días</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filtros</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer">
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>
          </div>

          {/* 1. Metric Cards Row */}
          <MetricCards />

          {/* 2. Main Middle Section: Kanban + Right Widgets */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            {/* Left 3 cols: Pipeline Kanban */}
            <div className="xl:col-span-3">
              <PipelineKanban onAddOpportunity={() => setIsNewOppModalOpen(true)} />
            </div>

            {/* Right 1 col: Upcoming Activities & Recent Contacts */}
            <div className="xl:col-span-1">
              <RightSidebarWidgets />
            </div>
          </div>

          {/* 3. Bottom Row: Audit log, Lead sources donut chart, Promo card */}
          <BottomWidgets />
        </main>
      </div>

      {/* Add Opportunity Modal */}
      {isNewOppModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Crear nueva oportunidad</h3>
              <button
                onClick={() => setIsNewOppModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewOppModalOpen(false);
                alert('¡Oportunidad registrada exitosamente en Katapult ERP!');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Empresa / Cuenta</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Grupo Santander"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monto estimado (USD)</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. $25,000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Etapa inicial</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48]">
                  <option value="prospeccion">Prospección</option>
                  <option value="calificacion">Calificación</option>
                  <option value="propuesta">Propuesta</option>
                  <option value="negociacion">Negociación</option>
                  <option value="cerradas">Cerradas</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
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
}

export default App;
