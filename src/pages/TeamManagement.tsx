import { useState } from 'react';
import { Users, UserPlus, Upload, Search, MoreVertical, Mail, Filter, Download, CheckCircle2, Clock, XCircle, Edit3, Trash2, UserMinus, RefreshCw } from 'lucide-react';
import Modal from '../components/Modal';
import type { Store } from '../store/useStore';

const departments = ['Engineering', 'Product', 'Design', 'Sales', 'People', 'Finance', 'Marketing', 'Operations'];

export default function TeamManagement({ store }: { store: Store }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: '', department: 'Engineering' });
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', department: '', status: 'active' as string });
  const [csvText, setCsvText] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'sessions' | 'lastActive'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const org = store.organizations[0];

  const filtered = store.employees
    .filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || e.status === filterStatus;
      const matchDept = filterDept === 'all' || e.department === filterDept;
      return matchSearch && matchStatus && matchDept;
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortBy === 'sessions') return (a.sessions - b.sessions) * dir;
      return a.lastActive.localeCompare(b.lastActive) * dir;
    });

  const handleInvite = () => {
    store.addEmployee({ ...inviteForm, sessions: 0, lastActive: '-', status: 'invited', topChallenge: '-', avatar: inviteForm.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() });
    setInviteForm({ name: '', email: '', role: '', department: 'Engineering' });
    setShowInvite(false);
  };

  const handleEdit = () => {
    if (!editingId) return;
    store.updateEmployee(editingId, { name: editForm.name, email: editForm.email, role: editForm.role, department: editForm.department, status: editForm.status as 'active' | 'invited' | 'inactive', avatar: editForm.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() });
    setEditingId(null);
  };

  const startEdit = (id: string) => {
    const emp = store.employees.find(e => e.id === id);
    if (!emp) return;
    setEditForm({ name: emp.name, email: emp.email, role: emp.role, department: emp.department, status: emp.status });
    setEditingId(id);
    setMenuOpen(null);
  };

  const handleCsvImport = () => {
    const lines = csvText.trim().split('\n').slice(1);
    const emps = lines.map(line => {
      const [name, email, role, department] = line.split(',').map(s => s.trim());
      return { name, email, role, department: department || 'Engineering', sessions: 0, lastActive: '-', status: 'invited' as const, topChallenge: '-', avatar: name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??' };
    }).filter(e => e.name && e.email);
    if (emps.length > 0) {
      store.bulkAddEmployees(emps);
      setCsvText('');
      setShowUpload(false);
    } else {
      store.addToast('error', 'No valid rows found in CSV');
    }
  };

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const statusIcon = (status: string) => {
    if (status === 'active') return <CheckCircle2 className="w-4 h-4 text-mint-500" />;
    if (status === 'invited') return <Clock className="w-4 h-4 text-spark-500" />;
    return <XCircle className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between anim-fade-in-up">
        <div><h1 className="text-2xl font-bold text-slate-900">Team Management</h1><p className="text-slate-500 mt-1">Manage seats and employees for {org.name}</p></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowUpload(true)} className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2 btn-ripple interactive"><Upload className="w-4 h-4" /> CSV Upload</button>
          <button onClick={() => setShowInvite(true)} className="px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 transition-all flex items-center gap-2 shadow-sm btn-ripple interactive"><UserPlus className="w-4 h-4" /> Invite Employee</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 stagger">
        {[
          { label: 'Seats Used', value: `${store.employees.length}/${org.seats}`, icon: Users, color: 'bg-ocean-50 text-ocean-600', pct: (store.employees.length / org.seats) * 100 },
          { label: 'Active', value: store.employees.filter(e => e.status === 'active').length, icon: CheckCircle2, color: 'bg-mint-50 text-mint-600' },
          { label: 'Pending', value: store.employees.filter(e => e.status === 'invited').length, icon: Mail, color: 'bg-spark-50 text-spark-600' },
          { label: 'Inactive', value: store.employees.filter(e => e.status === 'inactive').length, icon: UserMinus, color: 'bg-slate-100 text-slate-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 card-hover anim-fade-in-up">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-sm text-slate-500">{s.label}</p></div>
            </div>
            {s.pct !== undefined && <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden"><div className="h-full bg-gradient-to-r from-ocean-400 to-ocean-500 rounded-full anim-progress" style={{ width: `${s.pct}%` }} /></div>}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden anim-fade-in-up">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 flex-wrap">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 transition-all" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {['all', 'active', 'invited', 'inactive'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all btn-ripple ${filterStatus === s ? 'bg-spark-100 text-spark-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-500 border-0 focus:outline-none">
              <option value="all">All Depts</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button onClick={() => { store.addToast('success', 'Employee list exported as CSV'); }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Export CSV"><Download className="w-4 h-4" /></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th onClick={() => toggleSort('name')} className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none">Employee {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                <th onClick={() => toggleSort('sessions')} className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none">Sessions {sortBy === 'sessions' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => toggleSort('lastActive')} className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none">Last Active {sortBy === 'lastActive' && (sortDir === 'asc' ? '↑' : '↓')}</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-spark-50/20 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-xs font-semibold group-hover:scale-105 transition-transform">{emp.avatar}</div>
                      <div><p className="text-sm font-medium text-slate-900">{emp.name}</p><p className="text-xs text-slate-500">{emp.email}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-slate-600 px-2 py-1 bg-slate-50 rounded-lg">{emp.department}</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-medium text-slate-900">{emp.sessions}</span></td>
                  <td className="px-6 py-4"><span className="text-sm text-slate-500">{emp.lastActive}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {statusIcon(emp.status)}
                      <span className={`text-sm capitalize ${emp.status === 'active' ? 'text-mint-600' : emp.status === 'invited' ? 'text-spark-600' : 'text-slate-500'}`}>{emp.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button onClick={() => setMenuOpen(menuOpen === emp.id ? null : emp.id)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><MoreVertical className="w-4 h-4" /></button>
                      {menuOpen === emp.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20 anim-scale-in">
                            <button onClick={() => startEdit(emp.id)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"><Edit3 className="w-4 h-4" /> Edit</button>
                            {emp.status === 'invited' && <button onClick={() => { store.updateEmployee(emp.id, { status: 'active' }); setMenuOpen(null); store.addToast('success', 'Invitation resent'); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"><RefreshCw className="w-4 h-4" /> Resend Invite</button>}
                            {emp.status === 'active' && <button onClick={() => { store.updateEmployee(emp.id, { status: 'inactive' }); setMenuOpen(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"><UserMinus className="w-4 h-4" /> Deactivate</button>}
                            {emp.status === 'inactive' && <button onClick={() => { store.updateEmployee(emp.id, { status: 'active' }); setMenuOpen(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"><CheckCircle2 className="w-4 h-4" /> Reactivate</button>}
                            <div className="border-t border-slate-100 my-1" />
                            <button onClick={() => { setShowDeleteConfirm(emp.id); setMenuOpen(null); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"><Trash2 className="w-4 h-4" /> Remove</button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400"><Users className="w-8 h-8 mx-auto mb-2 opacity-40" /><p>No employees found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30 text-xs text-slate-500">Showing {filtered.length} of {store.employees.length} employees</div>
      </div>

      {/* Invite Modal */}
      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Employee" subtitle="Send a coaching platform invitation">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label><input type="text" value={inviteForm.name} onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })} placeholder="Jane Smith" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label><input type="email" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="jane@techcorp.io" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label><input type="text" value={inviteForm.role} onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })} placeholder="Engineering Manager" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label><select value={inviteForm.department} onChange={e => setInviteForm({ ...inviteForm, department: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 bg-white">{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowInvite(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleInvite} disabled={!inviteForm.name.trim() || !inviteForm.email.trim()} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 disabled:opacity-40 transition-all btn-ripple flex items-center justify-center gap-2"><Mail className="w-4 h-4" /> Send Invite</button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingId} onClose={() => setEditingId(null)} title="Edit Employee">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label><input type="text" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label><select value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100">{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label><select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100">{['active', 'invited', 'inactive'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditingId(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleEdit} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 transition-all btn-ripple">Save Changes</button>
          </div>
        </div>
      </Modal>

      {/* CSV Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Bulk CSV Upload" subtitle="Import employees from a CSV file">
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs font-medium text-slate-700 mb-1">Required format:</p><code className="text-xs text-slate-500 block">name, email, role, department</code></div>
          <textarea value={csvText} onChange={e => setCsvText(e.target.value)} placeholder={"name, email, role, department\nJane Smith, jane@company.com, Manager, Engineering\nJohn Doe, john@company.com, Lead, Product"} rows={6} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 resize-none" />
          <div className="flex gap-3">
            <button onClick={() => setShowUpload(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleCsvImport} disabled={!csvText.trim()} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 disabled:opacity-40 transition-all btn-ripple flex items-center justify-center gap-2"><Upload className="w-4 h-4" /> Import</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Remove Employee" size="sm">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
          <p className="text-sm text-slate-600 mb-6">Are you sure you want to remove <strong>{store.employees.find(e => e.id === showDeleteConfirm)?.name}</strong>? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={() => { if (showDeleteConfirm) store.deleteEmployee(showDeleteConfirm); setShowDeleteConfirm(null); }} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all btn-ripple">Remove</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
