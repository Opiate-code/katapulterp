import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { PipelineKanban } from './components/PipelineKanban';
import { RightSidebarWidgets } from './components/RightSidebarWidgets';
import { BottomWidgets } from './components/BottomWidgets';
import { Menu, X } from 'lucide-react';

export function App() {
  const [activeNav, setActiveNav] = useState('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#F8FAFC] font-sans antialiased text-slate-800 select-none">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:static transition-transform duration-200 ease-in-out h-full ${
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

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header />

        {/* Mobile menu trigger */}
        <div className="lg:hidden px-3 py-1.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <span className="text-xs font-bold text-slate-700">Katapult CRM</span>
        </div>

        {/* Dashboard Single Viewport Body */}
        <main className="flex-1 p-3.5 flex flex-col xl:flex-row gap-3 min-h-0 overflow-y-auto xl:overflow-hidden">
          {/* Left/Center Section (~75%) */}
          <section className="flex-1 flex flex-col justify-between gap-2.5 min-h-0 min-w-0">
            {/* Welcome Greeting */}
            <div className="shrink-0">
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                Buenos días, Ana
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Aquí tienes un resumen de lo más importante de tu negocio.
              </p>
            </div>

            {/* Metric Cards Row */}
            <MetricCards />

            {/* Pipeline Kanban */}
            <PipelineKanban />

            {/* Bottom Widgets: Actividad reciente + Resumen por fuente */}
            <BottomWidgets />
          </section>

          {/* Right Section (~25% width) */}
          <aside className="w-full xl:w-72 2xl:w-80 shrink-0 h-full min-h-0 flex flex-col">
            <RightSidebarWidgets />
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;
