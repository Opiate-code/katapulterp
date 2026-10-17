import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  PhoneCall,
  CheckSquare,
  Mail,
  Presentation,
  FileCheck,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download,
  CalendarDays,
  ListFilter,
  User,
  Building2,
  Target,
  ArrowRight,
  Check,
  X,
  MapPin,
  Flame,
  AlertTriangle
} from 'lucide-react';
import {
  Activity,
  ActivityType,
  ActivityPriority,
  INITIAL_ACTIVITIES,
  ACTIVITY_TYPE_CONFIG,
  PRIORITY_CONFIG,
  generateGoogleCalendarUrl,
  downloadActivityIcs,
} from '../data/activitiesData';

interface ActivitiesModuleProps {
  onNavigateToAccount?: (accountName: string) => void;
  onNavigateToOpportunities?: () => void;
}

export const ActivitiesModule: React.FC<ActivitiesModuleProps> = ({
  onNavigateToAccount,
  onNavigateToOpportunities,
}) => {
  // Main state
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [viewMode, setViewMode] = useState<'agenda' | 'calendario'>('agenda');
  const [activeTab, setActiveTab] = useState<'todas' | 'hoy' | 'vencidas' | 'proximas' | 'completadas'>('todas');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedPriority, setSelectedPriority] = useState<string>('todas');
  const [selectedOwner, setSelectedOwner] = useState<string>('todos');

  // Inspector & Modal state
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);
  const [completionNotesPromptId, setCompletionNotesPromptId] = useState<string | null>(null);
  const [completionNotesText, setCompletionNotesText] = useState('');

  // Calendar month state
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 9, 17)); // Octubre 2026

  // Form State for New Activity
  const [newFormData, setNewFormData] = useState({
    title: '',
    type: 'meeting' as ActivityType,
    priority: 'media' as ActivityPriority,
    dueDate: '2026-10-18',
    dueTime: '10:00',
    durationMinutes: 45,
    accountName: 'InnovaTech Soluciones',
    contactName: 'Carlos Mendoza',
    contactEmail: 'carlos.mendoza@innovatech.com',
    contactPhone: '+52 55 4123 8901',
    opportunityTitle: '',
    location: 'Google Meet',
    meetingLink: 'https://meet.google.com/new',
    description: '',
    assignedUser: 'Ana Gómez',
    tags: 'Comercial, Seguimiento',
    calendarSyncTarget: 'google' as 'google' | 'outlook' | 'none',
  });

  const todayStr = '2026-10-17';

  // Toggle Complete / Incomplete
  const handleToggleComplete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const act = activities.find((a) => a.id === id);
    if (!act) return;

    if (act.status === 'completada') {
      // Reopen
      setActivities((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: 'pendiente', completedAt: undefined, outcomeNotes: undefined }
            : a
        )
      );
      if (selectedActivity?.id === id) {
        setSelectedActivity((prev) =>
          prev ? { ...prev, status: 'pendiente', completedAt: undefined, outcomeNotes: undefined } : null
        );
      }
    } else {
      // Prompt outcome notes or complete immediately
      setCompletionNotesPromptId(id);
      setCompletionNotesText('');
    }
  };

  const confirmCompletionWithNotes = () => {
    if (!completionNotesPromptId) return;
    setActivities((prev) =>
      prev.map((a) =>
        a.id === completionNotesPromptId
          ? {
              ...a,
              status: 'completada',
              completedAt: new Date().toISOString(),
              outcomeNotes: completionNotesText.trim() || 'Actividad completada satisfactoriamente.',
            }
          : a
      )
    );
    if (selectedActivity?.id === completionNotesPromptId) {
      setSelectedActivity((prev) =>
        prev
          ? {
              ...prev,
              status: 'completada',
              completedAt: new Date().toISOString(),
              outcomeNotes: completionNotesText.trim() || 'Actividad completada satisfactoriamente.',
            }
          : null
      );
    }
    setCompletionNotesPromptId(null);
    setCompletionNotesText('');
  };

  // Quick reschedule +24h
  const handleRescheduleTomorrow = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          dueDate: '2026-10-18',
          status: 'pendiente',
        };
      })
    );
    if (selectedActivity?.id === id) {
      setSelectedActivity((prev) =>
        prev ? { ...prev, dueDate: '2026-10-18', status: 'pendiente' } : null
      );
    }
  };

  // Create Activity
  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormData.title.trim()) return;

    const newAct: Activity = {
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      title: newFormData.title,
      type: newFormData.type,
      priority: newFormData.priority,
      status: 'pendiente',
      dueDate: newFormData.dueDate,
      dueTime: newFormData.dueTime,
      durationMinutes: Number(newFormData.durationMinutes) || 30,
      accountName: newFormData.accountName,
      contactName: newFormData.contactName,
      contactEmail: newFormData.contactEmail,
      contactPhone: newFormData.contactPhone,
      opportunityTitle: newFormData.opportunityTitle || undefined,
      assignedTo: {
        name: newFormData.assignedUser,
        role: newFormData.assignedUser === 'Ana Gómez' ? 'Directora Comercial' : 'Representante Comercial',
        avatar:
          newFormData.assignedUser === 'Ana Gómez'
            ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      location: newFormData.location,
      meetingLink: newFormData.location.includes('Meet') || newFormData.location.includes('Zoom') ? newFormData.meetingLink : undefined,
      description: newFormData.description,
      tags: newFormData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    setActivities((prev) => [newAct, ...prev]);
    setIsNewActivityModalOpen(false);

    // Sincronización automática de calendario al momento de la creación
    if (newFormData.calendarSyncTarget === 'google') {
      const gcalUrl = generateGoogleCalendarUrl(newAct);
      window.open(gcalUrl, '_blank');
    } else if (newFormData.calendarSyncTarget === 'outlook') {
      downloadActivityIcs(newAct);
    }

    // Reset form
    setNewFormData({
      title: '',
      type: 'meeting',
      priority: 'media',
      dueDate: '2026-10-18',
      dueTime: '10:00',
      durationMinutes: 45,
      accountName: 'InnovaTech Soluciones',
      contactName: 'Carlos Mendoza',
      contactEmail: 'carlos.mendoza@innovatech.com',
      contactPhone: '+52 55 4123 8901',
      opportunityTitle: '',
      location: 'Google Meet',
      meetingLink: 'https://meet.google.com/new',
      description: '',
      assignedUser: 'Ana Gómez',
      tags: 'Comercial, Seguimiento',
      calendarSyncTarget: 'google',
    });
  };

  // Calculations for KPIs
  const kpis = useMemo(() => {
    const total = activities.length;
    const completed = activities.filter((a) => a.status === 'completada').length;
    const pendingToday = activities.filter(
      (a) => a.dueDate === todayStr && a.status !== 'completada' && a.status !== 'cancelada'
    ).length;
    const overdue = activities.filter(
      (a) => a.dueDate < todayStr && a.status !== 'completada' && a.status !== 'cancelada'
    ).length;
    const meetings = activities.filter(
      (a) => (a.type === 'meeting' || a.type === 'proposal') && a.status !== 'cancelada'
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pendingToday, overdue, meetings, completionRate };
  }, [activities]);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      // Tab filter
      if (activeTab === 'hoy') {
        if (item.dueDate !== todayStr) return false;
      } else if (activeTab === 'vencidas') {
        if (!(item.dueDate < todayStr && item.status !== 'completada')) return false;
      } else if (activeTab === 'proximas') {
        if (!(item.dueDate > todayStr && item.status !== 'completada')) return false;
      } else if (activeTab === 'completadas') {
        if (item.status !== 'completada') return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesAccount = item.accountName.toLowerCase().includes(query);
        const matchesContact = item.contactName.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTag = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesAccount && !matchesContact && !matchesDesc && !matchesTag) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'todos' && item.type !== selectedType) return false;

      // Priority filter
      if (selectedPriority !== 'todas' && item.priority !== selectedPriority) return false;

      // Owner filter
      if (selectedOwner !== 'todos' && item.assignedTo.name !== selectedOwner) return false;

      return true;
    });
  }, [activities, activeTab, searchTerm, selectedType, selectedPriority, selectedOwner]);

  // Grouped by section for agenda view
  const categorizedAgenda = useMemo(() => {
    const overdueList = filteredActivities.filter(
      (a) => a.dueDate < todayStr && a.status !== 'completada'
    );
    const todayList = filteredActivities.filter(
      (a) => a.dueDate === todayStr && a.status !== 'completada'
    );
    const upcomingList = filteredActivities.filter(
      (a) => a.dueDate > todayStr && a.status !== 'completada'
    );
    const completedList = filteredActivities.filter((a) => a.status === 'completada');

    return { overdueList, todayList, upcomingList, completedList };
  }, [filteredActivities]);

  // Calendar matrix generator
  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Mon is 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      items: Activity[];
    }> = [];

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      const isToday = dateStr === todayStr;
      const dayActivities = activities.filter((a) => a.dueDate === dateStr);

      days.push({
        dayNumber: day,
        dateStr,
        isCurrentMonth: true,
        isToday,
        items: dayActivities,
      });
    }

    return { adjustedFirstDay, days };
  }, [currentCalendarDate, activities]);

  const renderTypeIcon = (type: ActivityType, className = 'w-4 h-4') => {
    switch (type) {
      case 'meeting':
        return <Video className={className} />;
      case 'call':
        return <PhoneCall className={className} />;
      case 'task':
        return <CheckSquare className={className} />;
      case 'email':
        return <Mail className={className} />;
      case 'proposal':
        return <Presentation className={className} />;
      case 'review':
        return <FileCheck className={className} />;
      default:
        return <CalendarIcon className={className} />;
    }
  };

  // Helper to render activity item card in agenda list
  const renderActivityCard = (item: Activity, isOverdueAlert = false) => {
    const typeConfig = ACTIVITY_TYPE_CONFIG[item.type];
    const priorityConfig = PRIORITY_CONFIG[item.priority];
    const isCompleted = item.status === 'completada';

    return (
      <div
        key={item.id}
        onClick={() => setSelectedActivity(item)}
        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          isCompleted
            ? 'bg-slate-50/70 border-slate-200 opacity-75'
            : isOverdueAlert
            ? 'bg-white border-rose-200 hover:border-rose-400 hover:shadow-xs'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
        }`}
      >
        {/* Left: Checkbox + Type Icon + Title & Metadata */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Checkbox */}
          <button
            type="button"
            onClick={(e) => handleToggleComplete(item.id, e)}
            title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
            className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 hover:border-[#E11D48] text-transparent hover:text-rose-200'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          {/* Type Badge Icon */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}
            title={typeConfig.label}
          >
            {renderTypeIcon(item.type, 'w-4 h-4')}
          </div>

          {/* Title & Details */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`text-xs font-bold leading-tight ${
                  isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                }`}
              >
                {item.title}
              </h3>

              {/* Priority Pill */}
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${priorityConfig.badge}`}
              >
                {priorityConfig.label}
              </span>

              {/* Type Label */}
              <span className="text-[10px] font-semibold text-slate-400">
                • {typeConfig.label}
              </span>
            </div>

            {/* Subtitle / Related Links */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
              {/* Account Link */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToAccount?.(item.accountName);
                }}
                className="flex items-center gap-1 font-bold text-slate-700 hover:text-[#E11D48] transition-colors cursor-pointer"
                title="Ir a cuenta"
              >
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>{item.accountName}</span>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-1 text-slate-500">
                <User className="w-3 h-3 text-slate-400" />
                <span>{item.contactName}</span>
              </div>

              {/* Opportunity if present */}
              {item.opportunityTitle && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToOpportunities?.();
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="Ver en embudo de oportunidades"
                >
                  <Target className="w-3 h-3 text-[#E11D48]" />
                  <span className="truncate max-w-[160px]">{item.opportunityTitle}</span>
                </div>
              )}
            </div>

            {/* Description snippet or outcome notes */}
            {isCompleted && item.outcomeNotes ? (
              <p className="text-[11px] text-emerald-700 font-medium mt-1 bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-100">
                <strong>Resultado:</strong> {item.outcomeNotes}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Date, Time, Assigned User & Fast Sync Buttons */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          {/* Date & Time pill */}
          <div className="text-right">
            <div
              className={`text-xs font-black flex items-center md:justify-end gap-1 ${
                isOverdueAlert
                  ? 'text-[#E11D48]'
                  : item.dueDate === todayStr
                  ? 'text-amber-800'
                  : 'text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{item.dueTime}</span>
              <span className="text-[10px] font-normal text-slate-400">
                ({item.durationMinutes}m)
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-400">
              {item.dueDate === todayStr
                ? 'Hoy'
                : item.dueDate < todayStr
                ? `Venció el ${item.dueDate}`
                : item.dueDate}
            </div>
          </div>

          {/* Owner Avatar */}
          <div className="flex items-center gap-1.5">
            <img
              src={item.assignedTo.avatar}
              alt={item.assignedTo.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
              title={`Asignado a: ${item.assignedTo.name} (${item.assignedTo.role})`}
            />
          </div>

          {/* Fast Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Meeting Direct Link (if exists) */}
            {item.meetingLink && !isCompleted && (
              <a
                href={item.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors flex items-center gap-1"
                title="Unirse a la videollamada"
              >
                <Video className="w-3 h-3" />
                <span className="hidden xl:inline text-[10px]">Unirse</span>
              </a>
            )}

            {/* Google Calendar & .ICS Sync - Solo para actividades NO completadas */}
            {!isCompleted && (
              <>
                <a
                  href={generateGoogleCalendarUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Sincronizar con Google Calendar"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadActivityIcs(item);
                  }}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Descargar archivo .ics para Outlook/Apple"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Badge de estado cuando ya fue cumplida */}
            {isCompleted && (
              <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200/80 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Cumplida
              </span>
            )}

            {/* Quick Reschedule if Overdue */}
            {isOverdueAlert && (
              <button
                type="button"
                onClick={(e) => handleRescheduleTomorrow(item.id, e)}
                className="px-2 py-1 text-[10px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors cursor-pointer"
                title="Reprogramar para mañana"
              >
                +24h
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#F8FAFC] overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center font-bold shadow-xs">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                Módulo de Actividades & Agenda
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#E11D48] border border-rose-100">
                CRM Comercial
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Seguimiento operativo de llamadas, reuniones, demos, tareas y sincronización directa con Google Calendar.
            </p>
          </div>
        </div>

        {/* View Switcher & New Activity CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('agenda')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Agenda / Lista</span>
            </button>
            <button
              onClick={() => setViewMode('calendario')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'calendario'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendario Mensual</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewActivityModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Actividad</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* KPI 1 */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold mb-1">
              <span>Actividades Totales</span>
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">{kpis.total}</span>
              <span className="text-[10px] text-slate-500 font-bold">agenda activa</span>
            </div>
          </div>

          {/* KPI 2: Pendientes Hoy */}
          <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
            <div className="flex items-center justify-between text-amber-700 text-[11px] font-semibold mb-1">
              <span>Pendientes para Hoy</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-amber-900">{kpis.pendingToday}</span>
              <span className="text-[10px] text-amber-700 font-bold">prioritarias</span>
            </div>
          </div>

          {/* KPI 3: Vencidas / En Riesgo */}
          <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100">
            <div className="flex items-center justify-between text-rose-700 text-[11px] font-semibold mb-1">
              <span>Vencidas / En Riesgo</span>
              <AlertCircle className="w-3.5 h-3.5 text-[#E11D48]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-rose-900">{kpis.overdue}</span>
              <span className="text-[10px] text-[#E11D48] font-bold">atención urgente</span>
            </div>
          </div>

          {/* KPI 4: Reuniones & Demos */}
          <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
            <div className="flex items-center justify-between text-purple-700 text-[11px] font-semibold mb-1">
              <span>Reuniones & Demos</span>
              <Video className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-purple-900">{kpis.meetings}</span>
              <span className="text-[10px] text-purple-700 font-bold">alto impacto</span>
            </div>
          </div>

          {/* KPI 5: Tasa de Cumplimiento */}
          <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-emerald-700 text-[11px] font-semibold mb-1">
              <span>Tasa Cumplimiento</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-emerald-900">{kpis.completionRate}%</span>
              <span className="text-[10px] text-emerald-700 font-bold">
                {kpis.completed} completadas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Tab selection */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'todas'
                ? 'bg-[#0A1128] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas ({activities.length})
          </button>
          <button
            onClick={() => setActiveTab('hoy')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hoy'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Hoy</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'hoy' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'}`}>
              {activities.filter((a) => a.dueDate === todayStr && a.status !== 'completada').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('vencidas')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vencidas'
                ? 'bg-[#E11D48] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Vencidas</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'vencidas' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-[#E11D48]'}`}>
              {kpis.overdue}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('proximas')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'proximas'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Próximas
          </button>
          <button
            onClick={() => setActiveTab('completadas')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'completadas'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completadas ({kpis.completed})
          </button>
        </div>

        {/* Right: Search & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título, cuenta o contacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E11D48] focus:bg-white w-56 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#E11D48] cursor-pointer"
          >
            <option value="todos">Tipo: Todos</option>
            <option value="meeting">Reunión / Demo</option>
            <option value="call">Llamada</option>
            <option value="task">Tarea</option>
            <option value="email">Correo</option>
            <option value="proposal">Propuesta</option>
            <option value="review">Revisión SLA</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#E11D48] cursor-pointer"
          >
            <option value="todas">Prioridad: Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          {/* Assigned Owner */}
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#E11D48] cursor-pointer"
          >
            <option value="todos">Responsable: Todos</option>
            <option value="Ana Gómez">Ana Gómez</option>
            <option value="Mateo Rossi">Mateo Rossi</option>
            <option value="David Benítez">David Benítez</option>
            <option value="Sofía Castro">Sofía Castro</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {/* VIEW 1: AGENDA / CLASSIFIED LIST */}
        {viewMode === 'agenda' && (
          <div className="space-y-5 max-w-7xl mx-auto">
            {/* OVERDUE SECTION (if any and matching filter) */}
            {categorizedAgenda.overdueList.length > 0 && (
              <div className="bg-rose-50/40 border border-rose-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-rose-100 text-[#E11D48] flex items-center justify-center">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-rose-900">
                      Actividades Vencidas ({categorizedAgenda.overdueList.length})
                    </h2>
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      Requieren reprogramación o seguimiento urgente
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {categorizedAgenda.overdueList.map((item) => renderActivityCard(item, true))}
                </div>
              </div>
            )}

            {/* TODAY SECTION */}
            {categorizedAgenda.todayList.length > 0 && (
              <div className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-amber-900">
                      Programadas para Hoy (17 de Octubre) ({categorizedAgenda.todayList.length})
                    </h2>
                  </div>
                </div>

                <div className="space-y-2">
                  {categorizedAgenda.todayList.map((item) => renderActivityCard(item))}
                </div>
              </div>
            )}

            {/* UPCOMING SECTION */}
            {categorizedAgenda.upcomingList.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Próximas Actividades ({categorizedAgenda.upcomingList.length})
                    </h2>
                  </div>
                </div>

                <div className="space-y-2">
                  {categorizedAgenda.upcomingList.map((item) => renderActivityCard(item))}
                </div>
              </div>
            )}

            {/* COMPLETED SECTION */}
            {categorizedAgenda.completedList.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Actividades Completadas Recientes ({categorizedAgenda.completedList.length})
                    </h2>
                  </div>
                </div>

                <div className="space-y-2">
                  {categorizedAgenda.completedList.map((item) => renderActivityCard(item))}
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {filteredActivities.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-800">No se encontraron actividades</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  No hay actividades que coincidan con los filtros aplicados o no hay tareas pendientes en esta categoría.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('todos');
                    setSelectedPriority('todas');
                    setSelectedOwner('todos');
                    setActiveTab('todas');
                  }}
                  className="mt-4 px-3 py-1.5 text-xs font-bold text-[#E11D48] bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                >
                  Restablecer filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: MONTHLY CALENDAR VIEW */}
        {viewMode === 'calendario' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 max-w-7xl mx-auto shadow-xs">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 tracking-tight capitalize">
                  {currentCalendarDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                </h2>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {activities.length} eventos registrados
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setCurrentCalendarDate(
                      new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1)
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentCalendarDate(new Date(2026, 9, 17))}
                  className="px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Hoy
                </button>
                <button
                  onClick={() =>
                    setCurrentCalendarDate(
                      new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1)
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <div>Lun</div>
              <div>Mar</div>
              <div>Mié</div>
              <div>Jue</div>
              <div>Vie</div>
              <div className="text-slate-300">Sáb</div>
              <div className="text-slate-300">Dom</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty leading cells */}
              {Array.from({ length: calendarDays.adjustedFirstDay }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[110px] bg-slate-50/50 rounded-xl border border-dashed border-slate-100 p-1.5 opacity-40"
                />
              ))}

              {/* Month days */}
              {calendarDays.days.map((day) => (
                <div
                  key={day.dateStr}
                  onClick={() => {
                    if (day.items.length > 0) {
                      setSelectedActivity(day.items[0]);
                    }
                  }}
                  className={`min-h-[110px] rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                    day.isToday
                      ? 'bg-rose-50/30 border-[#E11D48]/40 ring-1 ring-[#E11D48]/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                        day.isToday
                          ? 'bg-[#E11D48] text-white shadow-xs'
                          : 'text-slate-700'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    {day.items.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {day.items.length} {day.items.length === 1 ? 'actividad' : 'act.'}
                      </span>
                    )}
                  </div>

                  {/* Day activity chips */}
                  <div className="space-y-1 overflow-y-auto max-h-[75px] scrollbar-thin">
                    {day.items.slice(0, 3).map((act) => {
                      const typeConfig = ACTIVITY_TYPE_CONFIG[act.type];
                      const isCompleted = act.status === 'completada';
                      return (
                        <div
                          key={act.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActivity(act);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate flex items-center gap-1 border ${
                            isCompleted
                              ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                              : `${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`
                          }`}
                          title={`${act.dueTime} - ${act.title}`}
                        >
                          <span className="font-bold">{act.dueTime}</span>
                          <span className="truncate">{act.title}</span>
                        </div>
                      );
                    })}
                    {day.items.length > 3 && (
                      <div className="text-[9px] font-bold text-slate-400 pl-1">
                        +{day.items.length - 3} más...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: INSPECTOR / DETALLE DE ACTIVIDAD */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold border ${
                    ACTIVITY_TYPE_CONFIG[selectedActivity.type].bg
                  } ${ACTIVITY_TYPE_CONFIG[selectedActivity.type].text} ${
                    ACTIVITY_TYPE_CONFIG[selectedActivity.type].border
                  }`}
                >
                  {renderTypeIcon(selectedActivity.type, 'w-4 h-4')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {selectedActivity.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {ACTIVITY_TYPE_CONFIG[selectedActivity.type].label}
                    </span>
                  </div>
                  <h2 className="text-sm font-extrabold text-white leading-tight">
                    {selectedActivity.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedActivity(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Status and Action Buttons Banner */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">ESTADO ACTUAL</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`font-black text-xs px-2 py-0.5 rounded-full ${
                        selectedActivity.status === 'completada'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedActivity.dueDate < todayStr
                          ? 'bg-rose-100 text-[#E11D48]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedActivity.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleComplete(selectedActivity.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors ${
                      selectedActivity.status === 'completada'
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>
                      {selectedActivity.status === 'completada' ? 'Reabrir Tarea' : 'Completar Ahora'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400">FECHA Y HORA</span>
                  <div className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {selectedActivity.dueDate} a las {selectedActivity.dueTime}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Duración: {selectedActivity.durationMinutes} minutos
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400">LUGAR / PLATAFORMA</span>
                  <div className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{selectedActivity.location}</span>
                  </div>
                  {selectedActivity.meetingLink && (
                    <a
                      href={selectedActivity.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-[#E11D48] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>Abrir enlace de reunión</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Linked Account & Contact */}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Entidades Relacionadas en Katapult
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Account Box */}
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400">CUENTA ASOCIADA</span>
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="font-bold text-slate-800 text-xs truncate">
                      {selectedActivity.accountName}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedActivity(null);
                        onNavigateToAccount?.(selectedActivity.accountName);
                      }}
                      className="text-[10px] font-bold text-[#E11D48] hover:underline mt-1 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver expediente de la cuenta</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Contact Box */}
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400">CONTACTO PRINCIPAL</span>
                      <User className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="font-bold text-slate-800 text-xs">
                      {selectedActivity.contactName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">
                      {selectedActivity.contactEmail} • {selectedActivity.contactPhone}
                    </div>
                  </div>
                </div>

                {/* Opportunity Box if present */}
                {selectedActivity.opportunityTitle && (
                  <div className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-rose-500">OPORTUNIDAD VINCULADA</span>
                      <div className="font-extrabold text-rose-950 text-xs">
                        {selectedActivity.opportunityTitle}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedActivity(null);
                        onNavigateToOpportunities?.();
                      }}
                      className="px-2 py-1 text-[10px] font-bold bg-[#E11D48] text-white rounded-lg hover:bg-[#BE123C] cursor-pointer"
                    >
                      Ver en Pipeline
                    </button>
                  </div>
                )}
              </div>

              {/* Description & Objective */}
              <div className="border-t border-slate-200 pt-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Descripción y Objetivos
                </h4>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Outcome Notes if completed */}
              {selectedActivity.outcomeNotes && (
                <div className="border-t border-slate-200 pt-3">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resultado de la Actividad</span>
                  </h4>
                  <p className="text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 font-medium leading-relaxed">
                    {selectedActivity.outcomeNotes}
                  </p>
                </div>
              )}

              {/* Tags & Assigned Rep */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <div className="flex items-center gap-1 flex-wrap">
                  {selectedActivity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">RESPONSABLE:</span>
                  <img
                    src={selectedActivity.assignedTo.avatar}
                    alt={selectedActivity.assignedTo.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-bold text-slate-800 text-[11px]">
                    {selectedActivity.assignedTo.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer / Calendar Sync CTAs */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              {selectedActivity.status === 'completada' ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Actividad completada y archivada en el historial</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    href={generateGoogleCalendarUrl(selectedActivity)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
                    <span>Google Calendar</span>
                  </a>

                  <button
                    onClick={() => downloadActivityIcs(selectedActivity)}
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-500" />
                    <span>Descargar .ICS</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPLETION NOTES PROMPT */}
      {completionNotesPromptId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-extrabold text-slate-900">Completar Actividad</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              ¿Cuál fue el resultado o acuerdo de esta actividad? Esta nota quedará registrada en el historial del cliente.
            </p>

            <textarea
              value={completionNotesText}
              onChange={(e) => setCompletionNotesText(e.target.value)}
              placeholder="Ej: El cliente confirmó interés en la propuesta y agendamos reunión final para el viernes..."
              rows={3}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setCompletionNotesPromptId(null);
                  setCompletionNotesText('');
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCompletionWithNotes}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                Guardar y Finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: NUEVA ACTIVIDAD */}
      {isNewActivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Agendar Nueva Actividad</h3>
                  <p className="text-[11px] text-slate-400">
                    Registra reuniones, llamadas o tareas asociadas a cuentas y oportunidades.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewActivityModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateActivity} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Título de la Actividad *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Demo comercial de funcionalidades ERP"
                  value={newFormData.title}
                  onChange={(e) => setNewFormData({ ...newFormData, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tipo *</label>
                  <select
                    value={newFormData.type}
                    onChange={(e) =>
                      setNewFormData({ ...newFormData, type: e.target.value as ActivityType })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                  >
                    <option value="meeting">Reunión / Demo</option>
                    <option value="call">Llamada telefónica</option>
                    <option value="task">Tarea operativa</option>
                    <option value="email">Envío de correo</option>
                    <option value="proposal">Presentación de propuesta</option>
                    <option value="review">Revisión técnica / SLA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Prioridad *
                  </label>
                  <select
                    value={newFormData.priority}
                    onChange={(e) =>
                      setNewFormData({ ...newFormData, priority: e.target.value as ActivityPriority })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              {/* Date, Time & Duration */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={newFormData.dueDate}
                    onChange={(e) => setNewFormData({ ...newFormData, dueDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Hora *</label>
                  <input
                    type="time"
                    required
                    value={newFormData.dueTime}
                    onChange={(e) => setNewFormData({ ...newFormData, dueTime: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={newFormData.durationMinutes}
                    onChange={(e) =>
                      setNewFormData({ ...newFormData, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              {/* Account & Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Cuenta Asociada *
                  </label>
                  <select
                    value={newFormData.accountName}
                    onChange={(e) => setNewFormData({ ...newFormData, accountName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                  >
                    <option value="InnovaTech Soluciones">InnovaTech Soluciones</option>
                    <option value="Grupo Salinas & Asociados">Grupo Salinas & Asociados</option>
                    <option value="BioSalud Farmacéutica">BioSalud Farmacéutica</option>
                    <option value="Logística Avanzada del Norte">Logística Avanzada del Norte</option>
                    <option value="UrbanStyle Retail">UrbanStyle Retail</option>
                    <option value="Carlos Eduardo Ramírez">Carlos Eduardo Ramírez</option>
                    <option value="Dra. Sofía Mendoza">Dra. Sofía Mendoza</option>
                    <option value="AgroExport del Valle">AgroExport del Valle</option>
                    <option value="Finanzas & Capital SA">Finanzas & Capital SA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Contacto Principal *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFormData.contactName}
                    onChange={(e) => setNewFormData({ ...newFormData, contactName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              {/* Location & Meeting Link */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Lugar / Plataforma
                  </label>
                  <input
                    type="text"
                    value={newFormData.location}
                    onChange={(e) => setNewFormData({ ...newFormData, location: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Responsable Asignado
                  </label>
                  <select
                    value={newFormData.assignedUser}
                    onChange={(e) =>
                      setNewFormData({ ...newFormData, assignedUser: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                  >
                    <option value="Ana Gómez">Ana Gómez (Directora Comercial)</option>
                    <option value="Mateo Rossi">Mateo Rossi (Senior Rep)</option>
                    <option value="David Benítez">David Benítez (Solutions Eng.)</option>
                    <option value="Sofía Castro">Sofía Castro (Customer Success)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Descripción y Objetivos
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre lo que se espera lograr en esta actividad..."
                  value={newFormData.description}
                  onChange={(e) =>
                    setNewFormData({ ...newFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              {/* Sincronización Automática con Calendario */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-slate-800">
                    Sincronización Automática con Calendario
                  </span>
                  <span className="text-[10px] text-[#E11D48] font-bold bg-rose-50 px-2 py-0.5 rounded-md">
                    Al guardar cita
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                    newFormData.calendarSyncTarget === 'google'
                      ? 'bg-white border-[#E11D48] text-slate-900 shadow-2xs font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="calendarSync"
                      value="google"
                      checked={newFormData.calendarSyncTarget === 'google'}
                      onChange={() => setNewFormData({ ...newFormData, calendarSyncTarget: 'google' })}
                      className="text-[#E11D48] focus:ring-[#E11D48]"
                    />
                    <span className="text-[11px]">Google Calendar</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                    newFormData.calendarSyncTarget === 'outlook'
                      ? 'bg-white border-[#E11D48] text-slate-900 shadow-2xs font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="calendarSync"
                      value="outlook"
                      checked={newFormData.calendarSyncTarget === 'outlook'}
                      onChange={() => setNewFormData({ ...newFormData, calendarSyncTarget: 'outlook' })}
                      className="text-[#E11D48] focus:ring-[#E11D48]"
                    />
                    <span className="text-[11px]">Outlook (.ICS)</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                    newFormData.calendarSyncTarget === 'none'
                      ? 'bg-white border-[#E11D48] text-slate-900 shadow-2xs font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="calendarSync"
                      value="none"
                      checked={newFormData.calendarSyncTarget === 'none'}
                      onChange={() => setNewFormData({ ...newFormData, calendarSyncTarget: 'none' })}
                      className="text-[#E11D48] focus:ring-[#E11D48]"
                    />
                    <span className="text-[11px]">Solo en ERP</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewActivityModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Guardar y Programar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesModule;
