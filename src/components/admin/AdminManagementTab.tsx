import React, { useState, useEffect } from 'react';
import { AdminAccount } from '../../types.js';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Shield,
  ShieldAlert,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
} from 'lucide-react';

interface AdminManagementTabProps {
  token: string;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminManagementTab: React.FC<AdminManagementTabProps> = ({ token, showToast }) => {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
  const [newDisplayName, setNewDisplayName] = useState('');

  // Add form state
  const [addForm, setAddForm] = useState({
    email: '',
    displayName: '',
    password: '',
    role: 'admin' as 'owner' | 'admin',
  });

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/admins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      } else {
        const err = await res.json();
        showToast(err.error || 'تعذر جلب قائمة المسؤولين', 'error');
      }
    } catch {
      showToast('خطأ في الاتصال بالخادم', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, [token]);

  const handleApprove = async (adminId: string, currentName: string) => {
    const customName = prompt(`تأكيد قبول وتفعيل المسؤول (${currentName}). يمكنك تعديل الاسم التعريفي أدناه:`, currentName);
    if (customName === null) return;

    try {
      const res = await fetch(`/api/admin/admins/${adminId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName: customName.trim() || currentName }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'تم قبول وتفعيل صلاحيات المسؤول بنجاح', 'success');
        loadAdmins();
      } else {
        showToast(data.message || 'فشلت عملية التفعيل', 'error');
      }
    } catch {
      showToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  const handleReject = async (adminId: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من رفض طلب المسؤول (${name})؟`)) return;

    try {
      const res = await fetch(`/api/admin/admins/${adminId}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'تم رفض طلب الانضمام', 'info');
        loadAdmins();
      } else {
        showToast(data.message || 'فشلت العملية', 'error');
      }
    } catch {
      showToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  const handleRevoke = async (adminId: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من تجميد وسحب صلاحية المسؤول (${name}) وإبطال كافة جلساته فورياً؟`)) return;

    try {
      const res = await fetch(`/api/admin/admins/${adminId}/revoke`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'تم تجميد حساب المسؤول بنجاح', 'success');
        loadAdmins();
      } else {
        showToast(data.message || 'فشلت العملية', 'error');
      }
    } catch {
      showToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  const handleDelete = async (adminId: string, name: string) => {
    if (!window.confirm(`تحذير: هل أنت متأكد من حذف حساب المسؤول (${name}) نهائياً من النظام؟`)) return;

    try {
      const res = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'تم حذف حساب المسؤول', 'success');
        loadAdmins();
      } else {
        showToast(data.message || 'فشلت العملية', 'error');
      }
    } catch {
      showToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  const handleSaveDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    if (!newDisplayName.trim()) {
      showToast('يرجى كتابة الاسم التعريفي', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/admin/admins/${editingAdmin.id}/name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName: newDisplayName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'تم تحديث الاسم التعريفي بنجاح', 'success');
        setEditingAdmin(null);
        loadAdmins();
      } else {
        showToast(data.message || 'فشل تحديث الاسم', 'error');
      }
    } catch {
      showToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.email || !addForm.displayName || !addForm.password) {
      showToast('يرجى تعبئة كافة الحقول المطلوبة', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'تم إنشاء الحساب وتفعيله بنجاح', 'success');
        setIsAddModalOpen(false);
        setAddForm({ email: '', displayName: '', password: '', role: 'admin' });
        loadAdmins();
      } else {
        showToast(data.message || 'فشلت عملية الإنشاء', 'error');
      }
    } catch {
      showToast('تعذر الاتصال بالخادم', 'error');
    }
  };

  const pendingAdmins = admins.filter((a) => a.status === 'pending');
  const approvedAdmins = admins.filter(
    (a) =>
      a.status !== 'pending' &&
      (a.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Overview Bar */}
      <div className="bg-[#111111] text-white p-6 rounded-2xl border border-[#111111] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" />
            <h2 className="font-bold text-lg text-white">إدارة المسؤولين والصلاحيات (Owner Exclusive)</h2>
          </div>
          <p className="text-xs text-neutral-300">
            مساحة مخصصة حصرياً للمالك العام لإدارة الحسابات، قبول طلبات الانضمام، وتعيين الأسماء التعريفية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdmins}
            disabled={isLoading}
            className="p-2.5 bg-[#f8f9fa]/10 hover:bg-[#f8f9fa]/20 text-white rounded-xl transition-colors cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#f8f9fa] text-[#111111] hover:bg-neutral-100 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة مسؤول جديد</span>
          </button>
        </div>
      </div>

      {/* Pending Requests Section */}
      {pendingAdmins.length > 0 && (
        <div className="bg-[#f8f9fa] border-2 border-[#111111] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#111111] animate-pulse" />
              <h3 className="font-bold text-sm text-[#111111]">
                طلبات الانضمام بانتظار الموافقة ({pendingAdmins.length})
              </h3>
            </div>
            <span className="text-[11px] text-neutral-500 font-medium">يتطلب إجراء المالك لتفعيل الصلاحية</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingAdmins.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-[#e0e0e0] bg-neutral-50/70 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#000000]">{req.displayName}</h4>
                    <p className="font-mono text-xs text-neutral-600">{req.email}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-sm border border-amber-300">
                    قيد المراجعة
                  </span>
                </div>

                {req.notes && (
                  <p className="text-xs text-neutral-600 bg-[#f8f9fa] p-2 rounded-lg border border-[#e0e0e0]">
                    <span className="font-bold text-neutral-800">ملاحظات الطلب: </span>
                    {req.notes}
                  </p>
                )}

                <div className="text-[10px] text-neutral-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>تاريخ التقديم: {new Date(req.createdAt).toLocaleString('ar-JO')}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#e0e0e0]">
                  <button
                    onClick={() => handleApprove(req.id, req.displayName)}
                    className="flex-1 py-2 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>قبول وتفعيل</span>
                  </button>
                  <button
                    onClick={() => handleReject(req.id, req.displayName)}
                    className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>رفض</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Admins Registry Table */}
      <div className="bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-[#000000]">سجل المسؤولين المعتمدين</h3>
            <p className="text-xs text-neutral-500">
              إجمالي الحسابات المسجلة: {admins.length} حساب (مالك عام ومسؤولين تنفيذيين)
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم أو البريد..."
              className="w-full pr-9 pl-3 py-1.5 text-xs bg-neutral-50 border border-[#e0e0e0] rounded-xl text-[#000000] focus:outline-hidden focus:border-[#111111]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#111111] text-white border-b border-[#111111]">
              <tr>
                <th className="py-3 px-4 text-start font-bold">الاسم التعريفي للمسؤول</th>
                <th className="py-3 px-4 text-start font-bold">البريد الإلكتروني</th>
                <th className="py-3 px-4 text-center font-bold">الدور والرتبة</th>
                <th className="py-3 px-4 text-center font-bold">الحالة الحالية</th>
                <th className="py-3 px-4 text-center font-bold">آخر تسجيل دخول</th>
                <th className="py-3 px-4 text-end font-bold">إجراءات المالك</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {approvedAdmins.map((adm) => (
                <tr key={adm.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#000000]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {adm.displayName.charAt(0)}
                      </div>
                      <div>
                        <span>{adm.displayName}</span>
                        {adm.role === 'owner' && (
                          <span className="block text-[10px] text-[#111111] font-bold">المالك الرئيسي للنظام</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-neutral-700">{adm.email}</td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        adm.role === 'owner'
                          ? 'bg-[#111111] text-white border border-[#111111]'
                          : 'bg-neutral-100 text-neutral-800 border border-[#e0e0e0]'
                      }`}
                    >
                      {adm.role === 'owner' ? 'مالك عام (Owner)' : 'مسؤول (Admin)'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                        adm.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : adm.status === 'revoked'
                          ? 'bg-neutral-50 text-[#111111] border border-[#e0e0e0]'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {adm.status === 'approved' ? 'مفعّل ونشط' : adm.status === 'revoked' ? 'مجمّد وموقوف' : adm.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-neutral-500">
                    {adm.lastLogin ? new Date(adm.lastLogin).toLocaleDateString('ar-JO') : 'لم يسجل بعد'}
                  </td>

                  <td className="py-3.5 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingAdmin(adm);
                          setNewDisplayName(adm.displayName);
                        }}
                        className="p-1.5 text-neutral-600 hover:text-[#111111] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        title="تعديل الاسم التعريفي"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {adm.role !== 'owner' && (
                        <>
                          {adm.status === 'approved' ? (
                            <button
                              onClick={() => handleRevoke(adm.id, adm.displayName)}
                              className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="تجميد وسحب الصلاحية"
                            >
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApprove(adm.id, adm.displayName)}
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="إعادة التفعيل"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(adm.id, adm.displayName)}
                            className="p-1.5 text-[#111111] hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف الحساب نهائياً"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Display Name Modal */}
      {editingAdmin && (
        <div
          className="modal-backdrop-overlay bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setEditingAdmin(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content-wrapper modal-body-scroll w-full max-w-md bg-[#f8f9fa] rounded-2xl p-6 space-y-4 border border-[#e0e0e0] shadow-2xl text-[#000000]"
          >
            <h3 className="font-bold text-base text-[#111111]">تعديل الاسم التعريفي للمسؤول</h3>
            <p className="text-xs text-neutral-500">الحساب: {editingAdmin.email}</p>

            <form onSubmit={handleSaveDisplayName} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">الاسم التعريفي الجديد</label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="مثال: المسؤول محمد (إدارة الطلبات)"
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111]"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  حفظ الاسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Direct Admin Modal */}
      {isAddModalOpen && (
        <div
          className="modal-backdrop-overlay bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content-wrapper modal-body-scroll w-full max-w-md bg-[#f8f9fa] rounded-2xl p-6 space-y-4 border border-[#e0e0e0] shadow-2xl text-[#000000]"
          >
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <h3 className="font-bold text-base text-[#111111]">إضافة وتفعيل مسؤول جديد</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="admin@hkaya.store"
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">الاسم التعريفي</label>
                <input
                  type="text"
                  required
                  value={addForm.displayName}
                  onChange={(e) => setAddForm({ ...addForm, displayName: e.target.value })}
                  placeholder="مثال: المسؤول سيف"
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">كلمة المرور المؤقتة</label>
                <input
                  type="password"
                  required
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="6 خانات على الأقل"
                  className="w-full px-3 py-2 text-xs border border-[#e0e0e0] rounded-xl focus:outline-hidden focus:border-[#111111]"
                />
              </div>

              <div className="flex items-center gap-2 justify-end pt-2 border-t border-[#e0e0e0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-transparent text-[#111111] border border-[#111111] hover:bg-[#3a080d] hover:text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  إنشاء وتفعيل الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
