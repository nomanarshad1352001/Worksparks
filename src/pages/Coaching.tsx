import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RotateCcw, Lightbulb, MessageSquare, Clock, BookOpen, ThumbsUp, ThumbsDown, Copy, Check, Pin } from 'lucide-react';
import type { Store } from '../store/useStore';
import type { ChatMessage } from '../data/dummyData';

const suggestedTopics = [
  'How do I give tough feedback without damaging the relationship?',
  'Help me prepare for a difficult 1:1 conversation',
  'I need to delegate more effectively — where do I start?',
  'How can I build psychological safety on my team?',
  'How do I manage up to my executive team?',
  'I\'m burned out — how do I set boundaries as a leader?',
];

const aiResponses = [
  "That's a great question. Let me think about this from both a strategic and interpersonal lens.\n\nFirst, I'd encourage you to consider **what outcome you're optimizing for** — is it short-term performance, long-term development, or relationship preservation? Often these aren't in conflict, but clarity on your primary goal will shape your approach.\n\nHere are three frameworks that might help:\n\n1. **The 3C Model**: Context → Content → Commitment\n2. **Radical Candor**: Care personally while challenging directly\n3. **Coaching Stance**: Ask more, tell less — help them discover the answer\n\nWhich of these resonates most with your situation? I can walk you through a specific application.",
  "I appreciate you sharing that. Let me offer a structured approach.\n\n**Step 1: Name the Pattern**\nBefore the conversation, identify the specific pattern you've observed. Not a one-time event, but a recurring behavior.\n\n**Step 2: Lead with Curiosity**\nOpen with: \"I've noticed X, and I want to understand your perspective.\"\n\n**Step 3: Co-Create the Solution**\nDon't prescribe — ask: \"What do you think would help?\" People commit to solutions they create.\n\n**Step 4: Agree on Accountability**\nEnd with a clear next step and check-in date.\n\nWould you like to role-play this conversation?",
  "That's something many leaders struggle with, and the fact you're thinking about it shows self-awareness.\n\n**The Delegation Matrix** can help:\n\n| Task Type | Action |\n|-----------|--------|\n| Only you can do | Keep |\n| You're best at | Teach someone |\n| Others can do | Delegate fully |\n| Shouldn't be done | Eliminate |\n\nThe key mindset shift: **delegate outcomes, not tasks**. Give people the \"what\" and \"why,\" and let them figure out the \"how.\"\n\nWhat's one thing on your plate right now that someone else could own?",
];

interface CoachingProps {
  store: Store;
}

export default function Coaching({ store }: CoachingProps) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [showHistory, setShowHistory] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [store.chatMessages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    store.addChatMessage({ role: 'user', content: inputValue, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    setInputValue('');
    setIsTyping(true);

    const responseIdx = Math.floor(Math.random() * aiResponses.length);
    setTimeout(() => {
      store.addChatMessage({
        role: 'ai',
        content: aiResponses[responseIdx],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setIsTyping(false);
    }, 1500 + Math.random() * 1500);
  };

  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedId(msg.id);
    store.addToast('success', 'Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (id: string) => {
    setLikedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const handleSaveNote = (msg: ChatMessage) => {
    store.addNote({ sessionId: activeSessionId || '', content: msg.content, createdAt: new Date().toISOString().split('T')[0], pinned: false });
  };

  return (
    <div className="h-[calc(100vh-80px)] flex gap-6 anim-fade-in">
      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center shadow-sm anim-pulse-ring">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">AI Leadership Coach</h2>
              <p className="text-xs text-mint-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-500 inline-block animate-pulse" />
                Online — powered by GPT-5.1
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowHistory(!showHistory)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all lg:hidden" title="History">
              <Clock className="w-5 h-5" />
            </button>
            <button onClick={() => { store.clearChat(); }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all" title="New conversation">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 chat-scroll">
          {store.chatMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center anim-fade-in-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center mb-4 shadow-lg shadow-spark-500/20 anim-float">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">What's on your mind today?</h3>
              <p className="text-slate-500 mb-8 max-w-md">Share a challenge, question, or situation you'd like to work through.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl stagger">
                {suggestedTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => { setInputValue(topic); inputRef.current?.focus(); }}
                    className="text-left p-4 rounded-xl border border-slate-200 hover:border-spark-300 hover:bg-spark-50/50 text-sm text-slate-600 hover:text-slate-900 transition-all group anim-fade-in-up interactive"
                  >
                    <Lightbulb className="w-4 h-4 text-spark-400 mb-2 group-hover:text-spark-500 group-hover:scale-110 transition-all" />
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {store.chatMessages.map((message, idx) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} anim-fade-in-up`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {message.role === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="group max-w-[75%]">
                <div
                  className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-br-md'
                      : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-bl-md'
                  }`}
                >
                  {message.content}
                </div>
                {/* Action Bar */}
                <div className={`flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-slate-400 mr-2">{message.timestamp}</span>
                  <button onClick={() => handleCopy(message)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all" title="Copy">
                    {copiedId === message.id ? <Check className="w-3.5 h-3.5 text-mint-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  {message.role === 'ai' && (
                    <>
                      <button onClick={() => handleLike(message.id)} className={`p-1 rounded-md transition-all ${likedIds.has(message.id) ? 'text-mint-500 bg-mint-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`} title="Helpful">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all" title="Not helpful">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleSaveNote(message)} className="p-1 text-slate-400 hover:text-spark-500 hover:bg-spark-50 rounded-md transition-all" title="Save as note">
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 anim-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-spark-400 to-spark-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-slate-400 typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe a leadership challenge or ask a question..."
              className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-spark-400 focus:ring-2 focus:ring-spark-100 placeholder:text-slate-400 transition-all"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="p-3.5 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-xl hover:from-spark-600 hover:to-spark-700 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed btn-ripple interactive"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">AI coaching is not a substitute for professional therapy or counseling.</p>
        </div>
      </div>

      {/* Session History Sidebar */}
      <div className={`w-80 bg-white rounded-2xl border border-slate-100 overflow-hidden flex-col ${showHistory ? 'hidden lg:flex' : 'hidden'} anim-fade-in-right`}>
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-spark-500" /> Session History
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {store.sessions.map((session) => (
            <div
              key={session.id}
              className={`w-full text-left px-5 py-4 hover:bg-spark-50/30 border-b border-slate-50 transition-all cursor-pointer group ${activeSessionId === session.id ? 'bg-spark-50/50 border-l-2 border-l-spark-500' : ''}`}
              onClick={() => setActiveSessionId(session.id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-spark-500 transition-colors" />
                <p className="text-sm font-medium text-slate-900 group-hover:text-spark-600 transition-colors truncate">{session.topic}</p>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 ml-5.5">{session.summary}</p>
              <div className="flex items-center gap-2 mt-2 ml-5.5">
                <span className="text-xs text-slate-400">{session.date}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{session.duration}m</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-slate-100">
          <button
            onClick={() => {
              store.addSession({
                date: new Date().toISOString().split('T')[0],
                topic: 'New coaching session',
                summary: 'Started a new session...',
                challengeCategory: 'General',
                duration: 0,
                sentiment: 'neutral',
                keyInsight: '',
              });
              store.clearChat();
            }}
            className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:border-spark-300 hover:text-spark-600 hover:bg-spark-50/30 transition-all flex items-center justify-center gap-2 btn-ripple"
          >
            <MessageSquare className="w-4 h-4" /> New Session
          </button>
        </div>
      </div>
    </div>
  );
}
