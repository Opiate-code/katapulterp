import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Clock,
  Target,
  Users,
  Building2,
  ExternalLink,
  Check,
  AlertTriangle,
  ArrowRight,
  Globe,
  Share2,
  X,
  Settings,
  LogOut,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  onNavigate?: (nav: string) => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'lead' | 'deal' | 'activity' | 'meta';
  unread: boolean;
  targetNav: string;
}

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Contactos' | 'Cuentas' | 'Oportunidades' | 'Actividades';
  targetNav: string;
  badge?: string;
}

const GLOBAL_SEARCH_ITEMS: SearchResultItem[] = [
  // Contactos
  { id: 'c-1', title: 'Carlos Mendoza', subtitle: 'Director de Tecnología · InnovaTech Soluciones', category: 'Contactos', targetNav: 'contactos', badge: 'Contacto' },
  { id: 'c-2', title: 'Mariana Silva', subtitle: 'Gerente de Compras · Grupo Salinas & Asoc.', category: 'Contactos', targetNav: 'contactos', badge: 'Contacto' },
  { id: 'c-3', title: 'Roberto Gómez', subtitle: 'CEO · Logística Avanzada del Norte', category: 'Contactos', targetNav: 'contactos', badge: 'Contacto' },
  { id: 'c-4', title: 'Dra. Sofía Mendoza', subtitle: 'Directora Médica · Clínica San Rafael', category: 'Contactos', targetNav: 'contactos', badge: 'Particular' },
  { id: 'c-5', title: 'Carlos Eduardo Ramírez', subtitle: 'Inversionista Privado · Inversiones Privadas', category: 'Contactos', targetNav: 'contactos', badge: 'Particular VIP' },
  { id: 'c-6', title: 'Elena Morales', subtitle: 'VP de Operaciones · BioSalud Farmacéutica', category: 'Contactos', targetNav: 'contactos', badge: 'Contacto' },
  { id: 'c-7', title: 'Javier Torres', subtitle: 'Director Comercial · UrbanStyle Retail', category: 'Contactos', targetNav: 'contactos', badge: 'Contacto' },

  // Cuentas
  { id: 'a-1', title: 'InnovaTech Soluciones', subtitle: 'Empresa B2B · Software & Cloud · $1,450,000 LTV', category: 'Cuentas', targetNav: 'cuentas', badge: 'Empresa' },
  { id: 'a-2', title: 'Grupo Salinas & Asociados', subtitle: 'Empresa B2B · Finanzas & Inversión · $1,230,000 LTV', category: 'Cuentas', targetNav: 'cuentas', badge: 'Empresa' },
  { id: 'a-3', title: 'Logística Avanzada del Norte', subtitle: 'Empresa B2B · Transporte & Supply Chain', category: 'Cuentas', targetNav: 'cuentas', badge: 'Empresa' },
  { id: 'a-4', title: 'BioSalud Farmacéutica', subtitle: 'Empresa B2B · Farmacia & Salud', category: 'Cuentas', targetNav: 'cuentas', badge: 'Empresa' },
  { id: 'a-5', title: 'UrbanStyle Retail', subtitle: 'Empresa B2B · Retail Omnicanal', category: 'Cuentas', targetNav: 'cuentas', badge: 'Empresa' },

  // Oportunidades
  { id: 'o-1', title: 'Expansión Licencias Enterprise + IA', subtitle: '$450,000 MXN · InnovaTech Soluciones (80% prob.)', category: 'Oportunidades', targetNav: 'oportunidades', badge: 'Negociación' },
  { id: 'o-2', title: 'Suite Integral de Automatización B2B', subtitle: '$680,000 MXN · Grupo Salinas (60% prob.)', category: 'Oportunidades', targetNav: 'oportunidades', badge: 'Propuesta' },
  { id: 'o-3', title: 'Consultoría Supply Chain 4.0', subtitle: '$320,000 MXN · Logística Avanzada (35% prob.)', category: 'Oportunidades', targetNav: 'oportunidades', badge: 'Calificación' },
  { id: 'o-4', title: 'Transformación Omnicanal Retail', subtitle: '$520,000 MXN · UrbanStyle Retail (60% prob.)', category: 'Oportunidades', targetNav: 'oportunidades', badge: 'Propuesta' },

  // Actividades
  { id: 'act-1', title: 'Demo Técnica y Alcance de Módulo IA', subtitle: 'Hoy 11:30 AM · Google Meet · Carlos Mendoza', category: 'Actividades', targetNav: 'actividades', badge: 'Reunión' },
  { id: 'act-2', title: 'Llamada de seguimiento a propuesta', subtitle: 'Hoy 03:00 PM · Llamada · Mariana Silva', category: 'Actividades', targetNav: 'actividades', badge: 'Llamada' },
  { id: 'act-3', title: 'Ajuste de cláusula confidencialidad y SLA', subtitle: 'Hoy 05:00 PM · Tarea Legal · Elena Morales', category: 'Actividades', targetNav: 'actividades', badge: 'Tarea' },
];

