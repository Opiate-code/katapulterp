import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  Search,
  Plus,
  Filter,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Clock,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  UserCheck,
  Briefcase,
  FileText,
  User,
  X,
  ExternalLink,
  Target,
  Sparkles,
  Download,
  CheckCircle2,
  PhoneCall,
  Calendar
} from 'lucide-react';
import {
  Account,
  INITIAL_ACCOUNTS,
  AccountContactItem,
  AccountOpportunityItem,
  AccountActivityItem
} from '../data/accountsData';

export const AccountsModule: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(INITIAL_ACCOUNTS[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'opportunities' | 'activities' | 'financial'>('overview');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'empresa' | 'particular'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activa' | 'potencial' | 'inactiva'>('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Modals
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  // New Account Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'empresa' as 'empresa' | 'particular',
    status: 'activa' as 'activa' | 'potencial' | 'inactiva',
    tier: 'Corporativo' as Account['tier'],
    industry: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'México',
    taxId: '',
    accountOwner: 'Ana Torres',
    notes: ''
  });

  // New Contact inside account form
  const [newContactForm, setNewContactForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    isPrimary: false
  });

  // Calculate Indicator KPIs
  const kpis = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter((a) => a.status === 'activa').length;
    const potential = accounts.filter((a) => a.status === 'potencial').length;
    const inactive = accounts.filter((a) => a.status === 'inactiva').length;
    const pipelineValue = accounts.reduce((acc, curr) => acc + curr.totalPipelineValue, 0);
    const totalRevenue = accounts.reduce((acc, curr) => acc + curr.lifetimeRevenue, 0);

    return {
      total,
      active,
      potential,
      inactive,
      pipelineValue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pipelineValue),
      totalRevenue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalRevenue)
    };
  }, [accounts]);

  // Unique industries for filter
  const uniqueIndustries = useMemo(() => {
    return Array.from(new Set(accounts.map((a) => a.industry)));
  }, [accounts]);

  // Filtered Accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch =
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (acc.taxId && acc.taxId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'all' || acc.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || acc.status === statusFilter;
      const matchesIndustry = industryFilter === 'all' || acc.industry === industryFilter;

      return matchesSearch && matchesType && matchesStatus && matchesIndustry;
    });
  }, [accounts, searchQuery, typeFilter, statusFilter, industryFilter]);

  const selectedAccount = useMemo(() => {
    return accounts.find((a) => a.id === selectedAccountId) || accounts[0];
  }, [accounts, selectedAccountId]);

  // Handle Account Creation
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newAcc: Account = {
      id: `acc-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      status: formData.status,
      tier: formData.tier,
      industry: formData.industry || 'Servicios Generales',
      website: formData.website || undefined,
      email: formData.email,
      phone: formData.phone || '+52 55 0000 0000',
      address: formData.address || 'Dirección comercial no especificada',
      city: formData.city || 'Ciudad de México',
      country: formData.country,
      taxId: formData.taxId || undefined,
      healthScore: 'excelente',
      accountOwner: formData.accountOwner,
      totalPipelineValue: 0,
      lifetimeRevenue: 0,
      createdAt: 'Hoy',
      logo:
        formData.type === 'empresa'
          ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      notes: formData.notes || 'Cuenta dada de alta recientemente en el CRM.',
      contacts: [],
      opportunities: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          date: 'Hoy',
          type: 'support',
          title: 'Alta de cuenta en el sistema',
          description: `Registro inicial de ${formData.type === 'empresa' ? 'empresa' : 'persona particular'}.`,
          user: formData.accountOwner
        }
      ]
    };

    setAccounts([newAcc, ...accounts]);
    setSelectedAccountId(newAcc.id);
    setIsNewAccountOpen(false);
    setFormData({
      name: '',
      type: 'empresa',
      status: 'activa',
      tier: 'Corporativo',
      industry: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'México',
      taxId: '',
      accountOwner: 'Ana Torres',
      notes: ''
    });
  };

  // Handle Add Contact to Account
  const handleAddContactToAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactForm.name || !newContactForm.email || !selectedAccount) return;

    const newCt: AccountContactItem = {
      id: `ct-${Date.now()}`,
      name: newContactForm.name,
      role: newContactForm.role || 'Punto Focal',
      email: newContactForm.email,
      phone: newContactForm.phone || selectedAccount.phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
      isPrimary: newContactForm.isPrimary
    };

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === selectedAccount.id
          ? { ...acc, contacts: [...acc.contacts, newCt] }
          : acc
      )
    );

    setIsAddContactModalOpen(false);
    setNewContactForm({ name: '', role: '', email: '', phone: '', isPrimary: false });
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#F8FAFC] overflow-hidden">
      {/* 1. Header & Indicator KPIs Panel */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-3 shrink-0 space-y-3">
        {/* Title + Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 tracking-tight">Cuentas</h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  Núcleo Estratégico 360°
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gestión integral de empresas y personas particulares con analíticas y cartera
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewAccountOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Nueva cuenta</span>
            </button>
          </div>
        </div>

        {/* 6 KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {/* Total */}
          <div className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Cuentas totales</span>
            <div className="text-lg font-black text-slate-900 mt-1 leading-tight">{kpis.total}</div>
            <span className="text-[9px] text-slate-400 mt-0.5 font-medium">B2B + B2C</span>
          </div>

          {/* Activas */}
          <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Activas</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-lg font-black text-emerald-900 mt-1 leading-tight">{kpis.active}</div>
            <span className="text-[9px] text-emerald-700/80 mt-0.5 font-semibold">Con contratos / MRR</span>
          </div>

          {/* Potenciales */}
          <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-800 uppercase">Potenciales</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            </div>
            <div className="text-lg font-black text-blue-900 mt-1 leading-tight">{kpis.potential}</div>
            <span className="text-[9px] text-blue-700/80 mt-0.5 font-semibold">En prospección</span>
          </div>

          {/* Inactivas */}
          <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Inactivas</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </div>
            <div className="text-lg font-black text-amber-900 mt-1 leading-tight">{kpis.inactive}</div>
            <span className="text-[9px] text-amber-700/80 mt-0.5 font-semibold">Para reactivar</span>
          </div>

          {/* Cartera Potencial */}
          <div className="p-2.5 bg-purple-50/60 rounded-xl border border-purple-100/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-purple-800 uppercase">Valor Cartera</span>
            <div className="text-lg font-black text-purple-900 mt-1 leading-tight truncate">{kpis.pipelineValue}</div>
            <span className="text-[9px] text-purple-700/80 mt-0.5 font-semibold">Tratos abiertos</span>
          </div>

          {/* Ingresos Generados (LTV) */}
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-rose-300 uppercase">Ingresos Generados</span>
            <div className="text-lg font-black text-white mt-1 leading-tight truncate">{kpis.totalRevenue}</div>
            <span className="text-[9px] text-slate-300 mt-0.5 font-medium">Facturación LTV</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cuenta por nombre, ciudad o RFC..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
            >
              <option value="all">Tipo: Todos</option>
              <option value="empresa">Empresas (B2B)</option>
              <option value="particular">Particulares (B2C)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
            >
              <option value="all">Estado: Todos</option>
              <option value="activa">Activas</option>
              <option value="potencial">Potenciales</option>
              <option value="inactiva">Inactivas</option>
            </select>

            {/* Industry Filter */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="hidden lg:block px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
            >
              <option value="all">Industria: Todas</option>
              {uniqueIndustries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[11px] font-semibold text-slate-400">
            Mostrando <b className="text-slate-700">{filteredAccounts.length}</b> de {accounts.length}
          </span>
        </div>
      </div>

      {/* 2. Main Master-Detail Split (Directory + 360° Inspector) */}
      <div className="flex-1 flex min-h-0 overflow-hidden p-3 gap-3">
        {/* Left: Accounts Directory List */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col min-h-0 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold shrink-0">
            <span>Directorio de Cuentas</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Selecciona una cuenta para auditar su ficha 360°
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredAccounts.map((account) => {
              const isSelected = account.id === selectedAccount?.id;

              return (
                <div
                  key={account.id}
                  onClick={() => setSelectedAccountId(account.id)}
                  className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-slate-50/80 ${
                    isSelected
                      ? 'bg-rose-50/40 border-l-4 border-[#E11D48]'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  {/* Account Logo & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={account.logo}
                      alt={account.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900 truncate">
                          {account.name}
                        </h3>

                        {/* Account Type Badge */}
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                            account.type === 'empresa'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}
                        >
                          {account.type === 'empresa' ? 'Empresa B2B' : 'Particular B2C'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 truncate">
                        <span>{account.industry}</span>
                        <span>·</span>
                        <span className="text-slate-400 flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {account.city}
                        </span>
                      </div>

                      {/* Contacts Avatars Preview */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {account.contacts.map((ct) => (
                            <img
                              key={ct.id}
                              src={ct.avatar}
                              alt={ct.name}
                              title={`${ct.name} (${ct.role})`}
                              className="w-4 h-4 rounded-full object-cover ring-1 ring-white"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {account.contacts.length} {account.contacts.length === 1 ? 'contacto' : 'contactos'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financials in Directory */}
                  <div className="hidden sm:flex flex-col items-end gap-0.5 text-right shrink-0">
                    <span className="text-[10px] font-medium text-slate-400 uppercase">
                      Ingresos (LTV)
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      ${account.lifetimeRevenue.toLocaleString()} USD
                    </span>
                    {account.totalPipelineValue > 0 && (
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded">
                        +${account.totalPipelineValue.toLocaleString()} en pipeline
                      </span>
                    )}
                  </div>

                  {/* Health status & chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      title={`Salud de cuenta: ${account.healthScore}`}
                      className={`w-2.5 h-2.5 rounded-full ${
                        account.healthScore === 'excelente'
                          ? 'bg-emerald-500'
                          : account.healthScore === 'estable'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    ></span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-[#E11D48] translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </div>
                </div>
              );
            })}

            {filteredAccounts.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No se encontraron cuentas con los filtros seleccionados.
              </div>
            )}
          </div>
        </div>

        {/* Right: Account 360° Inspector */}
        {selectedAccount && (
          <div className="w-96 xl:w-[460px] bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col min-h-0 overflow-hidden shrink-0">
            {/* Inspector Hero Header */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedAccount.logo}
                    alt={selectedAccount.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white shadow-xs shrink-0"
                  />
                  <div>
                    <h2 className="text-sm font-black text-slate-900 leading-tight">
                      {selectedAccount.name}
                    </h2>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {selectedAccount.industry}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md">
                        {selectedAccount.tier}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md capitalize ${
                          selectedAccount.status === 'activa'
                            ? 'bg-emerald-100/70 text-emerald-800'
                            : selectedAccount.status === 'potencial'
                            ? 'bg-blue-100/70 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {selectedAccount.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">LTV</span>
                  <span className="text-sm font-black text-slate-900">
                    ${selectedAccount.lifetimeRevenue.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-1.5 mt-3.5">
                {selectedAccount.website ? (
                  <a
                    href={selectedAccount.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-100 hover:text-[#E11D48] transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Web</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-1 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-400">
                    <Globe className="w-3 h-3" />
                    <span>Sin web</span>
                  </div>
                )}

                <a
                  href={`tel:${selectedAccount.phone}`}
                  className="flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-100 hover:text-[#E11D48] transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Llamar</span>
                </a>

                <a
                  href={`mailto:${selectedAccount.email}`}
                  className="flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-100 hover:text-[#E11D48] transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  <span>Correo</span>
                </a>

                <button
                  onClick={() => setIsAddContactModalOpen(true)}
                  className="flex items-center justify-center gap-1 py-1.5 bg-[#E11D48] text-white rounded-lg text-[10px] font-bold hover:bg-[#BE123C] transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Contacto</span>
                </button>
              </div>

              {/* Inspector Navigation Tabs */}
              <div className="flex border-b border-slate-200 mt-4 -mb-4 gap-4 text-xs font-bold text-slate-500 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 shrink-0 ${
                    activeTab === 'overview'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  Visión General
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 shrink-0 flex items-center gap-1 ${
                    activeTab === 'contacts'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>Contactos</span>
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full text-slate-700">
                    {selectedAccount.contacts.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 shrink-0 flex items-center gap-1 ${
                    activeTab === 'opportunities'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>Oportunidades</span>
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full text-slate-700">
                    {selectedAccount.opportunities.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 shrink-0 flex items-center gap-1 ${
                    activeTab === 'activities'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>Historial</span>
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full text-slate-700">
                    {selectedAccount.activities.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('financial')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 shrink-0 ${
                    activeTab === 'financial'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  Financiero
                </button>
              </div>
            </div>

            {/* Inspector Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: Visión General */}
              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs">
                  {/* Strategic Notes */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Enfoque Estratégico & Notas
                    </span>
                    <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-slate-700 leading-relaxed text-xs">
                      {selectedAccount.notes}
                    </div>
                  </div>

                  {/* Core Corporate Data */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          Identificador Fiscal / RFC
                        </span>
                        <span className="font-semibold text-slate-800 mt-0.5 block">
                          {selectedAccount.taxId || 'No registrado'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          Responsable Comercial
                        </span>
                        <span className="font-semibold text-slate-800 mt-0.5 block">
                          {selectedAccount.accountOwner}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Dirección Comercial
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {selectedAccount.address}, {selectedAccount.city}, {selectedAccount.country}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          Teléfono
                        </span>
                        <span className="font-semibold text-slate-800 mt-0.5 block">
                          {selectedAccount.phone}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          Correo Corporativo
                        </span>
                        <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                          {selectedAccount.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Metadata */}
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                    <span>Cliente desde:</span>
                    <span className="font-semibold text-slate-600">{selectedAccount.createdAt}</span>
                  </div>
                </div>
              )}

              {/* TAB 2: Contactos de la Cuenta */}
              {activeTab === 'contacts' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Puntos focales ({selectedAccount.contacts.length})</span>
                    <button
                      onClick={() => setIsAddContactModalOpen(true)}
                      className="text-[11px] font-bold text-[#E11D48] hover:text-[#BE123C] cursor-pointer"
                    >
                      + Añadir contacto
                    </button>
                  </div>

                  {selectedAccount.contacts.map((ct) => (
                    <div
                      key={ct.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={ct.avatar}
                          alt={ct.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{ct.name}</h4>
                            {ct.isPrimary && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded">
                                Principal
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{ct.role}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span>{ct.phone}</span>
                            <span>·</span>
                            <span className="truncate">{ct.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <a
                          href={`tel:${ct.phone}`}
                          title="Llamar"
                          className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-[#E11D48] transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                        </a>
                        <a
                          href={`mailto:${ct.email}`}
                          title="Correo"
                          className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-[#E11D48] transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}

                  {selectedAccount.contacts.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No hay contactos vinculados a esta cuenta todavía.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Oportunidades Comerciales */}
              {activeTab === 'opportunities' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Tratos comerciales activos</span>
                    <span className="text-xs font-black text-purple-700">
                      Total: ${selectedAccount.totalPipelineValue.toLocaleString()} USD
                    </span>
                  </div>

                  {selectedAccount.opportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{opp.title}</h4>
                          <p className="text-sm font-black text-slate-900 mt-0.5">{opp.amount}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md">
                          {opp.stage}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                        <span>Cierre estimado: <b className="text-slate-700">{opp.closeDate}</b></span>
                        <span className="capitalize font-bold text-emerald-600">Activa en embudo</span>
                      </div>
                    </div>
                  ))}

                  {selectedAccount.opportunities.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      Sin tratos comerciales abiertos en este momento.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Historial & Actividades */}
              {activeTab === 'activities' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Bitácora de cuenta</span>

                  <div className="relative pl-4 space-y-3.5 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {selectedAccount.activities.map((act) => (
                      <div key={act.id} className="relative">
                        <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white"></span>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">{act.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1">{act.description}</p>
                          <span className="text-[9px] font-semibold text-slate-400 mt-1 block">
                            Por: {act.user}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Resumen Financiero */}
              {activeTab === 'financial' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                        Ingresos Generados (LTV)
                      </span>
                      <span className="text-base font-black text-emerald-900 mt-1 block">
                        ${selectedAccount.lifetimeRevenue.toLocaleString()} USD
                      </span>
                      <span className="text-[9px] text-emerald-700 mt-0.5 block">Histórico facturado</span>
                    </div>

                    <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl">
                      <span className="text-[10px] font-bold text-purple-800 uppercase block">
                        Pipeline Abierto
                      </span>
                      <span className="text-base font-black text-purple-900 mt-1 block">
                        ${selectedAccount.totalPipelineValue.toLocaleString()} USD
                      </span>
                      <span className="text-[9px] text-purple-700 mt-0.5 block">Por cerrar</span>
                    </div>
                  </div>

                  {selectedAccount.mrr && (
                    <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          Ingreso Recurrente Mensual (MRR)
                        </span>
                        <span className="text-lg font-black text-white mt-0.5 block">
                          ${selectedAccount.mrr.toLocaleString()} USD/mes
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                        Suscripción Activa
                      </span>
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                    <span className="font-bold text-slate-800 block">Condiciones comerciales</span>
                    <div className="flex justify-between text-slate-500">
                      <span>Plazo de pago:</span>
                      <span className="font-semibold text-slate-800">Net 30 días</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Moneda principal:</span>
                      <span className="font-semibold text-slate-800">USD / MXN</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Estado crediticio:</span>
                      <span className="font-bold text-emerald-600">Al corriente</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Nueva Cuenta */}
      {isNewAccountOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Registrar nueva cuenta</h3>
                <p className="text-xs text-slate-400">Admite empresas (B2B) o personas particulares (B2C)</p>
              </div>
              <button
                onClick={() => setIsNewAccountOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-3.5">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de cuenta *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'empresa' })}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 ${
                      formData.type === 'empresa'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Empresa (B2B)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'particular' })}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 ${
                      formData.type === 'particular'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Persona Particular (B2C)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {formData.type === 'empresa' ? 'Nombre de la empresa *' : 'Nombre del cliente particular *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={formData.type === 'empresa' ? 'Ej. Grupo Santander' : 'Ej. Dra. Carmen Silva'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Industria / Giro *</label>
                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="Ej. Finanzas, Salud, Retail..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado de la cuenta</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    <option value="activa">Activa</option>
                    <option value="potencial">Potencial (Lead/Prospecto)</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Segmento / Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    <option value="VIP Enterprise">VIP Enterprise</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="PYME">PYME</option>
                    <option value="Particular VIP">Particular VIP</option>
                    <option value="Estándar">Estándar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@cuenta.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ej. Monterrey"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">RFC / ID Fiscal</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    placeholder="Ej. RFC o NIF"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notas estratégicas</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Detalles clave, potencial de negocio, necesidades..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewAccountOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Guardar cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Añadir Contacto a la Cuenta */}
      {isAddContactModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Vincular nuevo punto focal</h3>
                <p className="text-xs text-slate-400">Para {selectedAccount.name}</p>
              </div>
              <button
                onClick={() => setIsAddContactModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContactToAccount} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre completo *</label>
                <input
                  type="text"
                  required
                  value={newContactForm.name}
                  onChange={(e) => setNewContactForm({ ...newContactForm, name: e.target.value })}
                  placeholder="Ej. Ing. Daniel Herrera"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cargo / Posición *</label>
                <input
                  type="text"
                  required
                  value={newContactForm.role}
                  onChange={(e) => setNewContactForm({ ...newContactForm, role: e.target.value })}
                  placeholder="Ej. Director de Operaciones"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo electrónico *</label>
                  <input
                    type="email"
                    required
                    value={newContactForm.email}
                    onChange={(e) => setNewContactForm({ ...newContactForm, email: e.target.value })}
                    placeholder="daniel@empresa.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newContactForm.phone}
                    onChange={(e) => setNewContactForm({ ...newContactForm, phone: e.target.value })}
                    placeholder="+52 55..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPrimaryContact"
                  checked={newContactForm.isPrimary}
                  onChange={(e) => setNewContactForm({ ...newContactForm, isPrimary: e.target.checked })}
                  className="w-4 h-4 text-[#E11D48] rounded border-slate-300 focus:ring-[#E11D48] cursor-pointer"
                />
                <label htmlFor="isPrimaryContact" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Marcar como punto focal principal de la cuenta
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddContactModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Vincular contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
