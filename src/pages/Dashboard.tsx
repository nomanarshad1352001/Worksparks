import { useState, useEffect } from 'react';
import { MessageSquare, TrendingUp, Flame, Target, Clock, ArrowRight, Sparkles, Brain, Trophy, ChevronRight, Zap, Calendar } from 'lucide-react';
import type { Store } from '../store/useStore';

interface DashboardProps {
  store: Store;
  onNavigate: (page: string) => void;
}

function AnimatedNumber({ value, suffix = '' }: { value: number | string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const num = typeof value === 'string' ? parseInt(value) || 0 : value;
    let start = 0;
    const step = Math.max(1, Math.floor(num / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setDisplay(num); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}{suffix}</>;
}

export default function Dashboard({ store, onNavigate }: DashboardProps) {
  const { user, sessions, goals } = store;
  const completedGoals = goals.filter(g => g.status === 'completed').length;

  const stats = [
    { label: 'Sessions', value: user.sessionsCompleted, icon: MessageSquare, bg: 'bg-ocean-50', text: 'text-ocean-600', gradient: 'from-ocean-500 to-ocean-600' },
    { label: 'Day Streak', value: user.streakDays, icon: Flame, bg: 'bg-spark-50', text: 'text-spark-600', gradient: 'from-spark-500 to-spark-600' },
    { label: 'Insights', value: 87, icon: Brain, bg: 'bg-purple-50', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
    { label: 'Goals Done', value: completedGoals, icon: Trophy, bg: 'bg-mint-50', text: 'text-mint-600', gradient: 'from-mint-500 to-mint-600' },
  ];

  const quickActions = [
    { label: 'Start Session', icon: MessageSquare, page: 'coaching', color: 'from-spark-500 to-spark-600' },
    { label: 'Set a Goal', icon: Target, page: 'goals', color: 'from-ocean-500 to-ocean-600' },
    { label: 'View Analytics', icon: TrendingUp, page: 'analytics', color: 'from-mint-500 to-mint-600' },
    { label: 'Manage Team', icon: Zap, page: 'team', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white anim-fade-in-up">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-spark-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-ocean-500/10 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-spark-400 font-medium text-sm mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 anim-float" /> Good morning
            </p>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-slate-300 max-w-lg">
              You're on a <span className="text-spark-400 font-semibold">{user.streakDays}-day</span> coaching streak.
              Your focus: <span className="text-spark-400 font-medium">{user.topChallenge.toLowerCase()}</span>.
            </p>
          </div>
          <button
            onClick={() => onNavigate('coaching')}
            className="px-6 py-3 bg-gradient-to-r from-spark-500 to-spark-600 rounded-xl font-semibold hover:from-spark-600 hover:to-spark-700 transition-all shadow-lg shadow-spark-500/25 flex items-center gap-2 btn-ripple interactive"
          >
            <MessageSquare className="w-4 h-4" /> Start Session
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 card-hover anim-fade-in-up cursor-pointer group" onClick={() => onNavigate(i === 0 ? 'coaching' : i === 1 ? 'coaching' : i === 2 ? 'notes' : 'goals')}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-5 h-5 ${stat.text}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-mint-500 opacity-60" />
            </div>
            <p className="text-2xl font-bold text-slate-900 anim-count"><AnimatedNumber value={stat.value} /></p>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => onNavigate(action.page)}
            className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 transition-all card-hover text-left group anim-fade-in-up btn-ripple"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-semibold text-slate-900 group-hover:text-spark-600 transition-colors flex items-center gap-1">
              {action.label}
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </p>
          </button>
        ))}
      </div>

      {/* Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden anim-fade-in-up">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Coaching Sessions</h2>
            <button onClick={() => onNavigate('coaching')} className="text-sm text-spark-600 hover:text-spark-700 font-medium flex items-center gap-1 interactive">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-50 stagger">
            {sessions.slice(0, 4).map((session) => (
              <div key={session.id} className="px-6 py-4 hover:bg-spark-50/30 transition-all cursor-pointer group anim-fade-in-left" onClick={() => onNavigate('coaching')}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                    session.sentiment === 'positive' ? 'bg-mint-100 text-mint-600' :
                    session.sentiment === 'reflective' ? 'bg-ocean-100 text-ocean-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-slate-900 group-hover:text-spark-600 transition-colors">{session.topic}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        session.sentiment === 'positive' ? 'bg-mint-100 text-mint-700' :
                        session.sentiment === 'reflective' ? 'bg-ocean-100 text-ocean-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{session.challengeCategory}</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1">{session.summary}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{session.duration} min</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{session.date}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-spark-500 group-hover:translate-x-1 transition-all mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 stagger">
          {/* Active Goals */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-right">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Target className="w-5 h-5 text-spark-500" /> Active Goals</h2>
              <button onClick={() => onNavigate('goals')} className="text-xs text-spark-600 hover:text-spark-700 font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {goals.filter(g => g.status === 'active').slice(0, 3).map((goal) => (
                <div key={goal.id} className="group cursor-pointer" onClick={() => onNavigate('goals')}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-700 font-medium group-hover:text-spark-600 transition-colors truncate pr-2">{goal.title}</span>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{goal.progress}/{goal.target}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-spark-400 to-spark-500 rounded-full transition-all duration-1000 anim-progress"
                      style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insight */}
          <div className="bg-gradient-to-br from-spark-50 to-orange-50 rounded-2xl border border-spark-100 p-6 anim-fade-in-right card-hover cursor-pointer" onClick={() => onNavigate('notes')}>
            <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-spark-500" /> Latest Insight
            </h2>
            <blockquote className="text-sm text-slate-700 italic leading-relaxed border-l-3 border-spark-400 pl-4">
              "{sessions[0]?.keyInsight}"
            </blockquote>
            <p className="text-xs text-slate-500 mt-3">From: {sessions[0]?.topic}</p>
          </div>

          {/* CTA */}
          <button
            onClick={() => onNavigate('coaching')}
            className="w-full bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-2xl p-5 text-left hover:from-spark-600 hover:to-spark-700 transition-all shadow-lg shadow-spark-500/20 group btn-ripple anim-fade-in-right interactive"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Start a Session</p>
                <p className="text-sm text-white/70">Pick up where you left off</p>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
