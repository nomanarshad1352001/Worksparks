// ===== USER PROFILES =====
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  teamSize: number;
  topChallenge: string;
  avatar: string;
  plan: 'individual' | 'team' | 'enterprise';
  joinedDate: string;
  sessionsCompleted: number;
  streakDays: number;
  organizationId?: string;
}

export const currentUser: UserProfile = {
  id: 'u1',
  name: 'Sarah Chen',
  email: 'sarah.chen@techcorp.io',
  role: 'VP of Engineering',
  teamSize: 42,
  topChallenge: 'Scaling team culture during rapid growth',
  avatar: 'SC',
  plan: 'enterprise',
  joinedDate: '2024-11-15',
  sessionsCompleted: 34,
  streakDays: 12,
  organizationId: 'org1',
};

// ===== ORGANIZATIONS =====
export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: 'team' | 'enterprise';
  seats: number;
  usedSeats: number;
  adminIds: string[];
  createdDate: string;
  monthlySpend: number;
}

export const organizations: Organization[] = [
  {
    id: 'org1',
    name: 'TechCorp',
    domain: 'techcorp.io',
    plan: 'enterprise',
    seats: 50,
    usedSeats: 38,
    adminIds: ['u1', 'u2'],
    createdDate: '2024-10-01',
    monthlySpend: 950,
  },
];

// ===== EMPLOYEES =====
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  sessions: number;
  lastActive: string;
  status: 'active' | 'invited' | 'inactive';
  topChallenge: string;
  avatar: string;
}

export const employees: Employee[] = [
  { id: 'e1', name: 'Sarah Chen', email: 'sarah.chen@techcorp.io', role: 'VP of Engineering', department: 'Engineering', sessions: 34, lastActive: '2025-01-15', status: 'active', topChallenge: 'Scaling culture', avatar: 'SC' },
  { id: 'e2', name: 'Marcus Johnson', email: 'marcus.j@techcorp.io', role: 'Engineering Manager', department: 'Engineering', sessions: 28, lastActive: '2025-01-14', status: 'active', topChallenge: 'Difficult conversations', avatar: 'MJ' },
  { id: 'e3', name: 'Priya Patel', email: 'priya.p@techcorp.io', role: 'Product Lead', department: 'Product', sessions: 22, lastActive: '2025-01-13', status: 'active', topChallenge: 'Cross-functional alignment', avatar: 'PP' },
  { id: 'e4', name: 'David Kim', email: 'david.k@techcorp.io', role: 'Design Director', department: 'Design', sessions: 19, lastActive: '2025-01-12', status: 'active', topChallenge: 'Stakeholder management', avatar: 'DK' },
  { id: 'e5', name: 'Emily Watson', email: 'emily.w@techcorp.io', role: 'HR Director', department: 'People', sessions: 31, lastActive: '2025-01-15', status: 'active', topChallenge: 'Change management', avatar: 'EW' },
  { id: 'e6', name: 'James Liu', email: 'james.l@techcorp.io', role: 'Tech Lead', department: 'Engineering', sessions: 15, lastActive: '2025-01-10', status: 'active', topChallenge: 'Delegation', avatar: 'JL' },
  { id: 'e7', name: 'Ana Rodriguez', email: 'ana.r@techcorp.io', role: 'Sales Manager', department: 'Sales', sessions: 12, lastActive: '2025-01-09', status: 'active', topChallenge: 'Team motivation', avatar: 'AR' },
  { id: 'e8', name: 'Tom Baker', email: 'tom.b@techcorp.io', role: 'Finance Lead', department: 'Finance', sessions: 8, lastActive: '2025-01-05', status: 'active', topChallenge: 'Strategic thinking', avatar: 'TB' },
  { id: 'e9', name: 'Lisa Chang', email: 'lisa.c@techcorp.io', role: 'QA Manager', department: 'Engineering', sessions: 0, lastActive: '-', status: 'invited', topChallenge: '-', avatar: 'LC' },
  { id: 'e10', name: 'Ryan Foster', email: 'ryan.f@techcorp.io', role: 'DevOps Lead', department: 'Engineering', sessions: 3, lastActive: '2024-12-20', status: 'inactive', topChallenge: 'Time management', avatar: 'RF' },
];

