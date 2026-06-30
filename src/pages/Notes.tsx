import { useState } from 'react';
import { Plus, Pin, Trash2, Edit3, Search, Save, StickyNote, Calendar } from 'lucide-react';
import Modal from '../components/Modal';
import type { Store } from '../store/useStore';

export default function Notes({ store }: { store: Store }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ content: '', pinned: false });
  const [filterPinned, setFilterPinned] = useState(false);

  const filtered = store.notes
    .filter(n => !filterPinned || n.pinned)
    .filter(n => n.content.toLowerCase().includes(search.toLowerCase()));

  const pinnedNotes = store.notes.filter(n => n.pinned);

  const handleCreate = () => {
    store.addNote({ sessionId: '', content: form.content, createdAt: new Date().toISOString().split('T')[0], pinned: form.pinned });
    setForm({ content: '', pinned: false });
    setShowCreate(false);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    store.updateNote(editingId, { content: form.content, pinned: form.pinned });
    store.addToast('success', 'Note updated');
    setEditingId(null);
    setForm({ content: '', pinned: false });
  };

  const startEdit = (id: string) => {
    const n = store.notes.find(n => n.id === id);
    if (!n) return;
    setForm({ content: n.content, pinned: n.pinned });
    setEditingId(id);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between anim-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notes & Insights</h1>
          <p className="text-slate-500 mt-1">Save key takeaways from your coaching sessions</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 transition-all flex items-center gap-2 shadow-sm btn-ripple interactive">
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 anim-fade-in-up">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" />
        </div>
        <button onClick={() => setFilterPinned(!filterPinned)} className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all btn-ripple ${filterPinned ? 'bg-spark-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <Pin className="w-4 h-4" /> Pinned ({pinnedNotes.length})
        </button>
      </div>

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 anim-fade-in">
          <StickyNote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No notes yet</p>
          <p className="text-sm text-slate-400">Save insights from coaching sessions or create your own</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filtered.map(note => (
            <div key={note.id} className={`bg-white rounded-2xl border p-5 card-hover anim-fade-in-up group relative ${note.pinned ? 'border-spark-200 ring-1 ring-spark-100' : 'border-slate-100'}`}>
              {note.pinned && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-spark-500 rounded-full flex items-center justify-center shadow-sm anim-pop">
                  <Pin className="w-3 h-3 text-white" />
                </div>
              )}
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap line-clamp-4 mb-4">{note.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{note.createdAt}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => store.updateNote(note.id, { pinned: !note.pinned })} className={`p-1.5 rounded-lg transition-all ${note.pinned ? 'text-spark-500 hover:bg-spark-50' : 'text-slate-400 hover:bg-slate-100'}`} title="Pin">
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => startEdit(note.id)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all" title="Edit">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => store.deleteNote(note.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Note" subtitle="Capture an insight or takeaway">
        <div className="space-y-4">
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your insight..." rows={5} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 resize-none" autoFocus />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-spark-500 focus:ring-spark-400" />
            <span className="text-sm text-slate-700">Pin this note</span>
          </label>
          <div className="flex gap-3">
            <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleCreate} disabled={!form.content.trim()} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 disabled:opacity-40 transition-all btn-ripple flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Note
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingId} onClose={() => setEditingId(null)} title="Edit Note">
        <div className="space-y-4">
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 resize-none" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-spark-500 focus:ring-spark-400" />
            <span className="text-sm text-slate-700">Pin this note</span>
          </label>
          <div className="flex gap-3">
            <button onClick={() => setEditingId(null)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleUpdate} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 transition-all btn-ripple flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Update
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
