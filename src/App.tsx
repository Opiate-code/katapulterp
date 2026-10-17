import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { PipelineKanban } from './components/PipelineKanban';
import { RightSidebarWidgets } from './components/RightSidebarWidgets';
import { BottomWidgets } from './components/BottomWidgets';
import { ContactsModule } from './components/ContactsModule';
import { AccountsModule } from './components/AccountsModule';
import { OpportunitiesModule } from './components/OpportunitiesModule';
import { ActivitiesModule } from './components/ActivitiesModule';
import { ReportsModule } from './components/ReportsModule';
import { IntegrationsModule } from './components/IntegrationsModule';
import { Menu, X, ArrowLeft, Construction } from 'lucide-react';

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

        {/* Dynamic Route View */}
        {activeNav === 'inicio' && (
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
        )}

        {/* Contacts Module View */}
        {activeNav === 'contactos' && <ContactsModule />}

        {/* Accounts Module View */}
        {activeNav === 'cuentas' && <AccountsModule />}

        {/* Opportunities Module View */}
        {activeNav === 'oportunidades' && (
          <OpportunitiesModule onNavigateToAccount={(accountName) => setActiveNav('cuentas')} />
        )}

        {/* Activities Module View */}
        {activeNav === 'actividades' && (
          <ActivitiesModule
            onNavigateToAccount={(accountName) => setActiveNav('cuentas')}
            onNavigateToOpportunities={() => setActiveNav('oportunidades')}
          />
        )}

        {/* Reports Module View */}
        {activeNav === 'reportes' && <ReportsModule />}

        {/* Integrations Module View */}
        {activeNav === 'integraciones' && <IntegrationsModule />}

        {/* Modules in Queue / Work In Progress Placeholders */}
        {activeNav !== 'inicio' &&
          activeNav !== 'contactos' &&
          activeNav !== 'cuentas' &&
          activeNav !== 'oportunidades' &&
          activeNav !== 'actividades' &&
          activeNav !== 'reportes' &&
          activeNav !== 'integraciones' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#E11D48] flex items-center justify-center mb-3">
              <Construction className="w-7 h-7" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 capitalize">
              Módulo de {activeNav}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Próximo módulo en la secuencia de desarrollo de Katapult Marketing Studio.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveNav('contactos')}
                className="px-3.5 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Ver Módulo de Contactos
              </button>
              <button
                onClick={() => setActiveNav('inicio')}
                className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
