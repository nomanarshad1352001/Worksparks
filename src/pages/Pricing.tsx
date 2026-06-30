import { useState } from 'react';
import { Check, Zap, Users, Building2, ArrowRight, MessageSquare, Shield, Sparkles, CreditCard } from 'lucide-react';
import { pricingPlans } from '../data/dummyData';
import type { Store } from '../store/useStore';

export default function Pricing({ store }: { store: Store }) {
  const [annual, setAnnual] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const getPrice = (plan: typeof pricingPlans[0]) => {
    if (annual) {
      const num = parseInt(plan.price.replace('$', ''));
      return `$${Math.round(num * 0.8)}`;
    }
    return plan.price;
  };

  const handleSelect = (planId: string) => {
    store.setSelectedPlan(planId);
    store.addToast('success', `${planId.charAt(0).toUpperCase() + planId.slice(1)} plan selected! Redirecting to checkout...`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto anim-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-spark-100 text-spark-700 rounded-full text-sm font-medium mb-4 anim-pop"><Sparkles className="w-4 h-4" /> Stripe-Powered Billing</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Plans that scale with your leadership journey</h1>
        <p className="text-slate-500 mb-6">Start with a 14-day free trial. No credit card required.</p>
        <div className="inline-flex items-center bg-slate-100 rounded-xl p-1">
          <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
            Annual <span className="text-xs bg-mint-100 text-mint-700 px-2 py-0.5 rounded-full font-semibold">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto stagger">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
            className={`relative rounded-2xl p-8 flex flex-col anim-fade-in-up transition-all duration-300 ${
              plan.popular
                ? 'bg-gradient-to-b from-slate-900 to-slate-800 text-white border-2 border-spark-400 shadow-2xl shadow-spark-500/10 scale-105'
                : `bg-white border-2 ${hoveredPlan === plan.id ? 'border-spark-300 shadow-xl' : 'border-slate-200'} ${store.selectedPlan === plan.id ? 'ring-2 ring-spark-400' : ''}`
            }`}
          >
            {plan.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-spark-500 to-spark-600 rounded-full text-xs font-semibold text-white anim-pop">Most Popular</div>}
            {store.selectedPlan === plan.id && !plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-spark-500 rounded-full text-xs font-semibold text-white anim-pop">Current</div>}

            <div className="mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform ${hoveredPlan === plan.id ? 'scale-110' : ''} ${plan.popular ? 'bg-spark-500/20' : 'bg-slate-100'}`}>
                {plan.id === 'individual' && <Zap className={`w-6 h-6 ${plan.popular ? 'text-spark-400' : 'text-slate-600'}`} />}
                {plan.id === 'team' && <Users className={`w-6 h-6 ${plan.popular ? 'text-spark-400' : 'text-slate-600'}`} />}
                {plan.id === 'enterprise' && <Building2 className={`w-6 h-6 ${plan.popular ? 'text-spark-400' : 'text-slate-600'}`} />}
              </div>
              <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
              <p className={`text-sm mt-1 ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{getPrice(plan)}</span>
                <span className={`text-sm ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
              </div>
              {plan.priceNote && <p className={`text-xs mt-1 ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.priceNote}</p>}
              {annual && <p className="text-xs text-mint-500 font-medium mt-1">Billed annually — 20% savings</p>}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-spark-400' : 'text-mint-500'}`} />
                  <span className={`text-sm ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(plan.id)}
              className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all btn-ripple interactive ${
                plan.popular
                  ? 'bg-gradient-to-r from-spark-500 to-spark-600 text-white hover:from-spark-600 hover:to-spark-700 shadow-lg shadow-spark-500/25'
                  : store.selectedPlan === plan.id ? 'bg-spark-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {store.selectedPlan === plan.id ? '✓ Selected' : plan.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-8 anim-fade-in-up">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0"><Building2 className="w-6 h-6 text-spark-400" /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Enterprise Onboarding Fee Advisory</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">For Enterprise plans with 50+ seats, we recommend a one-time onboarding fee ranging from <strong>$2,000 to $5,000</strong>.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['SSO / SAML configuration', 'Custom admin dashboard setup', 'Employee onboarding workshops', 'Dedicated success manager', 'Custom reporting configuration', 'Integration with L&D tools'].map((item, i) => (
                <div key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-mint-500 flex-shrink-0" /><span className="text-sm text-slate-600">{item}</span></div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">Waived for annual prepaid contracts over $25,000.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 py-4 anim-fade-in-up">
        {[
          { icon: Shield, text: 'SOC 2 Compliant' },
          { icon: CreditCard, text: 'Stripe Secure Payments' },
          { icon: MessageSquare, text: 'End-to-End Encryption' },
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-500"><badge.icon className="w-4 h-4" />{badge.text}</div>
        ))}
      </div>
    </div>
  );
}
