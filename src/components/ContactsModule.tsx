import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Building2,
  Calendar,
  Tag,
  FileText,
  Clock,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  X,
  PhoneCall,
  Video,
  Copy,
  Edit3
} from 'lucide-react';
import {
  Contact,
  INITIAL_CONTACTS,
  ContactInteraction,
  ContactOpportunity,
  ContactEvent
} from '../data/contactsData';

export const ContactsModule: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedContactId, setSelectedContactId] = useState<string>(INITIAL_CONTACTS[0].id);
  const [activeTab, setActiveTab] = useState<'info' | 'interactions' | 'opportunities' | 'calendar'>('info');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [accountFilter, setAccountFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  // Modals
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [isNewInteractionOpen, setIsNewInteractionOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Form states for new contact
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    email: '',
    primaryPhone: '',
    secondaryPhone: '',
    account: '',
    tags: '',
    notes: '',
    status: 'active' as const
  });

  // Form state for new interaction
  const [interactionForm, setInteractionForm] = useState({
    type: 'call' as 'call' | 'email' | 'meeting' | 'note',
    title: '',
    description: ''
  });

  // Form state for scheduling
  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    type: 'meeting' as 'meeting' | 'call',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    platform: 'Google Meet',
    notes: ''
  });

  // Unique accounts & tags for filter options
  const uniqueAccounts = useMemo(() => {
    return Array.from(new Set(contacts.map((c) => c.account)));
  }, [contacts]);

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    contacts.forEach((c) => c.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [contacts]);

  // Filtered contacts list
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.primaryPhone.includes(searchQuery);

      const matchesAccount = accountFilter === 'all' || c.account === accountFilter;
      const matchesTag = tagFilter === 'all' || c.tags.includes(tagFilter);

      return matchesSearch && matchesAccount && matchesTag;
    });
  }, [contacts, searchQuery, accountFilter, tagFilter]);

  const selectedContact = useMemo(() => {
    return contacts.find((c) => c.id === selectedContactId) || contacts[0];
  }, [contacts, selectedContactId]);

  // Handle adding contact
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.account) return;

    const newContact: Contact = {
      id: `ct-${Date.now()}`,
      fullName: formData.fullName,
      role: formData.role || 'Punto Focal',
      email: formData.email,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone,
      account: formData.account,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Nuevo'],
      notes: formData.notes || 'Sin notas registradas.',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50000)}?w=120&h=120&fit=crop&crop=faces`,
      status: formData.status,
      createdAt: 'Hoy',
      interactions: [
        {
          id: `int-${Date.now()}`,
          type: 'note',
          title: 'Contacto creado en el directorio',
          date: 'Hoy',
          description: 'Alta de persona natural vinculada a la cuenta ' + formData.account,
          user: 'Ana Torres'
        }
      ],
      opportunities: [],
      upcomingEvents: []
    };

    setContacts([newContact, ...contacts]);
    setSelectedContactId(newContact.id);
    setIsNewContactOpen(false);
    setFormData({
      fullName: '',
      role: '',
      email: '',
      primaryPhone: '',
      secondaryPhone: '',
      account: '',
      tags: '',
      notes: '',
      status: 'active'
    });
  };

  // Handle adding interaction
  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactionForm.title || !selectedContact) return;

    const newInt: ContactInteraction = {
      id: `int-${Date.now()}`,
      type: interactionForm.type,
      title: interactionForm.title,
      date: 'Justo ahora',
      description: interactionForm.description || 'Interacción registrada con éxito.',
      user: 'Ana Torres'
    };

    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id
          ? { ...c, interactions: [newInt, ...c.interactions] }
          : c
      )
    );

    setIsNewInteractionOpen(false);
    setInteractionForm({ type: 'call', title: '', description: '' });
  };

  // Handle scheduling event
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.title || !selectedContact) return;

    const newEvent: ContactEvent = {
      id: `ev-${Date.now()}`,
      title: scheduleForm.title,
      date: scheduleForm.date,
      time: scheduleForm.time,
      type: scheduleForm.type
    };

    const autoInteraction: ContactInteraction = {
      id: `int-${Date.now()}`,
      type: scheduleForm.type === 'call' ? 'call' : 'meeting',
      title: `Compromiso agendado: ${scheduleForm.title}`,
      date: 'Justo ahora',
      description: `Programado para ${scheduleForm.date} a las ${scheduleForm.time} vía ${scheduleForm.platform}. ${scheduleForm.notes ? `Notas: ${scheduleForm.notes}` : ''}`,
      user: 'Ana Torres'
    };

    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id
          ? {
              ...c,
              upcomingEvents: [newEvent, ...c.upcomingEvents],
              interactions: [autoInteraction, ...c.interactions]
            }
          : c
       )
    );

    setIsScheduleModalOpen(false);
    setActiveTab('calendar');
    setScheduleForm({
      title: '',
      type: 'meeting',
      date: new Date().toISOString().split('T')[0],
      time: '11:00',
      platform: 'Google Meet',
      notes: ''
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#F8FAFC] overflow-hidden">
      {/* Module Header & Toolbar */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-3 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-[#E11D48] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 tracking-tight">Contactos</h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                {contacts.length} registrados
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Directorio central de personas naturales y puntos focales asociados a tus cuentas
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, correo o cuenta..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
            />
          </div>

          {/* Account Filter */}
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
          >
            <option value="all">Todas las cuentas</option>
            {uniqueAccounts.map((acc) => (
              <option key={acc} value={acc}>
                {acc}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
          >
            <option value="all">Todas las etiquetas</option>
            {uniqueTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* New Contact Button */}
          <button
            onClick={() => setIsNewContactOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Nuevo contacto</span>
          </button>
        </div>
      </div>

      {/* Main Split Body (Directory + Inspector) */}
      <div className="flex-1 flex min-h-0 overflow-hidden p-3 gap-3">
        {/* Left: Contact Directory List (Table/Grid) */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col min-h-0 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold shrink-0">
            <span>Directorio ({filteredContacts.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Haz clic en cualquier contacto para ver su ficha completa
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredContacts.map((contact) => {
              const isSelected = contact.id === selectedContact?.id;

              return (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-slate-50/80 ${
                    isSelected
                      ? 'bg-rose-50/50 border-l-4 border-[#E11D48]'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  {/* Avatar & Main Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.fullName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                          contact.status === 'active'
                            ? 'bg-emerald-500'
                            : contact.status === 'lead'
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`}
                      ></span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900 truncate">
                          {contact.fullName}
                        </h3>
                        {contact.tags.slice(0, 1).map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-extrabold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {contact.role}
                      </p>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 truncate">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700">{contact.account}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Channels */}
                  <div className="hidden lg:flex flex-col items-start gap-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {contact.email}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {contact.primaryPhone}
                    </span>
                  </div>

                  {/* Right Tags & Arrow */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex gap-1">
                      {contact.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-[#E11D48] translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </div>
                </div>
              );
            })}

            {filteredContacts.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No se encontraron contactos con los filtros seleccionados.
              </div>
            )}
          </div>
        </div>

        {/* Right: Contact Detail Inspector (Ficha de Contacto) */}
        {selectedContact && (
          <div className="w-96 xl:w-[450px] bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col min-h-0 overflow-hidden shrink-0">
            {/* Inspector Hero Header */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.fullName}
                    className="w-13 h-13 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0"
                  />
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {selectedContact.fullName}
                    </h2>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {selectedContact.role}
                    </p>
                    <p className="text-[11px] font-bold text-[#E11D48] mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {selectedContact.account}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full capitalize ${
                    selectedContact.status === 'active'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {selectedContact.status}
                </span>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mt-3.5">
                <a
                  href={`tel:${selectedContact.primaryPhone}`}
                  className="flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-100 hover:text-[#E11D48] transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Llamar</span>
                </a>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-100 hover:text-[#E11D48] transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  <span>Correo</span>
                </a>
                <button
                  onClick={() => setIsNewInteractionOpen(true)}
                  className="flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-100 hover:text-[#E11D48] transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Nota</span>
                </button>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="flex items-center justify-center gap-1 py-1.5 bg-[#E11D48] text-white rounded-lg text-[10px] font-bold hover:bg-[#BE123C] transition-colors cursor-pointer"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Agendar</span>
                </button>
              </div>

              {/* Inspector Navigation Tabs */}
              <div className="flex border-b border-slate-200 mt-4 -mb-4 gap-4 text-xs font-bold text-slate-500">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'info'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  General
                </button>
                <button
                  onClick={() => setActiveTab('interactions')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1 ${
                    activeTab === 'interactions'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>Historial</span>
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full text-slate-700">
                    {selectedContact.interactions.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1 ${
                    activeTab === 'opportunities'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>Oportunidades</span>
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full text-slate-700">
                    {selectedContact.opportunities.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1 ${
                    activeTab === 'calendar'
                      ? 'border-[#E11D48] text-[#E11D48]'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <span>Calendario</span>
                  {selectedContact.upcomingEvents.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Inspector Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: General Info */}
              {activeTab === 'info' && (
                <div className="space-y-4 text-xs">
                  {/* Channels & Phones */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                        Correo electrónico
                      </span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-semibold text-slate-800">{selectedContact.email}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(selectedContact.email)}
                          title="Copiar correo"
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                          Teléfono principal
                        </span>
                        <span className="font-semibold text-slate-800 block mt-0.5">
                          {selectedContact.primaryPhone}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                          Teléfono secundario
                        </span>
                        <span className="font-semibold text-slate-800 block mt-0.5">
                          {selectedContact.secondaryPhone || 'No asignado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1.5">
                      Etiquetas del contacto
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedContact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-bold px-2.5 py-1 bg-rose-50 text-[#E11D48] rounded-lg border border-rose-100"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notes of Interest */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Notas de interés
                      </span>
                    </div>
                    <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-slate-700 leading-relaxed text-xs">
                      {selectedContact.notes}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                    <span>Fecha de registro:</span>
                    <span className="font-semibold text-slate-600">{selectedContact.createdAt}</span>
                  </div>
                </div>
              )}

              {/* TAB 2: Interactions Timeline */}
              {activeTab === 'interactions' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Bitácora de interacciones</span>
                    <button
                      onClick={() => setIsNewInteractionOpen(true)}
                      className="text-[11px] font-bold text-[#E11D48] hover:text-[#BE123C] cursor-pointer"
                    >
                      + Registrar acción
                    </button>
                  </div>

                  <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {selectedContact.interactions.map((int) => (
                      <div key={int.id} className="relative group">
                        <span className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-[#E11D48] ring-4 ring-white"></span>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 group-hover:bg-slate-100/70 transition-colors">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800">{int.title}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">{int.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1">{int.description}</p>
                          <span className="text-[9px] font-semibold text-slate-400 mt-1 block">
                            Por: {int.user}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Linked Opportunities */}
              {activeTab === 'opportunities' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Oportunidades comerciales</span>
                    <span className="text-[10px] text-slate-400">
                      Enlazadas con el Pipeline
                    </span>
                  </div>

                  {selectedContact.opportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-[#E11D48]/40 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{opp.title}</h4>
                          <p className="text-sm font-black text-slate-900 mt-0.5">{opp.amount}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-[#E11D48] rounded">
                          {opp.stage}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                        <span>Estado: <b className="text-slate-800">Abierta</b></span>
                        <button className="text-[#E11D48] font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                          <span>Ver en pipeline</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {selectedContact.opportunities.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No hay oportunidades activas asociadas a este contacto.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Calendar / Upcoming Events */}
              {activeTab === 'calendar' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Próximos compromisos</span>
                    <button
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="text-[11px] font-bold text-[#E11D48] hover:text-[#BE123C] cursor-pointer"
                    >
                      + Agendar cita
                    </button>
                  </div>

                  {selectedContact.upcomingEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          {ev.type === 'meeting' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {ev.date} a las {ev.time}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Confirmado
                      </span>
                    </div>
                  ))}

                  {selectedContact.upcomingEvents.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      Sin citas ni llamadas programadas con este contacto.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Nuevo Contacto */}
      {isNewContactOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Registrar nuevo contacto</h3>
                <p className="text-xs text-slate-400">Directorio central de personas y puntos focales</p>
              </div>
              <button
                onClick={() => setIsNewContactOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. Roberto Sánchez"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cargo / Puesto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Ej. Director de Finanzas"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cuenta asociada (Empresa) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                    placeholder="Ej. Grupo Innovar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="roberto@empresa.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono principal *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.primaryPhone}
                    onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono secundario
                  </label>
                  <input
                    type="tel"
                    value={formData.secondaryPhone}
                    onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                    placeholder="Extensión u oficina"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Ej. Decisor, VIP, Compras"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas de interés
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Preferencias de contacto, horarios, intereses del cliente..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewContactOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Guardar contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Interacción */}
      {isNewInteractionOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Registrar interacción</h3>
              <button
                onClick={() => setIsNewInteractionOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInteraction} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de acción</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'call', label: 'Llamada' },
                    { id: 'meeting', label: 'Reunión' },
                    { id: 'email', label: 'Correo' },
                    { id: 'note', label: 'Nota' }
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setInteractionForm({ ...interactionForm, type: t.id as any })}
                      className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        interactionForm.type === t.id
                          ? 'bg-[#E11D48] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título o motivo</label>
                <input
                  type="text"
                  required
                  value={interactionForm.title}
                  onChange={(e) => setInteractionForm({ ...interactionForm, title: e.target.value })}
                  placeholder="Ej. Llamada de seguimiento de presupuesto"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detalles / Acuerdos</label>
                <textarea
                  rows={3}
                  value={interactionForm.description}
                  onChange={(e) => setInteractionForm({ ...interactionForm, description: e.target.value })}
                  placeholder="Resumen de los temas tratados y próximos pasos..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewInteractionOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agendar Compromiso / Cita */}
      {isScheduleModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-[#E11D48] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">Agendar compromiso</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Con {selectedContact.fullName} · {selectedContact.account}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de compromiso</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleForm({ ...scheduleForm, type: 'meeting' })}
                    className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      scheduleForm.type === 'meeting'
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Reunión / Demo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleForm({ ...scheduleForm, type: 'call' })}
                    className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      scheduleForm.type === 'call'
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Llamada de seguimiento</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título o motivo de la cita *</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  placeholder="Ej. Presentación de solución y cotización"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hora *</label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Canal / Medio</label>
                <select
                  value={scheduleForm.platform}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, platform: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                >
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Llamada celular">Llamada celular directa</option>
                  <option value="Oficinas del cliente">Presencial en oficinas del cliente</option>
                  <option value="Nuestras oficinas">Presencial en nuestras oficinas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notas previas o agenda</label>
                <textarea
                  rows={2}
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  placeholder="Temas a revisar, participantes adicionales, requerimientos..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Guardar en calendario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
