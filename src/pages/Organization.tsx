import { useState } from 'react';
import { Building2, Globe, Users, Shield, Settings, Crown, Calendar, Mail, Save } from 'lucide-react';
import type { Store } from '../store/useStore';

export default function Organization({ store }: { store: Store }) {
  const org = store.organizations[0];
  const [form, setForm] = useState({ name: org.name, domain: org.domain });
  const [sso, setSso] = useState(true);
  const [domainRestrict, setDomainRestrict] = useState(true);
  const admins = store.employees.filter(e => ['e1', 'e5'].includes(e.id));

  const handleSave = () => {
    store.updateOrganization(org.id, { name: form.name, domain: form.domain });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="anim-fade-in-up"><h1 className="text-2xl font-bold text-slate-900">Organization Settings</h1><p className="text-slate-500 mt-1">Manage your organization's account and settings</p></div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden anim-fade-in-up">
        <div className="h-24 bg-gradient-to-r from-ocean-600 via-ocean-500 to-ocean-400 relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 anim-gradient" /></div>
        <div className="px-8 pb-8 -mt-8 relative">
          <div className="flex items-end gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center interactive"><Building2 className="w-8 h-8 text-ocean-600" /></div>
            <div className="flex-1 pb-1"><h2 className="text-xl font-bold text-slate-900">{form.name}</h2><p className="text-slate-500 text-sm flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {form.domain}</p></div>
            <span className="px-3 py-1 bg-ocean-100 text-ocean-700 text-xs font-semibold rounded-full uppercase anim-pop">{org.plan}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-left">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-spark-500" /> Organization Details</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-600 mb-1.5">Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1.5">Domain</label><input type="text" value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1.5">Created</label><p className="text-sm text-slate-900 flex items-center gap-2 py-2"><Calendar className="w-4 h-4 text-slate-400" /> {org.createdDate}</p></div>
            <button onClick={handleSave} className="px-5 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 transition-all btn-ripple interactive flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-right">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-spark-500" /> Administrators</h2>
          <div className="space-y-3 stagger">
            {admins.map(admin => (
              <div key={admin.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl card-hover anim-fade-in-left">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-xs font-semibold">{admin.avatar}</div>
                <div className="flex-1"><p className="text-sm font-medium text-slate-900">{admin.name}</p><p className="text-xs text-slate-500">{admin.email}</p></div>
                <span className="px-2 py-1 bg-spark-100 text-spark-700 text-xs font-medium rounded-full">Admin</span>
              </div>
            ))}
            <button onClick={() => store.addToast('info', 'Admin invitation feature coming soon')} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:border-spark-300 hover:text-spark-600 hover:bg-spark-50/30 transition-all flex items-center justify-center gap-2 btn-ripple"><Mail className="w-4 h-4" /> Add Administrator</button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-ocean-500" /> Security</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div><p className="text-sm font-medium text-slate-900">Require SSO</p><p className="text-xs text-slate-500">Force sign-in through your identity provider</p></div>
                <button onClick={() => { setSso(!sso); store.addToast(sso ? 'warning' : 'success', sso ? 'SSO requirement disabled' : 'SSO requirement enabled'); }} className={`w-11 h-6 rounded-full relative transition-colors ${sso ? 'bg-mint-500' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${sso ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div><p className="text-sm font-medium text-slate-900">Domain Restriction</p><p className="text-xs text-slate-500">Only allow @{form.domain} emails</p></div>
                <button onClick={() => { setDomainRestrict(!domainRestrict); store.addToast(domainRestrict ? 'warning' : 'success', domainRestrict ? 'Domain restriction disabled' : 'Domain restriction enabled'); }} className={`w-11 h-6 rounded-full relative transition-colors ${domainRestrict ? 'bg-mint-500' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${domainRestrict ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-up">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-spark-500" /> Seat Allocation</h2>
        <div className="grid grid-cols-4 gap-6 text-center">
          {[
            { label: 'Total', value: org.seats, color: 'text-slate-900' },
            { label: 'Active', value: store.employees.filter(e => e.status === 'active').length, color: 'text-mint-600' },
            { label: 'Invited', value: store.employees.filter(e => e.status === 'invited').length, color: 'text-spark-600' },
            { label: 'Available', value: Math.max(0, org.seats - store.employees.length), color: 'text-slate-400' },
          ].map((s, i) => (
            <div key={i}><p className={`text-3xl font-bold ${s.color}`}>{s.value}</p><p className="text-sm text-slate-500">{s.label}</p></div>
          ))}
        </div>
        <div className="mt-4 w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-mint-500 transition-all duration-700" style={{ width: `${(store.employees.filter(e => e.status === 'active').length / org.seats) * 100}%` }} />
          <div className="h-full bg-spark-400 transition-all duration-700" style={{ width: `${(store.employees.filter(e => e.status === 'invited').length / org.seats) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
