import React from 'react';
import {
  Home,
  Users,
  Building2,
  Target,
  Calendar,
  FileBarChart,
  Boxes,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeNav: string;
  onSelectNav: (nav: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, onSelectNav }) => {
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'contactos', label: 'Contactos', icon: Users },
    { id: 'cuentas', label: 'Cuentas', icon: Building2 },
    { id: 'oportunidades', label: 'Oportunidades', icon: Target },
    { id: 'actividades', label: 'Actividades', icon: Calendar },
    { id: 'reportes', label: 'Reportes', icon: FileBarChart },
    { id: 'integraciones', label: 'Integraciones', icon: Boxes },
  ];

  return (
    <aside className="w-64 bg-[#0A1128] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-[#1E293B]">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3">
          {/* Katapult Red Arrow Icon */}
          <div className="w-9 h-9 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-[#E11D48]" aria-hidden="true">
              <path d="M12 8L4 20L12 32L17 28L11 20L17 12L12 8Z" />
              <path d="M26 8L18 20L26 32L31 28L25 20L31 12L26 8Z" fill="#BE123C" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wider uppercase text-white leading-tight">
              Katapult
            </h1>
            <span className="text-[10px] text-[#E11D48] font-bold tracking-widest uppercase block">
              Marketing Studio
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E293B] text-white shadow-sm font-bold border-l-3 border-[#E11D48]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E11D48]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings */}
      <div className="p-4 border-t border-[#1E293B]">
        <button
          onClick={() => onSelectNav('configuracion')}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-[#64748B]" />
          <span>Configuración</span>
        </button>
      </div>
    </aside>
  );
};
