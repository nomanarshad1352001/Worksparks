import { useState } from 'react';
import { HelpCircle, ChevronDown, MessageSquare, Mail, Book, ExternalLink, Search } from 'lucide-react';
import type { Store } from '../store/useStore';

const faqs = [
  { q: 'How does AI coaching work?', a: 'Worksparks uses GPT-5.1 to provide personalised leadership coaching. Share a challenge, situation, or question, and the AI will guide you through evidence-based frameworks, role-play scenarios, and actionable strategies. Every conversation is private and encrypted.' },
  { q: 'Is my data private?', a: 'Absolutely. All coaching conversations are encrypted end-to-end and stored securely in Firebase. Your individual conversations are never shared with HR administrators. Only anonymised, aggregate analytics are available at the organisation level.' },
  { q: 'How does team billing work?', a: 'Team plans ($199/mo) include 5-20 seats. Enterprise plans ($25/user/mo) support 20+ seats. Billing is managed through Stripe with automatic seat-based calculations. You only pay for active seats.' },
  { q: 'Can I export my coaching data?', a: 'Yes! You can export session notes, insights, and analytics reports in both PDF and CSV formats. Navigate to the Analytics page and click the export buttons.' },
  { q: 'What frameworks does the AI coach use?', a: 'The AI draws from established leadership frameworks including SBI (Situation-Behavior-Impact), Radical Candor, the GROW model, Situational Leadership, and many more. It adapts its approach based on your role, team size, and specific challenges.' },
  { q: 'How do I add team members?', a: 'Go to Team Management, click "Invite Employee" to add individuals, or use "CSV Upload" to bulk import. Invitees will receive an email to join the platform.' },
  { q: 'What is the enterprise onboarding fee?', a: 'For organisations with 50+ seats, we recommend a one-time onboarding fee ($2,000-$5,000) covering SSO setup, custom configuration, admin training, and dedicated support. This fee is waived for annual contracts over $25,000.' },
  { q: 'Can I use Worksparks on mobile?', a: 'Yes! Worksparks is a Progressive Web App (PWA). On iOS, open the site in Safari, tap the share button, and select "Add to Home Screen." On Android, you\'ll see an install prompt automatically.' },
];

export default function Help({ store }: { store: Store }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center anim-fade-in-up">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-spark-500/20 anim-float">
          <HelpCircle className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">How can we help?</h1>
        <p className="text-slate-500">Find answers to common questions or get in touch with support</p>
      </div>

      <div className="relative max-w-lg mx-auto anim-fade-in-up">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search help articles..." className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 shadow-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
        {[
          { icon: Book, title: 'Documentation', desc: 'Guides and tutorials', color: 'bg-ocean-50 text-ocean-600' },
          { icon: MessageSquare, title: 'Live Chat', desc: 'Chat with support', color: 'bg-mint-50 text-mint-600' },
          { icon: Mail, title: 'Email Support', desc: 'support@worksparks.com', color: 'bg-spark-50 text-spark-600' },
        ].map((item, i) => (
          <button key={i} onClick={() => store.addToast('info', `${item.title} — Feature coming soon!`)} className="bg-white rounded-2xl border border-slate-100 p-6 text-left card-hover anim-fade-in-up group btn-ripple">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} mb-3 group-hover:scale-110 transition-transform`}><item.icon className="w-5 h-5" /></div>
            <h3 className="font-semibold text-slate-900 group-hover:text-spark-600 transition-colors flex items-center gap-1">{item.title} <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
            <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden anim-fade-in-up">
        <div className="px-6 py-4 border-b border-slate-100"><h2 className="font-semibold text-slate-900">Frequently Asked Questions</h2></div>
        <div className="divide-y divide-slate-50">
          {filteredFaqs.map((faq, i) => (
            <div key={i}>
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                <span className="text-sm font-medium text-slate-900 group-hover:text-spark-600 transition-colors pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180 text-spark-500' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5 anim-fade-in-down">
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-400"><HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">No results found</p></div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-up">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-spark-500" /> Contact Support</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label><input type="text" value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} placeholder="Brief description of your issue" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label><textarea value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Describe your question or issue in detail..." rows={4} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 resize-none" /></div>
          <button onClick={() => { store.addToast('success', 'Message sent! We\'ll get back to you within 24 hours.'); setContactForm({ subject: '', message: '' }); }} disabled={!contactForm.subject.trim() || !contactForm.message.trim()} className="px-6 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 disabled:opacity-40 transition-all btn-ripple flex items-center gap-2"><Mail className="w-4 h-4" /> Send Message</button>
        </div>
      </div>
    </div>
  );
}
