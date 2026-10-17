import React, { useState } from 'react';
import {
  Settings,
  Users,
  ShieldCheck,
  FolderTree,
  Sliders,
  Check,
  Plus,
  Trash2,
  Lock,
  Globe,
  Bell,
  DollarSign,
  Clock,
  Sparkles,
  Key,
  Layers,
  Edit2,
  X,
  UserCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload
} from 'lucide-react';
import {
  INITIAL_USERS,
  INITIAL_ROLE_PERMISSIONS,
  INITIAL_PIPELINE_STAGES,
  INITIAL_CATALOGS,
  INITIAL_OPERATIONAL_RULES,
  SystemUser,
  RolePermission,
  PipelineStageConfig,
  CatalogItem,
  OperationalRules,
} from '../data/configData';

export const SettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'permisos' | 'catalogos' | 'reglas'>('usuarios');

  // State
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<string>('Director Comercial');
  const [rolePermissions, setRolePermissions] = useState<Record<string, RolePermission[]>>(INITIAL_ROLE_PERMISSIONS);
  const [pipelineStages, setPipelineStages] = useState<PipelineStageConfig[]>(INITIAL_PIPELINE_STAGES);
  const [catalogs, setCatalogs] = useState<CatalogItem[]>(INITIAL_CATALOGS);
  const [activeCatalogCategory, setActiveCatalogCategory] = useState<'industria' | 'servicio' | 'etiqueta'>('industria');
  const [rules, setRules] = useState<OperationalRules>(INITIAL_OPERATIONAL_RULES);

  // New User Modal State
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'Ejecutivo Comercial' as SystemUser['role'],
  });

  // New Catalog Item Modal State
  const [isNewCatalogModalOpen, setIsNewCatalogModalOpen] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState('');

  // Notification Banner
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccessBanner = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // User Actions
  const handleToggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'activo' ? 'inactivo' : 'activo';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    showSuccessBanner('Estado del usuario actualizado');
  };

  const handleRoleChange = (userId: string, newRole: SystemUser['role']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showSuccessBanner(`Rol asignado correctamente a ${newRole}`);
  };

  const handleAvatarUpload = (userId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG o WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, avatar: dataUrl } : u))
        );
        showSuccessBanner('Foto de perfil de usuario actualizada exitosamente');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) return;

    const newUser: SystemUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: 'activo',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      lastLogin: 'Nunca (Invitación enviada)',
      twoFactorEnabled: false,
    };

    setUsers([...users, newUser]);
    setIsNewUserModalOpen(false);
    setNewUserForm({ name: '', email: '', role: 'Ejecutivo Comercial' });
    showSuccessBanner(`Usuario "${newUser.name}" creado con éxito`);
  };

  // Permission Toggle
  const handleTogglePermission = (
    role: string,
    moduleName: string,
    field: 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canExport'
  ) => {
    setRolePermissions((prev) => {
      const currentList = prev[role] || [];
      const updatedList = currentList.map((p) => {
        if (p.module === moduleName) {
          return { ...p, [field]: !p[field] };
        }
        return p;
      });
      return { ...prev, [role]: updatedList };
    });
    showSuccessBanner(`Permiso actualizado para rol "${role}"`);
  };

  // Catalog Item Creation
  const handleCreateCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatalogName.trim()) return;

    const newItem: CatalogItem = {
      id: `${activeCatalogCategory.slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      name: newCatalogName.trim(),
      category: activeCatalogCategory,
      itemCount: 0,
    };

    setCatalogs([...catalogs, newItem]);
    setNewCatalogName('');
    setIsNewCatalogModalOpen(false);
    showSuccessBanner(`Nuevo elemento añadido al catálogo de ${activeCatalogCategory}`);
  };

  const handleDeleteCatalogItem = (id: string) => {
    setCatalogs(catalogs.filter((c) => c.id !== id));
    showSuccessBanner('Elemento eliminado del catálogo');
  };

  // Pipeline Probability Change
  const handlePipelineProbChange = (id: string, newProb: number) => {
    setPipelineStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, probability: newProb } : s))
    );
    showSuccessBanner('Probabilidad de etapa comercial guardada');
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#F8FAFC] overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center font-bold shadow-xs">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                Módulo de Configuración & Administración ERP
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Sistema & RBAC
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Administración de catálogos generales, permisos de usuarios por rol y reglas operativas del ERP.
            </p>
          </div>
        </div>

        {/* Global Status Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>{rules.companyName}</span>
          </span>
        </div>
      </div>

      {/* Success Notification Bar */}
      {successMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 flex items-center justify-between text-xs text-emerald-900 font-bold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation Strip */}
      <div className="bg-white border-b border-slate-200 px-5 py-2 shrink-0 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'usuarios'
              ? 'bg-[#0A1128] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Usuarios & Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('permisos')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'permisos'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Matriz de Permisos (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('catalogos')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'catalogos'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Parametrización de Catálogos</span>
        </button>

        <button
          onClick={() => setActiveTab('reglas')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'reglas'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Reglas Operativas del ERP</span>
        </button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5 space-y-5">
        {/* TAB 1: USUARIOS & ASIGNACIÓN DE ROLES */}
        {activeTab === 'usuarios' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs max-w-7xl mx-auto">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Directorio de Usuarios del ERP
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Control de cuentas, asignación de roles y estados de acceso al sistema.
                </p>
              </div>

              <button
                onClick={() => setIsNewUserModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Invitar Nuevo Usuario</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-4">Usuario / Nombre</th>
                    <th className="py-2.5 px-4">Correo Electrónico</th>
                    <th className="py-2.5 px-4">Rol Asignado</th>
                    <th className="py-2.5 px-4 text-center">Seguridad 2FA</th>
                    <th className="py-2.5 px-4 text-center">Estado</th>
                    <th className="py-2.5 px-4">Último Acceso</th>
                    <th className="py-2.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <label
                            className="relative group cursor-pointer shrink-0"
                            title="Haz clic para subir o cambiar foto de perfil"
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 group-hover:ring-2 group-hover:ring-[#E11D48] transition-all"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="w-3.5 h-3.5 text-white" />
                            </div>
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/webp"
                              className="hidden"
                              onChange={(e) => handleAvatarUpload(user.id, e)}
                            />
                          </label>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{user.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value as SystemUser['role'])
                          }
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#E11D48] cursor-pointer"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Director Comercial">Director Comercial</option>
                          <option value="Ejecutivo Comercial">Ejecutivo Comercial</option>
                          <option value="Customer Success">Customer Success</option>
                          <option value="Finanzas">Finanzas</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user.twoFactorEnabled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Activo
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            user.status === 'activo'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] font-medium">
                        {user.lastLogin}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="text-[11px] font-bold text-[#E11D48] hover:underline cursor-pointer"
                        >
                          {user.status === 'activo' ? 'Desactivar' : 'Reactivar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MATRIZ DE PERMISOS (RBAC) */}
        {activeTab === 'permisos' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs max-w-7xl mx-auto space-y-4">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Matriz de Permisos Granulares por Rol (RBAC)
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Define qué acciones (Lectura, Creación, Edición, Eliminación y Exportación) puede realizar cada rol.
                </p>
              </div>

              {/* Role Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Inspeccionar Rol:</span>
                <select
                  value={selectedRoleForPermissions}
                  onChange={(e) => setSelectedRoleForPermissions(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:border-[#E11D48] cursor-pointer"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Director Comercial">Director Comercial</option>
                  <option value="Ejecutivo Comercial">Ejecutivo Comercial</option>
                  <option value="Customer Success">Customer Success</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-4">Módulo del ERP</th>
                    <th className="py-2.5 px-4 text-center">Ver / Lectura</th>
                    <th className="py-2.5 px-4 text-center">Crear</th>
                    <th className="py-2.5 px-4 text-center">Editar</th>
                    <th className="py-2.5 px-4 text-center">Eliminar</th>
                    <th className="py-2.5 px-4 text-center">Exportar CSV/PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(rolePermissions[selectedRoleForPermissions] || []).map((perm) => (
                    <tr key={perm.module} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">{perm.module}</td>

                      {/* Can View */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            handleTogglePermission(
                              selectedRoleForPermissions,
                              perm.module,
                              'canView'
                            )
                          }
                          className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-colors cursor-pointer ${
                            perm.canView
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Can Create */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            handleTogglePermission(
                              selectedRoleForPermissions,
                              perm.module,
                              'canCreate'
                            )
                          }
                          className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-colors cursor-pointer ${
                            perm.canCreate
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Can Edit */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            handleTogglePermission(
                              selectedRoleForPermissions,
                              perm.module,
                              'canEdit'
                            )
                          }
                          className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-colors cursor-pointer ${
                            perm.canEdit
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Can Delete */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            handleTogglePermission(
                              selectedRoleForPermissions,
                              perm.module,
                              'canDelete'
                            )
                          }
                          className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-colors cursor-pointer ${
                            perm.canDelete
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Can Export */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            handleTogglePermission(
                              selectedRoleForPermissions,
                              perm.module,
                              'canExport'
                            )
                          }
                          className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition-colors cursor-pointer ${
                            perm.canExport
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PARAMETRIZACIÓN DE CATÁLOGOS */}
        {activeTab === 'catalogos' && (
          <div className="space-y-5 max-w-7xl mx-auto">
            {/* SUB-SECTION 1: PIPELINE STAGES CATALOG */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Catálogo de Etapas del Pipeline Comercial
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Configuración de nombres, probabilidades de cierre y colores para el embudo de ventas.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {pipelineStages.length} fases comerciales
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {pipelineStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                        <span className="text-[10px] font-mono text-slate-400">{stage.id}</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900">{stage.name}</h4>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        Probabilidad (%):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={stage.probability}
                        onChange={(e) =>
                          handlePipelineProbChange(stage.id, Number(e.target.value))
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800 focus:outline-none focus:border-[#E11D48]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUB-SECTION 2: GENERAL BUSINESS CATALOGS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Catálogos de Negocio & Clasificación
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Parametriza las industrias permitidas, catálogo de servicios contratables y etiquetas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
                    <button
                      onClick={() => setActiveCatalogCategory('industria')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        activeCatalogCategory === 'industria'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Industrias
                    </button>
                    <button
                      onClick={() => setActiveCatalogCategory('servicio')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        activeCatalogCategory === 'servicio'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Servicios
                    </button>
                    <button
                      onClick={() => setActiveCatalogCategory('etiqueta')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        activeCatalogCategory === 'etiqueta'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Etiquetas
                    </button>
                  </div>

                  <button
                    onClick={() => setIsNewCatalogModalOpen(true)}
                    className="px-3 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>

              {/* Catalog Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {catalogs
                  .filter((item) => item.category === activeCatalogCategory)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {item.name}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.itemCount} registros vinculados
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteCatalogItem(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Eliminar elemento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REGLAS OPERATIVAS DEL ERP */}
        {activeTab === 'reglas' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs max-w-7xl mx-auto space-y-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Reglas Operativas y Parámetros Globales
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Políticas de asignación automática de leads, moneda, seguridad y notificaciones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Rule Box 1: Asignación de Leads */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-800">
                    Método de Asignación Automática de Prospectos
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Determina a qué ejecutivo comercial se asignan los leads entrantes de la Landing Page y Meta Ads.
                </p>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="leadAssign"
                      checked={rules.leadAssignmentMethod === 'round_robin'}
                      onChange={() =>
                        setRules({ ...rules, leadAssignmentMethod: 'round_robin' })
                      }
                      className="text-[#E11D48] focus:ring-[#E11D48]"
                    />
                    <span>Round-Robin Equitativo (Distribución uniforme entre comerciales)</span>
                  </label>
                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="leadAssign"
                      checked={rules.leadAssignmentMethod === 'territory'}
                      onChange={() =>
                        setRules({ ...rules, leadAssignmentMethod: 'territory' })
                      }
                      className="text-[#E11D48] focus:ring-[#E11D48]"
                    />
                    <span>Por Territorio & Industria del Prospecto</span>
                  </label>
                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="leadAssign"
                      checked={rules.leadAssignmentMethod === 'manual'}
                      onChange={() =>
                        setRules({ ...rules, leadAssignmentMethod: 'manual' })
                      }
                      className="text-[#E11D48] focus:ring-[#E11D48]"
                    />
                    <span>Asignación Manual por el Director Comercial</span>
                  </label>
                </div>
              </div>

              {/* Rule Box 2: Moneda y Zona Horaria */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-800">
                    Moneda Principal y Zona Horaria
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Moneda predeterminada para el cálculo de cartera y pipeline.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Moneda Base
                    </label>
                    <select
                      value={rules.defaultCurrency}
                      onChange={(e) =>
                        setRules({ ...rules, defaultCurrency: e.target.value as 'MXN' | 'USD' })
                      }
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#E11D48]"
                    >
                      <option value="MXN">MXN ($ Peso Mexicano)</option>
                      <option value="USD">USD ($ Dólar Americano)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Zona Horaria
                    </label>
                    <select
                      value={rules.timezone}
                      onChange={(e) => setRules({ ...rules, timezone: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#E11D48]"
                    >
                      <option value="America/Mexico_City (GMT-6)">Ciudad de México (GMT-6)</option>
                      <option value="America/Monterrey (GMT-6)">Monterrey (GMT-6)</option>
                      <option value="America/Bogota (GMT-5)">Bogotá (GMT-5)</option>
                      <option value="America/New_York (GMT-4)">Nueva York (GMT-4)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rule Box 3: Seguridad y 2FA */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold text-slate-800">Políticas de Seguridad</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rules.requireTwoFactor}
                      onChange={(e) =>
                        setRules({ ...rules, requireTwoFactor: e.target.checked })
                      }
                      className="rounded text-[#E11D48] focus:ring-[#E11D48]"
                    />
                    <span>Exigir Autenticación de Dos Pasos (2FA) a todos los usuarios</span>
                  </label>
                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rules.allowDataExport}
                      onChange={(e) =>
                        setRules({ ...rules, allowDataExport: e.target.checked })
                      }
                      className="rounded text-[#E11D48] focus:ring-[#E11D48]"
                    />
                    <span>Habilitar exportación de base de datos a administradores</span>
                  </label>
                </div>
              </div>

              {/* Rule Box 4: Alertas de Vencimiento */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-slate-800">Alertas y Notificaciones</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rules.activityOverdueAlerts}
                      onChange={(e) =>
                        setRules({ ...rules, activityOverdueAlerts: e.target.checked })
                      }
                      className="rounded text-[#E11D48] focus:ring-[#E11D48]"
                    />
                    <span>Alertar actividades vencidas y negociaciones estancadas (+7 días)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => showSuccessBanner('Reglas operativas guardadas exitosamente')}
                className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Guardar Cambios Operativos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: INVITAR NUEVO USUARIO */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Invitar Nuevo Usuario</h3>
              </div>
              <button
                onClick={() => setIsNewUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lic. Carlos Fuentes"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Correo Corporativo *
                </label>
                <input
                  type="email"
                  required
                  placeholder="carlos.fuentes@katapult.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Rol Asignado *
                </label>
                <select
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, role: e.target.value as SystemUser['role'] })
                  }
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Director Comercial">Director Comercial</option>
                  <option value="Ejecutivo Comercial">Ejecutivo Comercial</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="Finanzas">Finanzas</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR ELEMENTO A CATÁLOGO */}
      {isNewCatalogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900 capitalize">
                Agregar a Catálogo de {activeCatalogCategory}
              </h3>
              <button
                onClick={() => setIsNewCatalogModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCatalogItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nombre del Elemento *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`Ej: ${
                    activeCatalogCategory === 'industria'
                      ? 'Energías Renovables'
                      : activeCatalogCategory === 'servicio'
                      ? 'Auditoría Cloud'
                      : 'Cierre Urgente'
                  }`}
                  value={newCatalogName}
                  onChange={(e) => setNewCatalogName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewCatalogModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsModule;