// ===== COACHING SESSIONS =====
export interface CoachingSession {
  id: string;
  date: string;
  topic: string;
  summary: string;
  challengeCategory: string;
  duration: number; // minutes
  sentiment: 'positive' | 'neutral' | 'reflective';
  keyInsight: string;
}

export const coachingSessions: CoachingSession[] = [
  { id: 's1', date: '2025-01-15', topic: 'Navigating team restructure', summary: 'Explored strategies for communicating organizational changes while maintaining team morale and psychological safety.', challengeCategory: 'Change Management', duration: 25, sentiment: 'reflective', keyInsight: 'Lead with transparency — share the "why" before the "what".' },
  { id: 's2', date: '2025-01-13', topic: 'Giving constructive feedback', summary: 'Practiced the SBI (Situation-Behavior-Impact) framework for delivering feedback that drives growth without defensiveness.', challengeCategory: 'Difficult Conversations', duration: 20, sentiment: 'positive', keyInsight: 'Focus on observable behaviors, not character judgments.' },
  { id: 's3', date: '2025-01-11', topic: 'Delegation and trust-building', summary: 'Identified delegation bottlenecks and created an action plan for empowering direct reports with more ownership.', challengeCategory: 'Delegation', duration: 30, sentiment: 'positive', keyInsight: 'Delegate outcomes, not tasks — let people find their own path.' },
  { id: 's4', date: '2025-01-08', topic: 'Managing up effectively', summary: 'Discussed techniques for building executive alignment and presenting ideas that resonate with C-suite priorities.', challengeCategory: 'Stakeholder Management', duration: 22, sentiment: 'neutral', keyInsight: 'Frame everything in terms of business outcomes, not activities.' },
  { id: 's5', date: '2025-01-05', topic: 'Building psychological safety', summary: 'Explored Amy Edmondson\'s framework and identified three actionable steps to increase team psychological safety.', challengeCategory: 'Team Culture', duration: 28, sentiment: 'positive', keyInsight: 'Normalize "I don\'t know" — model vulnerability from the top.' },
  { id: 's6', date: '2025-01-02', topic: 'Strategic prioritization', summary: 'Used the Eisenhower matrix to audit current priorities and identify two projects to deprioritize this quarter.', challengeCategory: 'Strategic Thinking', duration: 35, sentiment: 'reflective', keyInsight: 'Saying no to good things makes space for great things.' },
];

// ===== ANALYTICS DATA =====
export const sessionTrends = [
  { month: 'Aug', sessions: 45, users: 12 },
  { month: 'Sep', sessions: 78, users: 18 },
  { month: 'Oct', sessions: 112, users: 24 },
  { month: 'Nov', sessions: 156, users: 30 },
  { month: 'Dec', sessions: 189, users: 34 },
  { month: 'Jan', sessions: 234, users: 38 },
];

export const challengeCategories = [
  { name: 'Difficult Conversations', value: 28, color: '#f19338' },
  { name: 'Delegation', value: 22, color: '#338dfc' },
  { name: 'Change Management', value: 18, color: '#3ccb93' },
  { name: 'Strategic Thinking', value: 15, color: '#ee7a16' },
  { name: 'Team Culture', value: 12, color: '#1d6ef1' },
  { name: 'Stakeholder Management', value: 5, color: '#18b07a' },
];

export const departmentStats = [
  { department: 'Engineering', employees: 15, activeSessions: 89, avgSessions: 5.9, uptake: 87 },
  { department: 'Product', employees: 6, activeSessions: 42, avgSessions: 7.0, uptake: 100 },
  { department: 'Design', employees: 4, activeSessions: 28, avgSessions: 7.0, uptake: 75 },
  { department: 'Sales', employees: 5, activeSessions: 31, avgSessions: 6.2, uptake: 80 },
  { department: 'People', employees: 4, activeSessions: 35, avgSessions: 8.8, uptake: 100 },
  { department: 'Finance', employees: 4, activeSessions: 18, avgSessions: 4.5, uptake: 50 },
];

