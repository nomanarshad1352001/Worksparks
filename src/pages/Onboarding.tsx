import { useState } from 'react';
import { Zap, ArrowRight, ArrowLeft, User, Briefcase, Users, Target, Sparkles, Check, Rocket } from 'lucide-react';
import { leadershipChallenges, roleOptions, teamSizeOptions } from '../data/dummyData';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right');
  const [formData, setFormData] = useState({ name: '', role: '', teamSize: '', topChallenge: '' });

  const steps = [
    { title: "Welcome to Worksparks 👋", subtitle: "Let's personalise your AI coaching experience. This takes about 30 seconds.", icon: Sparkles },
    { title: "What's your name?", subtitle: "We'll use this to personalise your coaching sessions.", icon: User, field: 'name' as const },
    { title: "What's your role?", subtitle: "This helps us tailor coaching frameworks to your level.", icon: Briefcase, field: 'role' as const },
    { title: "How large is your team?", subtitle: "Team size affects the leadership challenges you'll face.", icon: Users, field: 'teamSize' as const },
    { title: "What's your top leadership challenge?", subtitle: "We'll prioritise coaching around this area.", icon: Target, field: 'topChallenge' as const },
    { title: "You're all set! 🎉", subtitle: "Your AI coaching experience has been personalised.", icon: Rocket },
  ];

  const canProceed = () => {
    if (step === 0 || step === steps.length - 1) return true;
    const s = steps[step];
    return s.field ? formData[s.field].trim() !== '' : true;
  };

  const goNext = () => {
    setAnimDir('right');
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete();
  };

  const goBack = () => {
    setAnimDir('left');
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10 anim-fade-in-up">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center shadow-lg shadow-spark-500/20 anim-pulse-ring">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Worksparks</h1>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-spark-400 to-spark-500' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* Card */}
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 ${animDir === 'right' ? 'anim-fade-in-right' : 'anim-fade-in-left'}`} key={step}>
          <div className="text-center mb-8">
            {(() => {
              const Icon = steps[step].icon;
              return (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-spark-500/20 anim-pop">
                  <Icon className="w-7 h-7 text-white" />
                </div>
              );
            })()}
            <h2 className="text-xl font-bold text-slate-900 mb-2">{steps[step].title}</h2>
            <p className="text-sm text-slate-500">{steps[step].subtitle}</p>
          </div>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-3 mb-4 stagger">
              {['Personalised AI coaching for your specific challenges', 'Science-backed leadership frameworks', 'Private, encrypted conversations', 'Track your growth over time'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl anim-fade-in-left interactive"><Check className="w-5 h-5 text-mint-500 flex-shrink-0" /><span className="text-sm text-slate-700">{item}</span></div>
              ))}
            </div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your full name" className="w-full px-5 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 text-center text-lg transition-all" autoFocus />
          )}

          {/* Step 2: Role */}
          {step === 2 && (
            <div className="space-y-2 stagger">
              {roleOptions.map(role => (
                <button key={role} onClick={() => setFormData({ ...formData, role })} className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all anim-fade-in-left btn-ripple ${formData.role === role ? 'bg-spark-500 text-white shadow-sm scale-[1.02]' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:scale-[1.01]'}`}>
                  {role}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Team Size */}
          {step === 3 && (
            <div className="space-y-2 stagger">
              {teamSizeOptions.map(size => (
                <button key={size} onClick={() => setFormData({ ...formData, teamSize: size })} className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all anim-fade-in-left btn-ripple ${formData.teamSize === size ? 'bg-spark-500 text-white shadow-sm scale-[1.02]' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:scale-[1.01]'}`}>
                  {size} people
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Challenge */}
          {step === 4 && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 stagger">
              {leadershipChallenges.map(ch => (
                <button key={ch} onClick={() => setFormData({ ...formData, topChallenge: ch })} className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all anim-fade-in-left btn-ripple ${formData.topChallenge === ch ? 'bg-spark-500 text-white shadow-sm scale-[1.02]' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:scale-[1.01]'}`}>
                  {ch}
                </button>
              ))}
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 5 && (
            <div className="space-y-3 mb-4">
              <div className="bg-gradient-to-br from-spark-50 to-orange-50 rounded-xl p-5 border border-spark-100">
                <h3 className="font-semibold text-slate-900 mb-3">Your Profile Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium text-slate-900">{formData.name || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="font-medium text-slate-900">{formData.role || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Team Size</span><span className="font-medium text-slate-900">{formData.teamSize || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Focus Area</span><span className="font-medium text-slate-900">{formData.topChallenge || '—'}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 && step < steps.length - 1 ? (
              <button onClick={goBack} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors interactive"><ArrowLeft className="w-4 h-4" /> Back</button>
            ) : <div />}
            <button onClick={goNext} disabled={!canProceed()} className="px-6 py-3 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 btn-ripple interactive">
              {step === steps.length - 1 ? 'Start Coaching' : step === 0 ? "Let's Go" : 'Continue'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">Your data is encrypted and never shared. <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span></p>
      </div>
    </div>
  );
}
