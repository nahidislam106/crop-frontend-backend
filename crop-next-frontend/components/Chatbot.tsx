"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle, X, Send, Leaf, Loader2,
  RefreshCw, ChevronDown, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

interface Message {
  id:      number;
  role:    "user" | "assistant";
  content: string;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  // Render basic markdown: bold (**text**), newlines, and bullet lists
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, li) => {
      // Bullet list
      if (line.match(/^[-*•]\s/)) {
        const content = line.replace(/^[-*•]\s/, "");
        return (
          <div key={li} className="flex items-start gap-1.5 mt-1">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-60" />
            <span>{renderInline(content)}</span>
          </div>
        );
      }
      return (
        <p key={li} className={li > 0 && line === "" ? "mt-2" : li > 0 ? "mt-1" : ""}>
          {renderInline(line)}
        </p>
      );
    });
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : p
    );
  };

  return (
    <div className={cn("flex gap-2.5 group", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Leaf size={13} className="text-white" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-tr-sm"
            : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
        )}
      >
        {renderContent(msg.content)}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [open,      setOpen]      = useState(false);
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);
  const idCounter  = useRef(0);
  const { language } = useLanguage();
  const isBangla = language === "bn";

  const starters = isBangla
    ? [
        "আমার মাটির pH ৬.৫ — কোন ফসল ভালো হবে?",
        "ধানে ব্লাস্ট রোগ হলে কী করব?",
        "N=80, P=40, K=30, pH 6.5 হলে কোন ফসল ভালো?",
        "কম পটাশিয়াম কীভাবে ঠিক করব?",
      ]
    : [
        "My soil pH is 6.5 - which crop is best?",
        "What should I do if rice blast appears?",
        "What crop suits N=80, P=40, K=30, pH 6.5?",
        "How do I fix low potassium in my soil?",
      ];

  const nextId = () => ++idCounter.current;

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const sendMessage = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const userMsg: Message = { id: nextId(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: data.reply },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reach AI.";
      setError(msg);
      // Remove the user message on failure so they can retry
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setInput(content);
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => { setMessages([]); setError(null); };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300",
          "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
          "hover:scale-110 hover:shadow-green-300 hover:shadow-xl",
          open && "rotate-0"
        )}
        aria-label="Toggle AgriBot"
      >
        {open
          ? <X size={22} />
          : (
            <>
              <MessageCircle size={22} />
              {/* Pulse ring */}
              <span className="absolute w-full h-full rounded-2xl bg-green-400 opacity-40 animate-ping" />
            </>
          )
        }
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-slide-up"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Leaf size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-sm">AgriBot</h3>
                <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-white/90 text-xs">
                  <Sparkles size={10} />
                  AI
                </span>
              </div>
              <p className="text-green-100 text-xs">Your farming assistant</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                title="Clear chat"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-all"
              >
                <RefreshCw size={13} />
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-all"
            >
              <ChevronDown size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/50">
            {/* Welcome / empty state */}
            {isEmpty && (
              <div className="flex flex-col items-center text-center pt-4 pb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-3">
                  <Leaf size={26} className="text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">
                  {isBangla ? "AgriBot / এগ্রিবটকে জিজ্ঞাসা করুন" : "Ask AgriBot"}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[220px]">
                  {isBangla ? "মাটি · ফসল · সার · পোকামাকড়" : "Soil · Crops · Fertilizer · Pests"}
                </p>
                {/* Quick starter buttons */}
                <div className="mt-4 flex flex-col gap-1.5 w-full">
                  {starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left text-xs bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 px-3 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation */}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Leaf size={13} className="text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-xs text-red-700 text-center">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={handleKey}
                placeholder={isBangla ? "বাংলা বা ইংরেজিতে লিখুন…" : "Ask in English or Bengali…"}
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none min-h-[24px] max-h-[120px] py-0.5 disabled:opacity-50"
                style={{ lineHeight: "1.5" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-sm transition-all active:scale-90 shrink-0"
              >
                {loading
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Send size={14} />
                }
              </button>
            </div>
            <p className="text-center text-gray-300 text-[10px] mt-1.5">
              {isBangla ? "OpenRouter AI দ্বারা চালিত · পাঠাতে Enter চাপুন" : "Powered by OpenRouter AI · Enter to send"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