export const weeklyActivity = [
  { day: 'Mon', sessions: 12 },
  { day: 'Tue', sessions: 18 },
  { day: 'Wed', sessions: 22 },
  { day: 'Thu', sessions: 15 },
  { day: 'Fri', sessions: 8 },
  { day: 'Sat', sessions: 3 },
  { day: 'Sun', sessions: 2 },
];

// ===== CHAT MESSAGES (Demo) =====
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export const demoChatMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: "I'm struggling with giving feedback to a senior engineer who's been underperforming. They've been with the company for 5 years and I don't want to damage the relationship.",
    timestamp: '10:32 AM',
  },
  {
    id: 'm2',
    role: 'ai',
    content: "That's a common challenge, especially with tenured team members. Let's unpack this. First, what specific behaviors or outcomes have you noticed that concern you? It's important we ground this in observable facts rather than general impressions.\n\nAlso — what's your relationship like with this person currently? Understanding the trust baseline will help us determine the right approach.",
    timestamp: '10:32 AM',
  },
  {
    id: 'm3',
    role: 'user',
    content: "They've missed the last two sprint commitments and their code reviews have been superficial. We have a good relationship generally — they mentored me when I first joined.",
    timestamp: '10:34 AM',
  },
  {
    id: 'm4',
    role: 'ai',
    content: "Thank you for sharing that context. The mentorship history actually gives you a strong foundation to work from.\n\nI'd suggest using the **SBI Framework** (Situation-Behavior-Impact):\n\n1. **Situation**: \"In the last two sprints...\"\n2. **Behavior**: \"I've noticed commitments weren't met and code reviews had less depth than usual...\"\n3. **Impact**: \"This is creating pressure on the team and I'm concerned it might affect your trajectory here...\"\n\nThen shift to **curiosity**: \"I value our relationship and want to understand — is there something going on that I should know about?\"\n\nThis approach honors the relationship while being direct. Often, underperformance in senior people signals burnout, personal challenges, or misalignment with their work.\n\n**Would you like to role-play this conversation so you can practice before the real one?**",
    timestamp: '10:34 AM',
  },
];

// ===== PRICING PLANS =====
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  priceNote?: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'individual',
    name: 'Individual',
    price: '$29',
    period: '/month',
    description: 'For leaders investing in their own growth',
    features: [
      'Unlimited AI coaching sessions',
      'Personalized leadership insights',
      'Session history & progress tracking',
      'Framework library access',
      'Mobile PWA access',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    id: 'team',
    name: 'Team',
    price: '$199',
    period: '/month',
    description: 'For teams of 5–20 leaders',
    features: [
      'Everything in Individual',
      '5–20 seats included',
      'Team admin dashboard',
      'Anonymised team analytics',
      'CSV bulk employee upload',
      'Challenge category reports',
      'Priority support',
    ],
    cta: 'Start Team Trial',
    popular: true,
    priceNote: '5–20 seats',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$25',
    period: '/user/month',
    description: 'For organizations scaling leadership development',
    features: [
      'Everything in Team',
      'Unlimited seats (20+)',
      'HR/L&D analytics dashboard',
      'Exportable reports (PDF & CSV)',
      'SSO & SAML integration',
      'Custom onboarding & setup',
      'Dedicated success manager',
      'API access',
    ],
    cta: 'Contact Sales',
    popular: false,
    priceNote: '20+ seats · Custom onboarding fee may apply',
  },
];

// ===== ONBOARDING STEPS =====
export const leadershipChallenges = [
  'Scaling team culture during rapid growth',
  'Having difficult conversations',
  'Delegating effectively',
  'Managing up / stakeholder alignment',
  'Building psychological safety',
  'Strategic prioritization',
  'Leading through change',
  'Developing direct reports',
  'Cross-functional collaboration',
  'Work-life balance as a leader',
];

export const roleOptions = [
  'C-Suite / Founder',
  'VP / Director',
  'Senior Manager',
  'Manager',
  'Team Lead',
  'Individual Contributor (aspiring leader)',
];

export const teamSizeOptions = [
  '1–5',
  '6–15',
  '16–30',
  '31–50',
  '50+',
];
