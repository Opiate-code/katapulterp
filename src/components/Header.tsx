import React from 'react';
import { Search, Bell, Calendar, Grid, ChevronDown } from 'lucide-react';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Ana Torres',
  userRole = 'Marketing',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
}) => {
  return (
    <header className="h-12 bg-white border-b border-slate-200/90 px-5 flex items-center justify-between shrink-0 z-20">
      {/* Search Bar */}
      <div className="relative w-80 max-w-sm">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar contactos, cuentas, oportunidades..."
          className="w-full pl-9 pr-3 py-1.5 bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white text-[11px] text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-[#E11D48] transition-all"
        />
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-2">
        <button
          title="Notificaciones"
          className="w-7 h-7 relative flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E11D48] rounded-full ring-1 ring-white"></span>
        </button>

        <button
          title="Calendario"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
        </button>

        <button
          title="Aplicaciones"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        <div className="h-5 w-px bg-slate-200 mx-1"></div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-1 pr-1.5 py-0.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
          <img
            src={userAvatar}
            alt={userName}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-[#E11D48] transition-all"
          />
          <div className="text-left hidden sm:block">
            <p className="text-[11px] font-bold text-slate-800 leading-tight">{userName}</p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">{userRole}</p>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </header>
  );
};