export const Header: React.FC<HeaderProps> = ({
  userName = 'Ana Gómez',
  userRole = 'Directora Comercial',
  userAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  onNavigate,
}) => {
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Notifications State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NOTIF-1',
      title: 'Nuevo Lead de Landing Page',
      description: 'Ing. Rodrigo Valenzuela completó el formulario para Módulo ERP.',
      time: 'Hace 5 minutos',
      type: 'lead',
      unread: true,
      targetNav: 'contactos',
    },
    {
      id: 'NOTIF-2',
      title: 'Oportunidad Cerrada Ganada',
      description: 'Renovación y Expansión Cloud Analytics cerrada por $395,000 MXN.',
      time: 'Hace 45 minutos',
      type: 'deal',
      unread: true,
      targetNav: 'oportunidades',
    },
    {
      id: 'NOTIF-3',
      title: 'Alerta de Actividad Vencida',
      description: 'Llamada con Guillermo Ochoa (Alimentos La Pradera) pendiente de reprogramar.',
      time: 'Hoy 10:00 AM',
      type: 'activity',
      unread: true,
      targetNav: 'actividades',
    },
    {
      id: 'NOTIF-4',
      title: 'Lead Ad de Instagram (Meta)',
      description: 'Lic. Paulina Durán envió sus datos desde campaña Meta Ads.',
      time: 'Hace 2 horas',
      type: 'meta',
      unread: false,
      targetNav: 'integraciones',
    },
  ]);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  // Calendar State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calContainerRef = useRef<HTMLDivElement>(null);

  // User Profile Menu State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (calContainerRef.current && !calContainerRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Search Results
  const searchResults = searchQuery.trim()
    ? GLOBAL_SEARCH_ITEMS.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      })
    : [];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    setIsNotificationsOpen(false);
    onNavigate?.(notif.targetNav);
  };

  const handleSearchResultClick = (item: SearchResultItem) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onNavigate?.(item.targetNav);
  };

  return (
    <header className="h-12 bg-white border-b border-slate-200/90 px-5 flex items-center justify-between shrink-0 z-30 relative select-none">
      {/* 1. Functional Global Search Bar */}
      <div ref={searchContainerRef} className="relative w-80 md:w-96 max-w-md">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onFocus={() => setIsSearchOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          placeholder="Buscar contactos, cuentas, oportunidades..."
          className="w-full pl-9 pr-8 py-1.5 bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white text-[11px] text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-[#E11D48] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsSearchOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 max-h-96 overflow-y-auto">
            <div className="p-2 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Resultados encontrados ({searchResults.length})</span>
              <span className="text-[#E11D48]">Katapult Omnibox</span>
            </div>

            {searchResults.length > 0 ? (
              <div className="py-1 divide-y divide-slate-50">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSearchResultClick(item)}
                    className="p-2.5 hover:bg-slate-50 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        {item.category === 'Contactos' && <Users className="w-3.5 h-3.5 text-blue-600" />}
                        {item.category === 'Cuentas' && <Building2 className="w-3.5 h-3.5 text-indigo-600" />}
                        {item.category === 'Oportunidades' && <Target className="w-3.5 h-3.5 text-[#E11D48]" />}
                        {item.category === 'Actividades' && <Calendar className="w-3.5 h-3.5 text-purple-600" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                No se encontraron coincidencias para &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions: Notifications, Calendar & Profile (Apps button removed) */}
      <div className="flex items-center gap-2">
        {/* 2. Programmed Notifications Popover */}
        <div ref={notifContainerRef} className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsCalendarOpen(false);
              setIsUserMenuOpen(false);
            }}
            title="Notificaciones programadas del CRM"
            className={`w-8 h-8 relative flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
              isNotificationsOpen ? 'bg-slate-100 text-[#E11D48]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-[15px] bg-[#E11D48] text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#E11D48]" />
                  <h3 className="text-xs font-black tracking-tight">Notificaciones del Sistema</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-[#E11D48] text-white px-1.5 py-0.2 rounded-full">
                      {unreadCount} nuevas
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Marcar todas leídas
                  </button>
                )}
              </div>

              {/* Notification Filter Tabs */}
              <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-xs">
                <button
                  onClick={() => setNotificationFilter('all')}
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] cursor-pointer ${
                    notificationFilter === 'all'
                      ? 'bg-white text-slate-800 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  onClick={() => setNotificationFilter('unread')}
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] cursor-pointer ${
                    notificationFilter === 'unread'
                      ? 'bg-white text-[#E11D48] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  No leídas ({unreadCount})
                </button>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                {notifications
                  .filter((n) => (notificationFilter === 'unread' ? n.unread : true))
                  .map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${
                        notif.unread ? 'bg-rose-50/20' : 'bg-white'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'lead' && (
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Globe className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {notif.type === 'deal' && (
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Target className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {notif.type === 'activity' && (
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {notif.type === 'meta' && (
                          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Share2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {notif.title}
                          </h4>
                          {notif.unread && (
                            <span className="w-2 h-2 rounded-full bg-[#E11D48] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {notif.description}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium block mt-1">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))}

                {notifications.filter((n) => (notificationFilter === 'unread' ? n.unread : true))
                  .length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No tienes notificaciones pendientes.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Interactive Calendar Popover */}
        <div ref={calContainerRef} className="relative">
          <button
            onClick={() => {
              setIsCalendarOpen(!isCalendarOpen);
              setIsNotificationsOpen(false);
              setIsUserMenuOpen(false);
            }}
            title="Calendario & Agenda de hoy"
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
              isCalendarOpen ? 'bg-slate-100 text-[#E11D48]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Calendar Popover */}
          {isCalendarOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-rose-400 font-bold block uppercase tracking-wider">
                    Agenda Comercial
                  </span>
                  <h3 className="text-xs font-black">Sábado, 17 de Octubre de 2026</h3>
                </div>
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-[#E11D48] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              {/* Today's Schedule Mini-List */}
              <div className="p-3 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Actividades programadas para hoy:
                </span>

                <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-100 flex items-start gap-2">
                  <span className="text-[10px] font-black text-purple-700 mt-0.5">11:30</span>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-[11px] block truncate">
                      Demo Técnica y Alcance IA
                    </span>
                    <span className="text-[10px] text-purple-700 font-medium">
                      Carlos Mendoza (InnovaTech)
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2">
                  <span className="text-[10px] font-black text-blue-700 mt-0.5">15:00</span>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-[11px] block truncate">
                      Llamada de seguimiento propuesta
                    </span>
                    <span className="text-[10px] text-blue-700 font-medium">
                      Mariana Silva (Grupo Salinas)
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-2">
                  <span className="text-[10px] font-black text-amber-700 mt-0.5">17:00</span>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-[11px] block truncate">
                      Ajuste cláusula SLA legal
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium">
                      Elena Morales (BioSalud)
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsCalendarOpen(false);
                    onNavigate?.('actividades');
                  }}
                  className="w-full py-1.5 px-3 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Ver Agenda Completa & Calendario</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-5 w-px bg-slate-200 mx-1" />

        {/* 4. User Profile Dropdown Pill */}
        <div ref={userMenuRef} className="relative">
          <div
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotificationsOpen(false);
              setIsCalendarOpen(false);
            }}
            className="flex items-center gap-2.5 pl-1 pr-1.5 py-0.5 rounded-xl hover:bg-slate-100/70 cursor-pointer transition-colors group"
          >
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

          {/* User Menu Popover */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-slate-100 mb-1">
                <p className="font-bold text-slate-900">{userName}</p>
                <p className="text-[10px] text-slate-400">{userRole}</p>
              </div>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onNavigate?.('configuracion');
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-slate-700 font-semibold cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Configuración & Perfil</span>
              </button>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onNavigate?.('actividades');
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-slate-700 font-semibold cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Mi Agenda del Día</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
