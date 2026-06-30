import { useState, useCallback } from 'react';
import {
  employees as initialEmployees,
  coachingSessions as initialSessions,
  demoChatMessages as initialChat,
  organizations as initialOrgs,
  currentUser as initialUser,
  type Employee,
  type CoachingSession,
  type ChatMessage,
  type Organization,
  type UserProfile,
} from '../data/dummyData';

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  read: boolean;
  time: string;
}

// Goal types
export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  category: string;
  dueDate: string;
  status: 'active' | 'completed' | 'paused';
}

// Note types
export interface Note {
  id: string;
  sessionId: string;
  content: string;
  createdAt: string;
  pinned: boolean;
}

let nextId = 100;
const genId = (prefix: string) => `${prefix}${nextId++}`;

const initialNotifications: Notification[] = [
  { id: 'n1', type: 'success', title: 'Security Fix Deployed', message: 'Firestore rules and AI endpoint auth have been deployed successfully.', read: false, time: '2 min ago' },
  { id: 'n2', type: 'info', title: 'New Team Member', message: 'Lisa Chang accepted her invitation and joined the platform.', read: false, time: '15 min ago' },
  { id: 'n3', type: 'warning', title: 'Seat Limit Approaching', message: 'You\'re using 38 of 50 seats. Consider upgrading.', read: false, time: '1 hr ago' },
  { id: 'n4', type: 'success', title: 'Coaching Streak!', message: 'You\'ve maintained a 12-day coaching streak. Keep it up!', read: true, time: '3 hrs ago' },
  { id: 'n5', type: 'info', title: 'Monthly Report Ready', message: 'Your January analytics report is ready for download.', read: true, time: '1 day ago' },
];

const initialGoals: Goal[] = [
  { id: 'g1', title: 'Improve feedback delivery', description: 'Practice SBI framework in 5 real conversations', progress: 3, target: 5, category: 'Difficult Conversations', dueDate: '2025-02-28', status: 'active' },
  { id: 'g2', title: 'Delegate more effectively', description: 'Hand off 3 projects to direct reports with full autonomy', progress: 2, target: 3, category: 'Delegation', dueDate: '2025-03-15', status: 'active' },
  { id: 'g3', title: 'Weekly team check-ins', description: 'Conduct structured 1:1s with all direct reports every week', progress: 8, target: 12, category: 'Team Culture', dueDate: '2025-03-31', status: 'active' },
  { id: 'g4', title: 'Executive presentation skills', description: 'Present to the board 2 times this quarter', progress: 2, target: 2, category: 'Stakeholder Management', dueDate: '2025-01-31', status: 'completed' },
];

const initialNotes: Note[] = [
  { id: 'note1', sessionId: 's1', content: 'Remember to use the transparency-first approach when announcing the restructure next week.', createdAt: '2025-01-15', pinned: true },
  { id: 'note2', sessionId: 's2', content: 'SBI framework cheat sheet: Situation → Behavior → Impact. Practice with Marcus first.', createdAt: '2025-01-13', pinned: false },
  { id: 'note3', sessionId: 's3', content: 'Delegation matrix: Define the outcome, give the authority, establish check-in cadence.', createdAt: '2025-01-11', pinned: true },
];

export function useStore() {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [sessions, setSessions] = useState<CoachingSession[]>(initialSessions);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChat);
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrgs);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [toasts, setToasts] = useState<Array<{ id: string; type: string; message: string; exiting?: boolean }>>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('enterprise');

  // Toast system
  const addToast = useCallback((type: string, message: string) => {
    const id = genId('toast');
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  // User CRUD
  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    addToast('success', 'Profile updated successfully');
  }, [addToast]);

  // Employee CRUD
  const addEmployee = useCallback((emp: Omit<Employee, 'id'>) => {
    const newEmp = { ...emp, id: genId('e') };
    setEmployees(prev => [newEmp, ...prev]);
    addToast('success', `${emp.name} has been invited`);
    addNotification('info', 'Invitation Sent', `An invitation has been sent to ${emp.email}`);
    return newEmp;
  }, [addToast]);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addToast('success', 'Employee updated');
  }, [addToast]);

  const deleteEmployee = useCallback((id: string) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    addToast('info', `${emp?.name || 'Employee'} has been removed`);
  }, [employees, addToast]);

  const bulkAddEmployees = useCallback((emps: Omit<Employee, 'id'>[]) => {
    const newEmps = emps.map(emp => ({ ...emp, id: genId('e') }));
    setEmployees(prev => [...newEmps, ...prev]);
    addToast('success', `${emps.length} employees imported successfully`);
    return newEmps;
  }, [addToast]);

  // Session CRUD
  const addSession = useCallback((session: Omit<CoachingSession, 'id'>) => {
    const newSession = { ...session, id: genId('s') };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    addToast('info', 'Session deleted');
  }, [addToast]);

  // Chat CRUD
  const addChatMessage = useCallback((msg: Omit<ChatMessage, 'id'>) => {
    const newMsg = { ...msg, id: genId('m') };
    setChatMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
    addToast('info', 'Conversation cleared');
  }, [addToast]);

  // Notification CRUD
  const addNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    const newN: Notification = { id: genId('n'), type, title, message, read: false, time: 'Just now' };
    setNotifications(prev => [newN, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('info', 'All notifications marked as read');
  }, [addToast]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Goal CRUD
  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: genId('g') };
    setGoals(prev => [newGoal, ...prev]);
    addToast('success', 'Goal created');
    return newGoal;
  }, [addToast]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    if (updates.status === 'completed') {
      addToast('success', '🎉 Goal completed! Great work!');
    } else {
      addToast('success', 'Goal updated');
    }
  }, [addToast]);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    addToast('info', 'Goal deleted');
  }, [addToast]);

  // Note CRUD
  const addNote = useCallback((note: Omit<Note, 'id'>) => {
    const newNote = { ...note, id: genId('note') };
    setNotes(prev => [newNote, ...prev]);
    addToast('success', 'Note saved');
    return newNote;
  }, [addToast]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    addToast('info', 'Note deleted');
  }, [addToast]);

  // Org CRUD
  const updateOrganization = useCallback((id: string, updates: Partial<Organization>) => {
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    addToast('success', 'Organization updated');
  }, [addToast]);

  return {
    user, updateUser,
    employees, addEmployee, updateEmployee, deleteEmployee, bulkAddEmployees,
    sessions, addSession, deleteSession,
    chatMessages, addChatMessage, clearChat, setChatMessages,
    organizations, updateOrganization,
    notifications, addNotification, markNotificationRead, markAllNotificationsRead, deleteNotification,
    goals, addGoal, updateGoal, deleteGoal,
    notes, addNote, updateNote, deleteNote,
    toasts, addToast, removeToast,
    selectedPlan, setSelectedPlan,
  };
}

export type Store = ReturnType<typeof useStore>;
