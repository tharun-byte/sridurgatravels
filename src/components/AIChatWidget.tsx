import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, X, Send, Bot, Minimize2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MSG = "Namaste! 🙏 I'm **Durga**, your Sri Durga Travels assistant.\n\nAsk me anything about our **treks**, **vehicle rentals**, **pricing**, or packages. I speak Telugu, Hindi, English — whatever you prefer! ✨";

function formatMessage(text: string) {
  // Simple markdown-lite: bold (**text**), line breaks
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [unread, setUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (!initialized) {
        setMessages([{ role: 'assistant', content: WELCOME_MSG }]);
        setInitialized(true);
      }
      setUnread(false);
      setTimeout(scrollToBottom, 100);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, initialized, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const updatedMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        },
      });

      if (error) throw error;

      const reply = data?.reply ?? "Sorry, I couldn't get a response. Please try again! 🙏";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      if (!isOpen) setUnread(true);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Oops, something went wrong! 😅 Try again or email us at orders@sridurgatravels.com" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = initialized && messages.length <= 1
    ? ['What treks do you offer?', 'Vehicle rental prices?', 'How to book?']
    : [];

  return (
    <>
      {/* Animations */}
      <style>{`
        @keyframes ai-glow-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,0), 0 4px 24px rgba(124,58,237,0.5); }
          50%      { box-shadow: 0 0 0 8px rgba(124,58,237,0), 0 4px 32px rgba(124,58,237,0.8); }
        }
        @keyframes ai-hue {
          0%   { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes ai-ring-expand {
          0%   { transform:scale(1); opacity:.5; }
          100% { transform:scale(2.2); opacity:0; }
        }
        @keyframes chat-in {
          0%   { opacity:0; transform:translateY(16px) scale(0.97); }
          100% { opacity:1; transform:translateY(0)   scale(1); }
        }
        @keyframes dot-hop {
          0%,80%,100% { transform:translateY(0);   opacity:.35; }
          40%         { transform:translateY(-6px); opacity:1;   }
        }
        @keyframes msg-in {
          0%   { opacity:0; transform:translateY(6px); }
          100% { opacity:1; transform:translateY(0); }
        }
        .ai-btn        { animation: ai-glow-pulse 2.5s ease-in-out infinite; }
        .ai-btn-inner  { animation: ai-hue 8s linear infinite; }
        .ai-ring       { animation: ai-ring-expand 2s ease-out infinite; }
        .ai-ring-delay { animation: ai-ring-expand 2s ease-out infinite .8s; }
        .chat-panel    { animation: chat-in .28s cubic-bezier(.34,1.56,.64,1); }
        .d1 { animation: dot-hop 1.3s ease-in-out infinite 0s; }
        .d2 { animation: dot-hop 1.3s ease-in-out infinite .18s; }
        .d3 { animation: dot-hop 1.3s ease-in-out infinite .36s; }
        .msg-bubble    { animation: msg-in .22s ease-out; }
        .ai-scroll::-webkit-scrollbar        { width:4px; }
        .ai-scroll::-webkit-scrollbar-track  { background:transparent; }
        .ai-scroll::-webkit-scrollbar-thumb  { background:rgba(255,255,255,.1); border-radius:4px; }
      `}</style>

      {/* ── Chat Panel ─────────────────────────────────────── */}
      {isOpen && (
        <div
          className="chat-panel fixed bottom-[88px] left-4 z-50 w-[340px] sm:w-[380px] rounded-2xl overflow-hidden"
          style={{
            boxShadow: '0 24px 64px rgba(0,0,0,.6), 0 0 0 1px rgba(124,58,237,.25)',
            background: 'linear-gradient(160deg,#13111f 0%,#0f1626 100%)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: 'linear-gradient(135deg,#6d28d9 0%,#4f46e5 60%,#2563eb 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full flex items-center justify-center bg-white/20 flex-shrink-0">
                <Bot className="w-[18px] h-[18px] text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#6d28d9]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">Durga AI</p>
                <p className="text-white/60 text-[11px] mt-0.5">Sri Durga Travels • Always online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Minimise"
              >
                <Minimize2 className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-scroll h-[320px] overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-bubble flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {msg.role === 'assistant' && (
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#6d28d9,#4f46e5)' }}
                  >
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed rounded-2xl ${
                    msg.role === 'user' ? 'rounded-br-sm text-white' : 'rounded-bl-sm text-slate-100'
                  }`}
                  style={
                    msg.role === 'user'
                      ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }
                      : {
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.07)',
                        }
                  }
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#6d28d9,#4f46e5)' }}
                >
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="d1 w-2 h-2 rounded-full inline-block" style={{ background: '#818cf8' }} />
                  <span className="d2 w-2 h-2 rounded-full inline-block" style={{ background: '#818cf8' }} />
                  <span className="d3 w-2 h-2 rounded-full inline-block" style={{ background: '#818cf8' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {quickReplies.length > 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                  className="text-[11px] text-violet-300 border border-violet-500/30 rounded-full px-3 py-1 hover:bg-violet-500/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about treks, rentals…"
              disabled={isLoading}
              className="flex-1 text-[13px] text-white placeholder-white/25 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2 outline-none focus:border-violet-500/50 transition-colors disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-35 hover:scale-105 active:scale-95 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 text-center" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <p className="text-[10px] text-white/20">Powered by NVIDIA AI • Sri Durga Travels</p>
          </div>
        </div>
      )}

      {/* ── Floating Button ────────────────────────────────── */}
      <div className="fixed bottom-6 left-4 z-50 group">
        {/* Pulse rings (only when closed) */}
        {!isOpen && (
          <>
            <div
              className="ai-ring absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'rgba(124,58,237,0.35)' }}
            />
            <div
              className="ai-ring-delay absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'rgba(99,102,241,0.25)' }}
            />
          </>
        )}

        <button
          onClick={() => setIsOpen(o => !o)}
          aria-label="Chat with Durga AI"
          className={`ai-btn w-14 h-14 rounded-full flex items-center justify-center relative transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'scale-90' : ''}`}
          style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#2563eb 100%)' }}
        >
          <span className="ai-btn-inner absolute inset-0 rounded-full opacity-60"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899,#2563eb,#7c3aed)' }} />
          <span className="relative z-10">
            {isOpen
              ? <X className="w-6 h-6 text-white" />
              : <Sparkles className="w-6 h-6 text-white" />
            }
          </span>

          {/* Unread badge */}
          {unread && !isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-[#7c3aed] text-[9px] text-white flex items-center justify-center font-bold">
              1
            </span>
          )}
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-16 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            <div
              className="text-[12px] text-white font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(109,40,217,0.95)', backdropFilter: 'blur(8px)' }}
            >
              💬 Chat with Durga AI
            </div>
            <div
              className="w-2.5 h-2.5 rotate-45 ml-3.5 -mt-1.5"
              style={{ background: 'rgba(109,40,217,0.95)' }}
            />
          </div>
        )}
      </div>
    </>
  );
}
