import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { queryAssistant, AssistantMessage } from '../../engine/assistantEngine';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  User,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const { projects, selectedProject, setSelectedProject, setCurrentView } = useProjectContext();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ASSISTANT',
      text: `### 🏛️ MoSPI PAIMANA Monitoring Intelligence Assistant\n\nI am initialized with live multi-variable analytics for **${projects.length} Central Sector Infrastructure Projects** across 12 Union Ministries.\n\nYou can query me regarding:\n- Portfolio bottlenecks and critical escalations\n- Project-specific SHAP risk drivers (e.g. *“Why is P-1024 critical risk?”*)\n- Financial vs physical divergence audits\n- Sector-wise schedule variance benchmarks\n\nClick any quick inquiry chip below or ask any custom question.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const presetQueries = [
    'Which projects require immediate attention?',
    'Why is Project P-1024 high risk?',
    'Show projects where financial progress is much higher than physical progress.',
    'Which sectors have the highest average schedule variance?',
    'What intervention is recommended for P-1612?'
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Query internal engine
    setTimeout(() => {
      const response = queryAssistant(text, projects, selectedProject);
      setMessages(prev => [...prev, response]);
    }, 300);
  };

  const handleActionLink = (view: string, projectId?: string) => {
    if (projectId) {
      const found = projects.find(p => p.project_id === projectId);
      if (found) setSelectedProject(found);
    }
    setCurrentView(view as any);
  };

  return (
    <div className="space-y-4 pb-16 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ink-900 rounded-lg text-champagne-300 shadow-inner">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink-950 tracking-tight">
              PAIMANA Decision Intelligence Assistant
            </h2>
            <p className="text-xs text-ink-500">
              Deterministic Natural Language Query Engine grounded directly in MoSPI project records
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'ASSISTANT',
                text: 'Chat history cleared. How can I assist your monitoring review today?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }}
          className="text-xs text-ink-500 hover:text-ink-800 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Preset Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-ink-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-champagne-700" />
          Suggested Queries:
        </span>
        {presetQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 hover:border-emerald-300 text-ink-800 border border-ink-200 whitespace-nowrap transition-colors shadow-2xs font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="bg-white rounded-xl border border-ink-200 shadow-xs p-4 min-h-[460px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'USER' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ASSISTANT' && (
              <div className="w-7 h-7 rounded-full bg-ink-950 text-champagne-300 flex items-center justify-center shrink-0 mt-0.5 border border-ink-800">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-3xl rounded-xl p-4 text-xs space-y-2 leading-relaxed ${
                msg.sender === 'USER'
                  ? 'bg-ink-900 text-white shadow-xs'
                  : 'bg-ink-50/90 text-ink-900 border border-ink-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] text-ink-400 pb-1 border-b border-ink-200/50">
                <span className="font-bold uppercase tracking-wider font-mono">
                  {msg.sender === 'USER' ? 'Monitoring Officer Query' : 'PAIMANA System Intelligence'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Markdown content rendering */}
              <div className="whitespace-pre-wrap font-sans text-xs">
                {msg.text.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return <h3 key={idx} className="font-bold text-sm text-ink-950 mt-2 mb-1">{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('#### ')) {
                    return <h4 key={idx} className="font-bold text-xs text-ink-900 mt-2 mb-1">{line.replace('#### ', '')}</h4>;
                  }
                  if (line.startsWith('> ')) {
                    return (
                      <div key={idx} className="p-2.5 my-2 bg-champagne-50 border-l-2 border-champagne-500 text-ink-800 rounded-r font-medium">
                        {line.replace('> ', '')}
                      </div>
                    );
                  }
                  return <p key={idx} className="my-0.5">{line}</p>;
                })}
              </div>

              {/* Action Links Buttons if any */}
              {msg.actionLinks && msg.actionLinks.length > 0 && (
                <div className="pt-2 border-t border-ink-200 flex flex-wrap gap-2">
                  {msg.actionLinks.map((al, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionLink(al.view, al.projectId)}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>{al.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'USER' && (
              <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="bg-white p-2.5 rounded-xl border border-ink-300 shadow-sm flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask a question about ongoing projects, delay factors, financial anomalies..."
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-ink-900 placeholder-ink-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask Assistant</span>
        </button>
      </form>
    </div>
  );
};
