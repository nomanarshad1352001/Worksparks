import { useState } from 'react';
import { CreditCard, Check, Download, Calendar, ArrowRight, Receipt, AlertCircle, Zap, Edit3 } from 'lucide-react';
import Modal from '../components/Modal';
import type { Store } from '../store/useStore';

const invoices = [
  { id: 'INV-2025-001', date: 'Jan 1, 2025', amount: '$950.00', status: 'Paid', seats: 38 },
  { id: 'INV-2024-012', date: 'Dec 1, 2024', amount: '$850.00', status: 'Paid', seats: 34 },
  { id: 'INV-2024-011', date: 'Nov 1, 2024', amount: '$750.00', status: 'Paid', seats: 30 },
  { id: 'INV-2024-010', date: 'Oct 1, 2024', amount: '$600.00', status: 'Paid', seats: 24 },
];

export default function Billing({ store }: { store: Store }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const org = store.organizations[0];
  const seats = store.employees.length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="anim-fade-in-up"><h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1><p className="text-slate-500 mt-1">Manage your plan, payment method, and invoices</p></div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden anim-fade-in-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-spark-500/20 to-transparent rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1"><Zap className="w-5 h-5 text-spark-400" /><span className="text-sm font-medium text-spark-400">Current Plan</span></div>
            <h2 className="text-3xl font-bold mb-1">Enterprise</h2>
            <p className="text-slate-300">$25/user/month · {seats} active seats</p>
            <div className="flex items-center gap-6 mt-6">
              <div><p className="text-2xl font-bold">${seats * 25}</p><p className="text-xs text-slate-400">Monthly total</p></div>
              <div className="w-px h-10 bg-slate-700" />
              <div><p className="text-2xl font-bold">{seats}</p><p className="text-xs text-slate-400">Active seats</p></div>
              <div className="w-px h-10 bg-slate-700" />
              <div><p className="text-2xl font-bold">{org.seats - seats}</p><p className="text-xs text-slate-400">Available</p></div>
            </div>
          </div>
          <button onClick={() => store.addToast('info', 'Plan management coming soon')} className="px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors backdrop-blur-sm btn-ripple">Manage Plan</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-left">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-spark-500" /> Payment Method</h2>
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl group">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-700 to-blue-900 rounded-md flex items-center justify-center text-white text-xs font-bold">VISA</div>
            <div className="flex-1"><p className="text-sm font-medium text-slate-900">•••• •••• •••• 4242</p><p className="text-xs text-slate-500">Expires 12/2027</p></div>
            <button onClick={() => setShowPaymentModal(true)} className="text-sm text-spark-600 font-medium hover:text-spark-700 interactive flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Update</button>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-500"><Check className="w-3.5 h-3.5 text-mint-500" /><span>Secured by Stripe. PCI DSS Level 1 compliant.</span></div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 anim-fade-in-right">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Receipt className="w-5 h-5 text-spark-500" /> Billing Details</h2>
          <div className="space-y-3">
            {[
              { label: 'Company', value: 'TechCorp Pty Ltd' },
              { label: 'Billing Email', value: 'billing@techcorp.io' },
              { label: 'Next Invoice', value: 'Feb 1, 2025' },
              { label: 'Billing Cycle', value: 'Monthly' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between text-sm"><span className="text-slate-500">{item.label}</span><span className="font-medium text-slate-900">{item.value}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-spark-50 rounded-2xl border border-spark-200 p-5 flex items-start gap-3 anim-fade-in-up cursor-pointer hover:bg-spark-100/50 transition-colors" onClick={() => store.addToast('info', 'Contact your success manager to discuss onboarding')}>
        <AlertCircle className="w-5 h-5 text-spark-600 flex-shrink-0 mt-0.5" />
        <div><p className="text-sm font-semibold text-slate-900">Enterprise Onboarding Fee</p><p className="text-sm text-slate-600 mt-1">For organizations with 50+ seats, we recommend a one-time onboarding fee ($2,000 – $5,000) covering SSO setup, custom configuration, admin training, and dedicated onboarding support. Click to learn more.</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden anim-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Invoice History</h2>
          <button onClick={() => store.addToast('success', 'All invoices exported')} className="text-sm text-spark-600 font-medium hover:text-spark-700 flex items-center gap-1 interactive">Export All <ArrowRight className="w-3.5 h-3.5" /></button>
        </div>
        <table className="w-full">
          <thead><tr className="bg-slate-50/50">
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Invoice</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Seats</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase"></th>
          </tr></thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-spark-50/20 transition-all cursor-pointer group">
                <td className="px-6 py-4 text-sm font-medium text-slate-900 group-hover:text-spark-600 transition-colors">{inv.id}</td>
                <td className="px-6 py-4 text-sm text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {inv.date}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{inv.seats}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{inv.amount}</td>
                <td className="px-6 py-4"><span className="inline-flex items-center gap-1 text-xs font-medium text-mint-700 bg-mint-50 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> {inv.status}</span></td>
                <td className="px-6 py-4 text-right"><button onClick={() => store.addToast('success', `${inv.id} downloaded`)} className="p-2 text-slate-400 hover:text-spark-600 hover:bg-spark-50 rounded-lg transition-all"><Download className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Update Payment Method" subtitle="Update your credit or debit card">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Card Number</label><input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry</label><input type="text" placeholder="MM/YY" maxLength={5} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">CVC</label><input type="text" placeholder="123" maxLength={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100" /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={() => { store.addToast('success', 'Payment method updated'); setShowPaymentModal(false); setCardNumber(''); }} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl text-sm font-semibold hover:from-spark-600 hover:to-spark-700 transition-all btn-ripple">Update Card</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
