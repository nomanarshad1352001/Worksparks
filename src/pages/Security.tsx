import { Shield, CheckCircle2, Lock, Eye, Server, Key, FileCode, ArrowRight, XCircle, Clock } from 'lucide-react';
import type { Store } from '../store/useStore';

interface SecurityFix {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  status: 'fixed' | 'in-progress' | 'open';
  description: string;
  details: string;
  fix: string;
}

const securityFixes: SecurityFix[] = [
  {
    id: 'sec-001',
    title: 'Firestore Rules: Cross-User Data Access',
    severity: 'critical',
    status: 'fixed',
    description: 'Firestore rules allowed any authenticated user to read other users\' private coaching conversations.',
    details: 'The existing Firestore security rules used a broad match on the conversations collection that only checked if the user was authenticated (request.auth != null) without verifying the user owns the document. This meant any logged-in user could read any other user\'s coaching history.',
    fix: `// BEFORE (Vulnerable):
match /conversations/{docId} {
  allow read: if request.auth != null;
}

// AFTER (Fixed):
match /conversations/{docId} {
  allow read: if request.auth != null 
    && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null 
    && request.auth.uid == request.resource.data.userId;
  allow update, delete: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}`,
  },
  {
    id: 'sec-002',
    title: 'AI Endpoints: No Authentication',
    severity: 'critical',
    status: 'fixed',
    description: 'AI/OpenAI API endpoints were publicly accessible with no auth, exposing the platform to uncapped API cost blowout.',
    details: 'Cloud Functions handling OpenAI API calls were deployed as public HTTP endpoints without any authentication middleware. Anyone with the URL could send requests, generating OpenAI costs. Rate limiting was also absent.',
    fix: `// BEFORE (Vulnerable):
exports.chat = functions.https.onRequest(async (req, res) => {
  const response = await openai.chat(req.body);
  res.json(response);
});

// AFTER (Fixed):
exports.chat = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'Must be logged in to use AI coaching.'
    );
  }
  
  // Rate limiting per user
  await checkRateLimit(context.auth.uid);
  
  // Verify active subscription
  await verifySubscription(context.auth.uid);
  
  const response = await openai.chat(data);
  return response;
});`,
  },
  {
    id: 'sec-003',
    title: 'Row-Level Security for User Profiles',
    severity: 'high',
    status: 'fixed',
    description: 'User profile documents need strict owner-only access rules.',
    details: 'Profile documents in the users collection should only be readable/writable by the document owner. Admin access is handled separately through custom claims.',
    fix: `match /users/{userId} {
  allow read, write: if request.auth != null 
    && request.auth.uid == userId;
}

// Admin override for org admins
match /users/{userId} {
  allow read: if request.auth != null 
    && request.auth.token.orgAdmin == true
    && resource.data.organizationId == request.auth.token.orgId;
}`,
  },
  {
    id: 'sec-004',
    title: 'Organization-Scoped Data Access',
    severity: 'high',
    status: 'fixed',
    description: 'HR analytics endpoints need org-scoped access with admin verification.',
    details: 'Analytics data should only be accessible to verified organization admins, and should only return anonymised aggregate data for their own organization.',
    fix: `match /organizations/{orgId}/analytics/{docId} {
  allow read: if request.auth != null
    && request.auth.token.orgId == orgId
    && request.auth.token.orgAdmin == true;
  allow write: if false; // Only server-side writes
}`,
  },
];

const severityStyles = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
};

const statusStyles = {
  fixed: { icon: CheckCircle2, bg: 'bg-mint-100', text: 'text-mint-700' },
  'in-progress': { icon: Clock, bg: 'bg-spark-100', text: 'text-spark-700' },
  open: { icon: XCircle, bg: 'bg-red-100', text: 'text-red-700' },
};

export default function Security({ store: _store }: { store: Store }) {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Security & Compliance</h1>
        <p className="text-slate-500 mt-1">Security fixes, Firestore rules, and compliance status</p>
      </div>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-mint-50 to-emerald-50 rounded-2xl border border-mint-200 p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-mint-100 flex items-center justify-center">
          <Shield className="w-6 h-6 text-mint-600" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-slate-900">All Critical Vulnerabilities Resolved</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Both priority security fixes have been deployed and verified. Firestore rules are locked down, 
            and AI endpoints now require authentication.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-mint-700 bg-mint-100 px-3 py-1.5 rounded-full">4/4 Fixed</span>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { icon: Lock, label: 'Data Encryption', value: 'AES-256', color: 'bg-ocean-50 text-ocean-600' },
          { icon: Eye, label: 'Privacy Model', value: 'Zero-Knowledge', color: 'bg-mint-50 text-mint-600' },
          { icon: Server, label: 'Infrastructure', value: 'Firebase / GCP', color: 'bg-spark-50 text-spark-600' },
          { icon: Key, label: 'Auth Method', value: 'Firebase Auth + SSO', color: 'bg-purple-50 text-purple-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900">{item.value}</p>
            <p className="text-xs text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Security Fixes */}
      <div className="space-y-4">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-spark-500" /> Security Fix Log
        </h2>
        
        {securityFixes.map((fix) => {
          const severity = severityStyles[fix.severity];
          const status = statusStyles[fix.status];
          const StatusIcon = status.icon;

          return (
            <details key={fix.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden group">
              <summary className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                <StatusIcon className={`w-5 h-5 flex-shrink-0 ${status.text}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-medium text-slate-900">{fix.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severity.badge}`}>
                      {fix.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{fix.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${status.bg} ${status.text}`}>
                    {fix.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 border-t border-slate-100 pt-5">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Issue Detail</h4>
                  <p className="text-sm text-slate-600">{fix.details}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Fix Applied</h4>
                  <pre className="bg-slate-900 text-slate-100 rounded-xl p-5 text-xs overflow-x-auto leading-relaxed">
                    <code>{fix.fix}</code>
                  </pre>
                </div>
              </div>
            </details>
          );
        })}
      </div>

      {/* Compliance */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-spark-500" /> Compliance Checklist
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Firestore row-level security', done: true },
            { label: 'AI endpoint authentication', done: true },
            { label: 'Rate limiting on API calls', done: true },
            { label: 'Subscription verification on AI calls', done: true },
            { label: 'Org-scoped admin access', done: true },
            { label: 'Anonymised analytics (no PII in reports)', done: true },
            { label: 'Data encryption at rest (AES-256)', done: true },
            { label: 'SOC 2 Type II audit', done: false },
            { label: 'GDPR data deletion workflow', done: true },
            { label: 'Penetration testing (scheduled)', done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              {item.done ? (
                <CheckCircle2 className="w-5 h-5 text-mint-500 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
              )}
              <span className={`text-sm ${item.done ? 'text-slate-700' : 'text-slate-400'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
