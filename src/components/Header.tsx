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
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="relative w-96 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar contactos, cuentas, oportunidades..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48] transition-all"
        />
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Icon Buttons */}
        <button
          title="Calendario"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
        </button>

        <button
          title="Notificaciones"
          className="w-9 h-9 relative flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#E11D48] rounded-full ring-2 ring-white"></span>
        </button>

        <button
          title="Aplicaciones"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Grid className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        {/* User Pill */}
        <div className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
          <img
            src={userAvatar}
            alt={userName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-[#E11D48] transition-all"
          />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">{userName}</p>
            <p className="text-[11px] text-slate-400 font-medium leading-tight">{userRole}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </header>
  );
};
