import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Download, ArrowUpRight, FileText, RefreshCw } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { sessionTrends, challengeCategories, departmentStats, weeklyActivity } from '../data/dummyData';
import type { Store } from '../store/useStore';

export default function Analytics({ store }: { store: Store }) {
  const [timeRange, setTimeRange] = useState('6m');
  const [refreshing, setRefreshing] = useState(false);
  const org = store.organizations[0];

  const handleExport = (type: string) => {
    store.addToast('success', `${type} report downloaded successfully`);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); store.addToast('info', 'Analytics data refreshed'); }, 1500);
  };

  const kpis = [
    { label: 'Total Sessions', value: '814', change: '+23%', icon: BarChart3, color: 'bg-ocean-50 text-ocean-600' },
    { label: 'Active Users', value: String(store.employees.filter(e => e.status === 'active').length), change: '+12%', icon: Users, color: 'bg-mint-50 text-mint-600' },
    { label: 'Avg Sessions/User', value: '6.4', change: '+8%', icon: TrendingUp, color: 'bg-spark-50 text-spark-600' },
    { label: 'Org Uptake Rate', value: '76%', change: '+5%', icon: ArrowUpRight, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 anim-fade-in-up">
        <div><h1 className="text-2xl font-bold text-slate-900">HR / L&D Analytics</h1><p className="text-slate-500 mt-1">Anonymised coaching insights for {org.name}</p></div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
            {['1m', '3m', '6m', '1y'].map(t => (
              <button key={t} onClick={() => setTimeRange(t)} className={`px-3 py-2 text-xs font-medium transition-all ${timeRange === t ? 'bg-spark-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{t.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={handleRefresh} className={`p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all ${refreshing ? 'animate-spin' : ''}`}><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => handleExport('PDF')} className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2 btn-ripple interactive"><Download className="w-4 h-4" /> PDF</button>
          <button onClick={() => handleExport('CSV')} className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2 btn-ripple interactive"><FileText className="w-4 h-4" /> CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 card-hover anim-fade-in-up cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}><kpi.icon className="w-5 h-5" /></div>
              <span className="text-xs font-semibold text-mint-600 bg-mint-50 px-2 py-1 rounded-full">{kpi.change}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-up card-hover">
          <h2 className="font-semibold text-slate-900 mb-1">Session Volume & User Growth</h2>
          <p className="text-sm text-slate-500 mb-6">Monthly coaching sessions and active users</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={sessionTrends}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f19338" stopOpacity={0.2} /><stop offset="95%" stopColor="#f19338" stopOpacity={0} /></linearGradient>
                <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#338dfc" stopOpacity={0.2} /><stop offset="95%" stopColor="#338dfc" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="sessions" stroke="#f19338" strokeWidth={2.5} fill="url(#sg)" name="Sessions" animationDuration={1500} />
              <Area type="monotone" dataKey="users" stroke="#338dfc" strokeWidth={2.5} fill="url(#ug)" name="Active Users" animationDuration={1500} animationBegin={300} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-right card-hover">
          <h2 className="font-semibold text-slate-900 mb-1">Challenge Categories</h2>
          <p className="text-sm text-slate-500 mb-4">What leaders are working on</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={challengeCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" animationDuration={1200}>
                {challengeCategories.map((entry, index) => <Cell key={index} fill={entry.color} className="cursor-pointer hover:opacity-80 transition-opacity" />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {challengeCategories.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} /><span className="text-slate-600 text-xs">{cat.name}</span></div>
                <span className="text-slate-900 font-medium text-xs">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-left card-hover">
          <h2 className="font-semibold text-slate-900 mb-1">Weekly Activity Pattern</h2>
          <p className="text-sm text-slate-500 mb-6">When employees use coaching most</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="sessions" fill="#f19338" radius={[6, 6, 0, 0]} name="Sessions" animationDuration={1200} className="cursor-pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-right card-hover">
          <h2 className="font-semibold text-slate-900 mb-1">Coaching Uptake by Department</h2>
          <p className="text-sm text-slate-500 mb-6">Anonymised team-level data</p>
          <div className="space-y-4 stagger">
            {departmentStats.map((dept, i) => (
              <div key={i} className="cursor-pointer hover:bg-slate-50 rounded-xl p-2 -mx-2 transition-all group anim-fade-in-left">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-900 group-hover:text-spark-600 transition-colors">{dept.department}</span>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{dept.employees} ppl</span>
                    <span>{dept.activeSessions} sessions</span>
                    <span className="font-semibold text-slate-900">{dept.uptake}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 anim-progress" style={{ width: `${dept.uptake}%`, background: `linear-gradient(to right, ${dept.uptake >= 80 ? '#3ccb93' : dept.uptake >= 60 ? '#f19338' : '#94a3b8'}, ${dept.uptake >= 80 ? '#18b07a' : dept.uptake >= 60 ? '#ee7a16' : '#64748b'})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex items-start gap-3 anim-fade-in-up">
        <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Data Privacy & Anonymisation</p>
          <p className="text-xs text-slate-500 mt-1">All analytics are anonymised at the organisation level. Individual coaching conversations are never shared with HR administrators. Only aggregate session counts, challenge categories, and departmental uptake rates are visible.</p>
        </div>
      </div>
    </div>
  );
}
