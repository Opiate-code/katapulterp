import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  Target,
  Users,
  Building2,
  CalendarDays,
  X,
  Settings,
  ArrowRight,
  Globe,
  Share2,
  AlertTriangle,
  Sparkles,
  Phone,
  Mail,
  Tag
} from 'lucide-react';
import { INITIAL_CONTACTS } from '../data/contactsData';
import { INITIAL_ACCOUNTS } from '../data/accountsData';
import { INITIAL_DETAILED_OPPORTUNITIES } from '../data/opportunitiesData';
import { INITIAL_ACTIVITIES } from '../data/activitiesData';

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

export interface UniversalSearchItem {
  id: string;
  title: string;
  subtitle: string;
  extraInfo?: string;
  category: 'Contactos' | 'Cuentas' | 'Oportunidades' | 'Actividades';
  targetNav: string;
  avatarOrIcon?: string;
  badge?: string;
  searchableBlob: string; // Precomputed normalized string for instant matching
}

// Accent-insensitive normalization helper
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Ana Gómez',
  userRole = 'Directora Comercial',
  userAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  onNavigate,
}) => {
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<'todos' | 'Contactos' | 'Cuentas' | 'Oportunidades' | 'Actividades'>('todos');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Build Comprehensive Search Index from all real CRM datasets
  const allSearchIndex = useMemo<UniversalSearchItem[]>(() => {
    const items: UniversalSearchItem[] = [];

    // 1. Index Contactos
    INITIAL_CONTACTS.forEach((contact) => {
      const blob = normalizeText(
        `${contact.fullName} ${contact.account} ${contact.role} ${contact.email} ${contact.primaryPhone} ${contact.tags?.join(' ')} ${contact.notes || ''}`
      );
      items.push({
        id: `contact-${contact.id}`,
        title: contact.fullName,
        subtitle: `${contact.role} · ${contact.account}`,
        extraInfo: `${contact.email} · ${contact.primaryPhone}`,
        category: 'Contactos',
        targetNav: 'contactos',
        avatarOrIcon: contact.avatar,
        badge: contact.status === 'active' ? 'Cliente Activo' : 'Prospecto',
        searchableBlob: blob,
      });
    });

    // 2. Index Cuentas
    INITIAL_ACCOUNTS.forEach((account) => {
      const contactsSummary = account.contacts?.map((c) => c.name).join(' ') || '';
      const servicesSummary = account.services?.map((s) => s.name).join(' ') || '';
      const blob = normalizeText(
        `${account.name} ${account.industry} ${account.type} ${account.tier} ${account.city} ${account.email} ${account.phone} ${contactsSummary} ${servicesSummary} ${account.notes || ''}`
      );
      items.push({
        id: `account-${account.id}`,
        title: account.name,
        subtitle: `${account.type === 'empresa' ? 'Empresa B2B' : 'Particular B2C'} · ${account.industry} · ${account.city}`,
        extraInfo: `LTV: $${account.lifetimeRevenue.toLocaleString()} · ${account.tier}`,
        category: 'Cuentas',
        targetNav: 'cuentas',
        avatarOrIcon: account.logo,
        badge: account.tier,
        searchableBlob: blob,
      });
    });

    // 3. Index Oportunidades
    INITIAL_DETAILED_OPPORTUNITIES.forEach((opp) => {
      const blob = normalizeText(
        `${opp.title} ${opp.company} ${opp.contactPerson} ${opp.serviceInterest} ${opp.dealType} ${opp.stage} ${opp.ownerName} ${opp.notes || ''}`
      );
      items.push({
        id: `opp-${opp.id}`,
        title: opp.title,
        subtitle: `${opp.company} · Contacto: ${opp.contactPerson}`,
        extraInfo: `${opp.amount} · ${opp.probability}% prob. · Responsable: ${opp.ownerName}`,
        category: 'Oportunidades',
        targetNav: 'oportunidades',
        badge: opp.stage.toUpperCase(),
        searchableBlob: blob,
      });
    });

    // 4. Index Actividades
    INITIAL_ACTIVITIES.forEach((act) => {
      const blob = normalizeText(
        `${act.title} ${act.accountName} ${act.contactName} ${act.type} ${act.location} ${act.assignedTo.name} ${act.description} ${act.tags.join(' ')}`
      );
      items.push({
        id: `act-${act.id}`,
        title: act.title,
        subtitle: `${act.dueTime} · ${act.accountName} (${act.contactName})`,
        extraInfo: `${act.location} · Resp: ${act.assignedTo.name}`,
        category: 'Actividades',
        targetNav: 'actividades',
        badge: act.dueDate === '2026-10-17' ? 'Hoy' : act.dueDate,
        searchableBlob: blob,
      });
    });

    return items;
  }, []);

  // Multi-token intuitive search logic
  const searchResults = useMemo(() => {
    const rawQuery = searchQuery.trim();
    if (!rawQuery) return [];

    const normalizedQuery = normalizeText(rawQuery);
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    // Filter by tokens: each token must be matched in the item's searchable blob
    const matched = allSearchIndex.filter((item) => {
      // Category filter check
      if (searchCategoryFilter !== 'todos' && item.category !== searchCategoryFilter) {
        return false;
      }

      // Check if all tokens are present (intuitive multi-word matching)
      // E.g. "carlos mendoza" matches if both "carlos" and "mendoza" exist anywhere in the contact/account info
      return queryTokens.every((token) => item.searchableBlob.includes(token));
    });

    // Sort by relevance (exact title matches first)
    return matched.sort((a, b) => {
      const aTitleNorm = normalizeText(a.title);
      const bTitleNorm = normalizeText(b.title);
      const aStarts = aTitleNorm.startsWith(normalizedQuery);
      const bStarts = bTitleNorm.startsWith(normalizedQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
  }, [allSearchIndex, searchQuery, searchCategoryFilter]);

  // Suggested Quick Items when query is empty
  const suggestedItems = useMemo(() => {
    return allSearchIndex.slice(0, 5);
  }, [allSearchIndex]);

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

  const handleSearchResultClick = (item: UniversalSearchItem) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onNavigate?.(item.targetNav);
  };

  return (
    <header className="h-12 bg-white border-b border-slate-200/90 px-5 flex items-center justify-between shrink-0 z-30 relative select-none">
      {/* 1. Ultra-Intuitive Omnibox Search Bar */}
      <div ref={searchContainerRef} className="relative w-80 md:w-96 lg:w-[460px] max-w-lg">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Buscar por nombre, cuenta, oportunidad, teléfono..."
            className="w-full pl-9 pr-16 py-1.5 bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] transition-all"
          />

          {/* Quick Clear or Shortcut Pill */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <span className="hidden sm:inline text-[9px] font-bold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded border border-slate-300/50">
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Intuitive Dropdown Search Palette */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[480px] flex flex-col">
            {/* Header & Category Filters */}
            <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setSearchCategoryFilter('todos')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    searchCategoryFilter === 'todos'
                      ? 'bg-[#0A1128] text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos ({searchQuery.trim() ? searchResults.length : allSearchIndex.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSearchCategoryFilter('Contactos')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    searchCategoryFilter === 'Contactos'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Contactos
                </button>
                <button
                  type="button"
                  onClick={() => setSearchCategoryFilter('Cuentas')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    searchCategoryFilter === 'Cuentas'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Cuentas
                </button>
                <button
                  type="button"
                  onClick={() => setSearchCategoryFilter('Oportunidades')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    searchCategoryFilter === 'Oportunidades'
                      ? 'bg-[#E11D48] text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Oportunidades
                </button>
                <button
                  type="button"
                  onClick={() => setSearchCategoryFilter('Actividades')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    searchCategoryFilter === 'Actividades'
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Actividades
                </button>
              </div>

              <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
                {searchQuery.trim() ? `${searchResults.length} coincidencias` : 'Sugerencias'}
              </span>
            </div>

            {/* Results or Suggested List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
              {searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSearchResultClick(item)}
                      className="p-3 hover:bg-slate-50/80 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Avatar or Icon */}
                        {item.avatarOrIcon ? (
                          <img
                            src={item.avatarOrIcon}
                            alt={item.title}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                        ) : (
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                              item.category === 'Contactos'
                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                : item.category === 'Cuentas'
                                ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                : item.category === 'Oportunidades'
                                ? 'bg-rose-50 text-[#E11D48] border-rose-100'
                                : 'bg-purple-50 text-purple-600 border-purple-100'
                            }`}
                          >
                            {item.category === 'Contactos' && <Users className="w-4 h-4" />}
                            {item.category === 'Cuentas' && <Building2 className="w-4 h-4" />}
                            {item.category === 'Oportunidades' && <Target className="w-4 h-4" />}
                            {item.category === 'Actividades' && <CalendarDays className="w-4 h-4" />}
                          </div>
                        )}

                        {/* Title, Subtitle, and Extra Information */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors truncate">
                              {item.title}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                                item.category === 'Contactos'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : item.category === 'Cuentas'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : item.category === 'Oportunidades'
                                  ? 'bg-rose-50 text-[#E11D48] border-rose-200'
                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                              }`}
                            >
                              {item.category}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] font-medium text-slate-400 hidden sm:inline">
                                • {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {item.subtitle}
                          </p>
                          {item.extraInfo && (
                            <p className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                              {item.extraInfo}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-[#E11D48] shrink-0">
                        <span className="hidden md:inline">Abrir</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">
                      No se encontraron resultados para &quot;{searchQuery}&quot;
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                      Intenta buscar por parte del nombre, cuenta asociada, cargo, teléfono o correo.
                    </p>
                  </div>
                )
              ) : (
                /* Suggested quick items when no query is typed yet */
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3 text-[#E11D48]" />
                    <span>Registros destacados y frecuentes</span>
                  </div>
                  <div className="space-y-1">
                    {suggestedItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSearchResultClick(item)}
                        className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              item.category === 'Contactos'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {item.category[0]}
                          </span>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-800 block truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Hint */}
            <div className="p-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between shrink-0">
              <span>Navega con un clic o presiona Enter</span>
              <span className="font-mono">ESC para cerrar</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Actions: Notifications, Calendar & Profile */}
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
