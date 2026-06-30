import { useState } from 'react';
import { Target, Plus, Edit3, Trash2, CheckCircle2, Clock, Pause, Play, Trophy } from 'lucide-react';
import Modal from '../components/Modal';
import type { Store } from '../store/useStore';
import { leadershipChallenges } from '../data/dummyData';

export default function Goals({ store }: { store: Store }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const [form, setForm] = useState({ title: '', description: '', target: 5, category: leadershipChallenges[0], dueDate: '2025-03-31' });

  const filtered = store.goals.filter(g => filter === 'all' || g.status === filter);
  const activeCount = store.goals.filter(g => g.status === 'active').length;
  const completedCount = store.goals.filter(g => g.status === 'completed').length;

  const handleCreate = () => {
    store.addGoal({ ...form, progress: 0, status: 'active' });
    setForm({ title: '', description: '', target: 5, category: leadershipChallenges[0], dueDate: '2025-03-31' });
    setShowCreate(false);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    store.updateGoal(editingId, { title: form.title, description: form.description, target: form.target, category: form.category, dueDate: form.dueDate });
    setEditingId(null);
    setForm({ title: '', description: '', target: 5, category: leadershipChallenges[0], dueDate: '2025-03-31' });
  };

  const startEdit = (id: string) => {
    const g = store.goals.find(g => g.id === id);
    if (!g) return;
    setForm({ title: g.title, description: g.description, target: g.target, category: g.category, dueDate: g.dueDate });
    setEditingId(id);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between anim-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leadership Goals</h1>
          <p className="text-slate-500 mt-1">Track your growth objectives and milestones</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 transition-all flex items-center gap-2 shadow-sm btn-ripple interactive">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 stagger">
        {[
          { label: 'Active Goals', value: activeCount, icon: Target, color: 'bg-ocean-50 text-ocean-600' },
          { label: 'Completed', value: completedCount, icon: Trophy, color: 'bg-mint-50 text-mint-600' },
          { label: 'Total Progress', value: `${store.goals.length > 0 ? Math.round(store.goals.reduce((sum, g) => sum + (g.progress / g.target) * 100, 0) / store.goals.length) : 0}%`, icon: CheckCircle2, color: 'bg-spark-50 text-spark-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 card-hover anim-fade-in-up">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-sm text-slate-500">{s.label}</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 anim-fade-in-up">
        {(['all', 'active', 'completed', 'paused'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all btn-ripple ${filter === f ? 'bg-spark-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-4 stagger">
        {filtered.length === 0 && (
          <div className="text-center py-16 anim-fade-in">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No goals found</p>
            <p className="text-sm text-slate-400">Create your first leadership goal to get started</p>
          </div>
        )}
        {filtered.map((goal) => {
          const pct = Math.round((goal.progress / goal.target) * 100);
          return (
            <div key={goal.id} className="bg-white rounded-2xl border border-slate-100 p-6 card-hover anim-fade-in-up group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${goal.status === 'completed' ? 'bg-mint-100' : goal.status === 'paused' ? 'bg-slate-100' : 'bg-spark-100'}`}>
                    {goal.status === 'completed' ? <Trophy className="w-5 h-5 text-mint-600" /> : goal.status === 'paused' ? <Pause className="w-5 h-5 text-slate-500" /> : <Target className="w-5 h-5 text-spark-600" />}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${goal.status === 'completed' ? 'text-mint-700 line-through' : 'text-slate-900'}`}>{goal.title}</h3>
                    <p className="text-sm text-slate-500">{goal.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {goal.status === 'active' && (
                    <>
                      <button onClick={() => store.updateGoal(goal.id, { progress: Math.min(goal.progress + 1, goal.target) })} className="p-2 text-mint-500 hover:bg-mint-50 rounded-lg transition-all" title="Log progress"><Plus className="w-4 h-4" /></button>
                      <button onClick={() => store.updateGoal(goal.id, { status: 'paused' })} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all" title="Pause"><Pause className="w-4 h-4" /></button>
                      <button onClick={() => store.updateGoal(goal.id, { status: 'completed', progress: goal.target })} className="p-2 text-mint-500 hover:bg-mint-50 rounded-lg transition-all" title="Complete"><CheckCircle2 className="w-4 h-4" /></button>
                    </>
                  )}
                  {goal.status === 'paused' && (
                    <button onClick={() => store.updateGoal(goal.id, { status: 'active' })} className="p-2 text-ocean-500 hover:bg-ocean-50 rounded-lg transition-all" title="Resume"><Play className="w-4 h-4" /></button>
                  )}
                  <button onClick={() => startEdit(goal.id)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all" title="Edit"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => store.deleteGoal(goal.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${goal.status === 'completed' ? 'bg-gradient-to-r from-mint-400 to-mint-500' : 'bg-gradient-to-r from-spark-400 to-spark-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-700 w-16 text-right">{goal.progress}/{goal.target}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-500">{goal.category}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{goal.dueDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Goal" subtitle="Set a leadership development goal">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Goal Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Improve feedback delivery" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does success look like?" rows={2} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Target (milestones)</label>
              <input type="number" value={form.target} onChange={e => setForm({ ...form, target: parseInt(e.target.value) || 1 })} min={1} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 bg-white">
              {leadershipChallenges.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleCreate} disabled={!form.title.trim()} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 disabled:opacity-40 transition-all btn-ripple">Create Goal</button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingId} onClose={() => setEditingId(null)} title="Edit Goal">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Goal Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Target</label>
              <input type="number" value={form.target} onChange={e => setForm({ ...form, target: parseInt(e.target.value) || 1 })} min={1} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditingId(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleUpdate} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 transition-all btn-ripple">Save Changes</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
