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
    <aside className="w-56 bg-[#0A1128] text-white flex flex-col justify-between shrink-0 h-full border-r border-[#1E293B] select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 flex items-center gap-2.5">
          {/* Katapult Red Arrow Icon */}
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current text-[#E11D48]" aria-hidden="true">
              <path d="M12 8L4 20L12 32L17 28L11 20L17 12L12 8Z" />
              <path d="M26 8L18 20L26 32L31 28L25 20L31 12L26 8Z" fill="#BE123C" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider uppercase text-white leading-tight">
              Katapult
            </h1>
            <span className="text-[9px] text-[#E11D48] font-bold tracking-widest uppercase block">
              Marketing Studio
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-2.5 space-y-0.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#17233E] text-white shadow-xs font-bold'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E11D48]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings */}
      <div className="p-3 border-t border-[#1E293B]">
        <button
          onClick={() => onSelectNav('configuracion')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeNav === 'configuracion'
              ? 'bg-[#17233E] text-white shadow-xs font-bold'
              : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className={`w-3.5 h-3.5 ${activeNav === 'configuracion' ? 'text-[#E11D48]' : 'text-[#64748B]'}`} />
          <span>Configuración</span>
        </button>
      </div>
    </aside>
  );
};
