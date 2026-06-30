import { useState } from 'react';
import { User, Briefcase, Users, Target, Mail, Calendar, Award, Edit3, Save, Shield, Zap, Camera, X } from 'lucide-react';
import type { Store } from '../store/useStore';
import { roleOptions, teamSizeOptions, leadershipChallenges } from '../data/dummyData';

const avatarColors = [
  'from-spark-400 to-spark-600', 'from-ocean-400 to-ocean-600', 'from-mint-400 to-mint-600',
  'from-purple-400 to-purple-600', 'from-pink-400 to-pink-600', 'from-amber-400 to-amber-600',
];

export default function Profile({ store }: { store: Store }) {
  const [editing, setEditing] = useState(false);
  const [avatarColor, setAvatarColor] = useState(0);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [form, setForm] = useState({
    name: store.user.name,
    role: store.user.role,
    teamSize: String(store.user.teamSize),
    topChallenge: store.user.topChallenge,
  });

  const handleSave = () => {
    store.updateUser({ name: form.name, role: form.role, teamSize: parseInt(form.teamSize) || 0, topChallenge: form.topChallenge, avatar: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ name: store.user.name, role: store.user.role, teamSize: String(store.user.teamSize), topChallenge: store.user.topChallenge });
    setEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden anim-fade-in-up">
        <div className="h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-spark-500/20 via-transparent to-ocean-500/20 anim-gradient" />
        </div>
        <div className="px-8 pb-8 -mt-12 relative">
          <div className="flex items-end gap-6 flex-wrap">
            <div className="relative group">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${avatarColors[avatarColor]} flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white transition-transform group-hover:scale-105`}>
                {store.user.avatar}
              </div>
              <button onClick={() => setShowAvatarPicker(!showAvatarPicker)} className="absolute -bottom-1 -right-1 w-8 h-8 bg-spark-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-spark-600 transition-colors opacity-0 group-hover:opacity-100">
                <Camera className="w-4 h-4" />
              </button>
              {showAvatarPicker && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-10 anim-scale-in">
                  <p className="text-xs text-slate-500 mb-2 font-medium">Choose color:</p>
                  <div className="flex gap-2">
                    {avatarColors.map((c, i) => (
                      <button key={i} onClick={() => { setAvatarColor(i); setShowAvatarPicker(false); }} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c} ${avatarColor === i ? 'ring-2 ring-offset-2 ring-spark-400' : ''} hover:scale-110 transition-transform`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 pb-1">
              <h1 className="text-2xl font-bold text-slate-900">{store.user.name}</h1>
              <p className="text-slate-500">{store.user.role}</p>
            </div>
            <div className="flex gap-2">
              {editing && <button onClick={handleCancel} className="px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"><X className="w-4 h-4" /> Cancel</button>}
              <button
                onClick={() => editing ? handleSave() : setEditing(true)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all btn-ripple interactive ${editing ? 'bg-gradient-to-r from-mint-500 to-mint-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {editing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-left">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-5"><User className="w-5 h-5 text-spark-500" /> Personal Information</h2>
          <div className="space-y-4">
            {[
              { label: 'Full Name', value: form.name, icon: User, field: 'name' as const, type: 'text' },
              { label: 'Email', value: store.user.email, icon: Mail, field: null, type: 'text' },
            ].map((item, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">{item.label}</label>
                {editing && item.field ? (
                  <input type="text" value={form[item.field]} onChange={e => setForm({ ...form, [item.field!]: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 transition-all" />
                ) : (
                  <p className="text-sm text-slate-900 flex items-center gap-2 py-2.5"><item.icon className="w-4 h-4 text-slate-400" /> {item.field ? form[item.field] : item.value}</p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Role</label>
              {editing ? (
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 bg-white transition-all">
                  {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              ) : <p className="text-sm text-slate-900 flex items-center gap-2 py-2.5"><Briefcase className="w-4 h-4 text-slate-400" /> {form.role}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Team Size</label>
              {editing ? (
                <select value={form.teamSize} onChange={e => setForm({ ...form, teamSize: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 bg-white transition-all">
                  {teamSizeOptions.map(s => <option key={s} value={s}>{s} people</option>)}
                </select>
              ) : <p className="text-sm text-slate-900 flex items-center gap-2 py-2.5"><Users className="w-4 h-4 text-slate-400" /> {form.teamSize} people</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Top Leadership Challenge</label>
              {editing ? (
                <select value={form.topChallenge} onChange={e => setForm({ ...form, topChallenge: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 bg-white transition-all">
                  {leadershipChallenges.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : <p className="text-sm text-slate-900 flex items-center gap-2 py-2.5"><Target className="w-4 h-4 text-slate-400" /> {form.topChallenge}</p>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-spark-50 to-orange-50 rounded-2xl border border-spark-100 p-6 anim-fade-in-right">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Zap className="w-5 h-5 text-spark-500" /> Current Plan</h2>
              <span className="px-3 py-1 bg-spark-500 text-white text-xs font-semibold rounded-full uppercase anim-pop">Enterprise</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Organization', value: 'TechCorp' },
                { label: 'Seats Used', value: `${store.organizations[0].usedSeats} / ${store.organizations[0].seats}` },
                { label: 'Monthly Cost', value: `$${store.organizations[0].monthlySpend}/mo` },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-sm"><span className="text-slate-600">{item.label}</span><span className="font-medium text-slate-900">{item.value}</span></div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-right">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><Award className="w-5 h-5 text-spark-500" /> Account Activity</h2>
            <div className="space-y-4 stagger">
              {[
                { icon: Calendar, bg: 'bg-ocean-100', text: 'text-ocean-600', title: 'Member Since', sub: 'November 2024' },
                { icon: Award, bg: 'bg-mint-100', text: 'text-mint-600', title: 'Sessions Completed', sub: `${store.user.sessionsCompleted} total sessions` },
                { icon: Shield, bg: 'bg-purple-100', text: 'text-purple-600', title: 'Privacy', sub: 'All conversations encrypted' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 anim-fade-in-left">
                  <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center`}><item.icon className={`w-4 h-4 ${item.text}`} /></div>
                  <div><p className="text-sm font-medium text-slate-900">{item.title}</p><p className="text-xs text-slate-500">{item.sub}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
