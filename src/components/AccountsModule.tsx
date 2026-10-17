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
  Calendar,
  Layers,
  Paperclip,
  Eye,
  Upload,
  FileSpreadsheet,
  FileCheck,
  File,
  Check,
  Camera,
  Folder,
  ArrowRight,
  Trash2
} from 'lucide-react';
import {
  Account,
  INITIAL_ACCOUNTS,
  AccountContactItem,
  AccountOpportunityItem,
  AccountActivityItem,
  AccountContractedService,
  AccountDocument
} from '../data/accountsData';

export const AccountsModule: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(INITIAL_ACCOUNTS[0].id);

  // 5 Core Internal Structure Tabs + Opportunities
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'services' | 'activities' | 'documents' | 'opportunities'>('overview');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'empresa' | 'particular'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activa' | 'potencial' | 'inactiva'>('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Modals
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<AccountDocument | null>(null);

  // Document Repository Filters
  const [docCategoryFilter, setDocCategoryFilter] = useState<string>('all');
  const [docSearchQuery, setDocSearchQuery] = useState<string>('');

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

  // New Service Form State
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Software & Cloud' as AccountContractedService['category'],
    billingCycle: 'Mensual' as AccountContractedService['billingCycle'],
    cost: '$1,500 USD / mes',
    rawCost: 1500,
    startDate: new Date().toISOString().split('T')[0],
    renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'activo' as AccountContractedService['status']
  });

  // New Document Form State
  const [documentForm, setDocumentForm] = useState({
    name: '',
    category: 'Contrato' as AccountDocument['category'],
    size: '1.5 MB',
    fileType: 'pdf' as AccountDocument['fileType']
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
      ],
      services: [],
      documents: []
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

  // Handle Account Logo / Profile Upload
  const handleAccountLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAccount) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG o WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === selectedAccount.id ? { ...acc, logo: dataUrl } : acc
          )
        );
      }
    };
    reader.readAsDataURL(file);
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

  // Handle Add Service to Account
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name || !selectedAccount) return;

    const newSrv: AccountContractedService = {
      id: `srv-${Date.now()}`,
      name: serviceForm.name,
      category: serviceForm.category,
      billingCycle: serviceForm.billingCycle,
      cost: serviceForm.cost,
      rawCost: serviceForm.rawCost,
      startDate: serviceForm.startDate,
      renewalDate: serviceForm.renewalDate,
      status: serviceForm.status
    };

    const newActivity: AccountActivityItem = {
      id: `act-${Date.now()}`,
      date: 'Hoy',
      type: 'contract',
      title: `Servicio contratado: ${serviceForm.name}`,
      description: `Plan ${serviceForm.billingCycle} (${serviceForm.cost}). Renovación: ${serviceForm.renewalDate}`,
      user: 'Ana Torres'
    };

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === selectedAccount.id
          ? {
              ...acc,
              services: [...(acc.services || []), newSrv],
              activities: [newActivity, ...acc.activities],
              mrr: serviceForm.billingCycle === 'Mensual' ? (acc.mrr || 0) + serviceForm.rawCost : acc.mrr
            }
          : acc
      )
    );

    setIsAddServiceModalOpen(false);
    setServiceForm({
      name: '',
      category: 'Software & Cloud',
      billingCycle: 'Mensual',
      cost: '$1,500 USD / mes',
      rawCost: 1500,
      startDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'activo'
    });
  };

  // Handle Add Document to Account
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentForm.name || !selectedAccount) return;

    const newDoc: AccountDocument = {
      id: `doc-${Date.now()}`,
      name: documentForm.name.endsWith('.pdf') ? documentForm.name : `${documentForm.name}.${documentForm.fileType}`,
      category: documentForm.category,
      size: documentForm.size || '1.2 MB',
      uploadedAt: 'Hoy',
      uploadedBy: 'Ana Torres',
      fileType: documentForm.fileType
    };

    const newActivity: AccountActivityItem = {
      id: `act-${Date.now()}`,
      date: 'Hoy',
      type: 'contract',
      title: `Documento adjunto: ${newDoc.name}`,
      description: `Archivo ${newDoc.category} subido al expediente comercial.`,
      user: 'Ana Torres'
    };

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === selectedAccount.id
          ? {
              ...acc,
              documents: [...(acc.documents || []), newDoc],
              activities: [newActivity, ...acc.activities]
            }
          : acc
      )
    );

    setIsAddDocumentModalOpen(false);
    setDocumentForm({
      name: '',
      category: 'Contrato',
      size: '1.5 MB',
      fileType: 'pdf'
    });
  };

  // Handle Delete Document
  const handleDeleteDocument = (docId: string) => {
    if (!selectedAccount) return;
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === selectedAccount.id
          ? {
              ...acc,
              documents: acc.documents.filter((d) => d.id !== docId),
            }
          : acc
      )
    );
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
                Gestión integral de empresas y personas particulares con analíticas, servicios y expediente
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
              Selecciona una cuenta para auditar su estructura interna completa
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

                      {/* Contacts, Services & Docs Preview */}
                      <div className="flex items-center gap-2.5 mt-1 text-[10px] text-slate-400 font-medium flex-wrap">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          {account.contacts.length} contactos
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                          <Layers className="w-3 h-3" />
                          {account.services?.length || 0} servicios
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-600 font-semibold">
                          <FileText className="w-3 h-3 text-rose-500" />
                          {account.documents?.length || 0} docs
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
          <div className="w-96 xl:w-[480px] bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col min-h-0 overflow-hidden shrink-0">
            {/* Inspector Hero Header */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <label
                    className="relative group cursor-pointer shrink-0"
                    title="Haz clic para subir o cambiar logotipo de la cuenta"
                  >
                    <img
                      src={selectedAccount.logo}
                      alt={selectedAccount.name}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white shadow-xs group-hover:ring-[#E11D48] transition-all"
                    />
                    <div className="absolute inset-0 bg-black/45 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold">
                      <Camera className="w-4 h-4 mb-0.5" />
                      <span>Cambiar</span>
                    </div>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={handleAccountLogoUpload}
                    />
                  </label>
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
              <div className="grid grid-cols-5 gap-1.5 mt-3.5">
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
                  onClick={() => setActiveTab('documents')}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border ${
                    activeTab === 'documents'
                      ? 'bg-rose-50 border-rose-200 text-[#E11D48]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-[#E11D48]'
                  }`}
                  title="Abrir repositorio de documentos de la cuenta"
                >
                  <Folder className="w-3 h-3 text-rose-500" />
                  <span>Expediente</span>
                </button>

                <button
                  onClick={() => setIsAddContactModalOpen(true)}
                  className="flex items-center justify-center gap-1 py-1.5 bg-[#E11D48] text-white rounded-lg text-[10px] font-bold hover:bg-[#BE123C] transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Contacto</span>
                </button>
              </div>

              {/* Inspector Navigation Tabs (Estructura Interna) */}
              <div className="flex border-b border-slate-200 mt-4 -mb-4 gap-3 text-xs font-bold text-slate-500 overflow-x-auto pb-0.5">
                {/* 1. Información General */}
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 shrink-0 ${
                    activeTab === 'overview'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  Información
                </button>

                {/* 2. Directorio de Contactos */}
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

                {/* 3. Servicios Contratados */}
                <button
                  onClick={() => setActiveTab('services')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 shrink-0 flex items-center gap-1 ${
                    activeTab === 'services'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>Servicios</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-1.5 py-0.2 rounded-full">
                    {selectedAccount.services?.length || 0}
                  </span>
                </button>

                {/* 4. Historial de Actividades */}
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 shrink-0 flex items-center gap-1 ${
                    activeTab === 'activities'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>Actividades</span>
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full text-slate-700">
                    {selectedAccount.activities.length}
                  </span>
                </button>

                {/* 5. Documentos Adjuntos / Repositorio */}
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 shrink-0 flex items-center gap-1.5 ${
                    activeTab === 'documents'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <Folder className={`w-3.5 h-3.5 ${activeTab === 'documents' ? 'text-[#E11D48]' : 'text-slate-400'}`} />
                  <span>Expediente / Docs</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'documents' ? 'bg-rose-100 text-[#E11D48]' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedAccount.documents?.length || 0}
                  </span>
                </button>

                {/* Oportunidades & Finanzas */}
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 shrink-0 flex items-center gap-1 ${
                    activeTab === 'opportunities'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>Finanzas</span>
                </button>
              </div>
            </div>

            {/* Inspector Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* ESTRUCTURA 1: Información General */}
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

                  {/* Expediente Digital / Repositorio Documental Card Preview */}
                  <div className="bg-gradient-to-br from-slate-50 to-rose-50/20 p-3.5 rounded-xl border border-slate-200/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-rose-100 text-[#E11D48] flex items-center justify-center shrink-0">
                          <Folder className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Expediente Documental</h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {selectedAccount.documents?.length || 0} archivos custodiados en la cuenta
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('documents')}
                        className="text-[11px] font-bold text-[#E11D48] hover:text-[#BE123C] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Abrir expediente</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {selectedAccount.documents && selectedAccount.documents.length > 0 ? (
                      <div className="space-y-1.5">
                        {selectedAccount.documents.slice(0, 3).map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200/70 hover:border-rose-200 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="text-xs font-medium text-slate-700 truncate">{doc.name}</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold shrink-0">
                                {doc.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                title="Previsualizar"
                                className="p-1 text-slate-400 hover:text-[#E11D48] cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => alert(`Descargando archivo: ${doc.name}`)}
                                title="Descargar"
                                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-2.5 text-center text-[11px] text-slate-400 bg-white rounded-lg border border-dashed border-slate-200">
                        No hay documentos cargados aún en esta cuenta.
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <button
                        onClick={() => setIsAddDocumentModalOpen(true)}
                        className="text-[11px] font-bold text-slate-700 hover:text-[#E11D48] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#E11D48]" />
                        <span>Subir nuevo archivo</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('documents')}
                        className="text-[10px] text-slate-500 font-semibold hover:underline cursor-pointer"
                      >
                        Ver todos los {selectedAccount.documents?.length || 0} archivos &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Account Metadata */}
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                    <span>Cliente desde:</span>
                    <span className="font-semibold text-slate-600">{selectedAccount.createdAt}</span>
                  </div>
                </div>
              )}

              {/* ESTRUCTURA 2: Directorio de Contactos Relacionados */}
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
                          href={`https://wa.me/${ct.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${ct.name}, me comunico desde Katapult Marketing Studio.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Enviar WhatsApp"
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-700 transition-colors"
                        >
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                          </svg>
                        </a>
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

              {/* ESTRUCTURA 3: Servicios Contratados */}
              {activeTab === 'services' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">Servicios y Licencias Activas</span>
                      <p className="text-[10px] text-slate-400">Contratos recurrentes y módulos en producción</p>
                    </div>
                    <button
                      onClick={() => setIsAddServiceModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E11D48] hover:text-[#BE123C] cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Contratar servicio</span>
                    </button>
                  </div>

                  {selectedAccount.services && selectedAccount.services.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-indigo-200 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-extrabold text-slate-900">{srv.name}</h4>
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded capitalize ${
                                srv.status === 'activo'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : srv.status === 'en_renovacion'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {srv.status === 'activo' ? 'Activo' : srv.status === 'en_renovacion' ? 'Por Renovar' : 'Finalizado'}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {srv.category} · Plan {srv.billingCycle}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900">{srv.cost}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
                        <span>Inicio: <b className="text-slate-600">{srv.startDate}</b></span>
                        <span>Próxima renovación: <b className="text-indigo-600">{srv.renewalDate}</b></span>
                      </div>
                    </div>
                  ))}

                  {(!selectedAccount.services || selectedAccount.services.length === 0) && (
                    <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <Layers className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                      <p className="font-semibold">Sin servicios contratados actualmente</p>
                      <p className="text-[11px] mt-0.5">Haz clic en "Contratar servicio" para dar de alta una licencia o plan.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ESTRUCTURA 4: Historial de Actividades */}
              {activeTab === 'activities' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Bitácora Integral de la Cuenta</span>
                    <span className="text-[10px] text-slate-400">{selectedAccount.activities.length} registros</span>
                  </div>

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

              {/* ESTRUCTURA 5: Repositorio & Expediente Digital */}
              {activeTab === 'documents' && (
                <div className="space-y-3.5">
                  {/* Repository Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Folder className="w-4 h-4 text-[#E11D48]" />
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                          Repositorio & Expediente Digital
                        </span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-rose-50 text-[#E11D48] rounded-full border border-rose-100">
                          {selectedAccount.documents?.length || 0} archivos
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Custodia de contratos, actas, constancias fiscales del SAT y cotizaciones oficiales.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddDocumentModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-[11px] font-bold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir documento</span>
                    </button>
                  </div>

                  {/* Repository Search & Category Filter Toolbar */}
                  <div className="space-y-2">
                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={docSearchQuery}
                        onChange={(e) => setDocSearchQuery(e.target.value)}
                        placeholder="Buscar archivo por nombre, tipo o autor..."
                        className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#E11D48] transition-all"
                      />
                      {docSearchQuery && (
                        <button
                          onClick={() => setDocSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                      {[
                        { id: 'all', label: 'Todos' },
                        { id: 'Contrato', label: 'Contratos' },
                        { id: 'Fiscal / SAT', label: 'Fiscal / SAT' },
                        { id: 'Cotización', label: 'Cotizaciones' },
                        { id: 'Legal', label: 'Legal' },
                        { id: 'Otro', label: 'Otros' }
                      ].map((tab) => {
                        const count =
                          tab.id === 'all'
                            ? selectedAccount.documents?.length || 0
                            : (selectedAccount.documents || []).filter((d) =>
                                d.category.toLowerCase().includes(tab.id.toLowerCase())
                              ).length;

                        return (
                          <button
                            key={tab.id}
                            onClick={() => setDocCategoryFilter(tab.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                              docCategoryFilter === tab.id
                                ? 'bg-slate-900 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            <span>{tab.label}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                                docCategoryFilter === tab.id
                                  ? 'bg-white/20 text-white'
                                  : 'bg-white text-slate-500 border border-slate-200/60'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Documents List */}
                  {(() => {
                    const filteredDocs = (selectedAccount.documents || []).filter((doc) => {
                      const matchesCat =
                        docCategoryFilter === 'all' ||
                        doc.category.toLowerCase().includes(docCategoryFilter.toLowerCase());
                      const matchesSearch =
                        !docSearchQuery.trim() ||
                        doc.name.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
                        doc.category.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
                        (doc.uploadedBy && doc.uploadedBy.toLowerCase().includes(docSearchQuery.toLowerCase()));
                      return matchesCat && matchesSearch;
                    });

                    if (filteredDocs.length === 0) {
                      return (
                        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                          <Paperclip className="w-7 h-7 mx-auto text-slate-300" />
                          <p className="text-xs font-bold text-slate-700">
                            {docSearchQuery || docCategoryFilter !== 'all'
                              ? 'No se encontraron documentos con este criterio'
                              : 'No hay documentos en el expediente de esta cuenta'}
                          </p>
                          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                            {docSearchQuery || docCategoryFilter !== 'all'
                              ? 'Prueba modificando el texto de búsqueda o cambiando el filtro de categoría.'
                              : 'Agrega contratos firmados, constancias de situación fiscal o cotizaciones para mantener el expediente al día.'}
                          </p>
                          {docSearchQuery || docCategoryFilter !== 'all' ? (
                            <button
                              onClick={() => {
                                setDocSearchQuery('');
                                setDocCategoryFilter('all');
                              }}
                              className="mt-2 text-xs font-bold text-[#E11D48] hover:underline cursor-pointer"
                            >
                              Restablecer filtros
                            </button>
                          ) : (
                            <button
                              onClick={() => setIsAddDocumentModalOpen(true)}
                              className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-[#E11D48] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#BE123C]"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Subir primer documento</span>
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        {filteredDocs.map((doc) => {
                          const isContract = doc.category.toLowerCase().includes('contrato');
                          const isFiscal = doc.category.toLowerCase().includes('fiscal');
                          const isQuote = doc.category.toLowerCase().includes('cotiza');
                          const isLegal = doc.category.toLowerCase().includes('legal');

                          const categoryBadgeColor = isContract
                            ? 'bg-rose-50 text-[#E11D48] border-rose-100'
                            : isFiscal
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : isQuote
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : isLegal
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200';

                          return (
                            <div
                              key={doc.id}
                              className="p-3 bg-white rounded-xl border border-slate-200/90 hover:border-rose-200 hover:shadow-2xs transition-all flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  {doc.fileType === 'xlsx' || doc.name.endsWith('.xlsx') ? (
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                  ) : isContract ? (
                                    <FileCheck className="w-4 h-4 text-[#E11D48]" />
                                  ) : isFiscal ? (
                                    <FileText className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <File className="w-4 h-4 text-slate-600" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#E11D48] transition-colors">
                                      {doc.name}
                                    </h4>
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border shrink-0 ${categoryBadgeColor}`}
                                    >
                                      {doc.category}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                    <span className="font-semibold text-slate-600">{doc.size}</span>
                                    <span>·</span>
                                    <span>Subido el {doc.uploadedAt}</span>
                                    <span>·</span>
                                    <span>Por {doc.uploadedBy}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => setPreviewDoc(doc)}
                                  title="Previsualizar documento"
                                  className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 rounded-lg text-slate-600 hover:text-[#E11D48] transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => alert(`Descargando archivo: ${doc.name}`)}
                                  title="Descargar documento"
                                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`¿Estás seguro de eliminar el documento "${doc.name}" del expediente?`)) {
                                      handleDeleteDocument(doc.id);
                                    }
                                  }}
                                  title="Eliminar documento del expediente"
                                  className="p-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Oportunidades & Finanzas */}
              {activeTab === 'opportunities' && (
                <div className="space-y-4">
                  {/* Tratos Comerciales */}
                  <div className="space-y-2.5">
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
                      <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                        Sin tratos comerciales abiertos en este momento.
                      </div>
                    )}
                  </div>

                  {/* Resumen Financiero LTV / MRR */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700 block">Indicadores Financieros</span>
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

      {/* Modal: Contratar / Agregar Servicio */}
      {isAddServiceModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Agregar servicio contratado</h3>
                  <p className="text-xs text-slate-400">Para {selectedAccount.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del servicio o plan *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="Ej. Katapult ERP Enterprise (25 Licencias)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    <option value="Software & Cloud">Software & Cloud</option>
                    <option value="Consultoría">Consultoría</option>
                    <option value="Soporte & SLA">Soporte & SLA</option>
                    <option value="Marketing & Leads">Marketing & Leads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciclo de facturación</label>
                  <select
                    value={serviceForm.billingCycle}
                    onChange={(e) => setServiceForm({ ...serviceForm, billingCycle: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    <option value="Mensual">Mensual</option>
                    <option value="Anual">Anual</option>
                    <option value="Pago único">Pago único</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tarifa comercial *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.cost}
                    onChange={(e) => setServiceForm({ ...serviceForm, cost: e.target.value })}
                    placeholder="Ej. $2,500 USD / mes"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado</label>
                  <select
                    value={serviceForm.status}
                    onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    <option value="activo">Activo</option>
                    <option value="en_renovacion">En renovación</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de inicio</label>
                  <input
                    type="date"
                    required
                    value={serviceForm.startDate}
                    onChange={(e) => setServiceForm({ ...serviceForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de renovación</label>
                  <input
                    type="date"
                    required
                    value={serviceForm.renewalDate}
                    onChange={(e) => setServiceForm({ ...serviceForm, renewalDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddServiceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Registrar servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Subir / Adjuntar Documento */}
      {isAddDocumentModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Adjuntar documento</h3>
                  <p className="text-xs text-slate-400">Expediente de {selectedAccount.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddDocumentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del archivo *</label>
                <input
                  type="text"
                  required
                  value={documentForm.name}
                  onChange={(e) => setDocumentForm({ ...documentForm, name: e.target.value })}
                  placeholder="Ej. Contrato_Servicios_Firmado_2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de documento</label>
                  <select
                    value={documentForm.category}
                    onChange={(e) => setDocumentForm({ ...documentForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    <option value="Contrato">Contrato Comercial</option>
                    <option value="Fiscal">Constancia Fiscal / RFC</option>
                    <option value="Cotización">Cotización / Propuesta</option>
                    <option value="Legal">Legal / NDA</option>
                    <option value="Técnico">Técnico / SLA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Formato</label>
                  <select
                    value={documentForm.fileType}
                    onChange={(e) => setDocumentForm({ ...documentForm, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  >
                    <option value="pdf">Documento PDF (.pdf)</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                  </select>
                </div>
              </div>

              {/* Drag and Drop Box Simulation */}
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/70 hover:bg-slate-100/50 transition-colors cursor-pointer">
                <Paperclip className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700 block">Arrastra el archivo aquí o haz clic para explorar</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Formatos permitidos: PDF, DOCX, XLSX (Hasta 25 MB)</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDocumentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Adjuntar al expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Previsualización de Documento */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-xs">{previewDoc.name}</h3>
                  <p className="text-[11px] text-slate-400">{previewDoc.category} · {previewDoc.size}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Document Preview Area */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-3">
              <div className="w-16 h-20 bg-white border border-slate-200 rounded-lg shadow-xs mx-auto flex flex-col items-center justify-center p-2">
                <FileText className="w-8 h-8 text-[#E11D48]" />
                <span className="text-[9px] font-bold text-slate-500 uppercase mt-1">PDF</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                Documento validado y archivado en el expediente de {selectedAccount.name}
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Subido el {previewDoc.uploadedAt} por {previewDoc.uploadedBy}. Integridad digital verificada.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert(`Descargando ${previewDoc.name}`);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar archivo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
