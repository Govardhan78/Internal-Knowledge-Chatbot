import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { askQuestion } from "../services/chat.service";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your internal knowledge assistant. Ask me anything about your company documents." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await askQuestion(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", content: res.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again.", isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg">
      <Navbar />

      <div className="flex-1 flex justify-center px-4 py-6 overflow-hidden">
        <div className="w-full max-w-3xl flex flex-col h-full">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4 pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm bg-[rgba(108,99,255,0.15)] border border-accent">
                    ⚡
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === "user"
                    ? "bg-accent text-white rounded-br-sm"
                    : msg.isError
                      ? "bg-[rgba(255,92,108,0.1)] border border-[rgba(255,92,108,0.3)] text-danger rounded-bl-sm"
                      : "bg-surface border border-border text-text rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2.5 justify-start">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm bg-[rgba(108,99,255,0.15)] border border-accent">
                  ⚡
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-surface border border-border flex items-center gap-1">
                  <span className="dot w-1.5 h-1.5 rounded-full bg-muted inline-block" />
                  <span className="dot w-1.5 h-1.5 rounded-full bg-muted inline-block" />
                  <span className="dot w-1.5 h-1.5 rounded-full bg-muted inline-block" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="mt-3">
            <div className="flex items-end gap-2.5 bg-surface border border-border rounded-xl px-3 py-2.5">
              <textarea
                rows={1}
                placeholder="Ask anything about your company docs..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="flex-1 bg-transparent border-none text-heading text-sm resize-none leading-relaxed max-h-40 overflow-y-auto placeholder:text-muted focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-lg bg-accent hover:bg-accent-hover text-white text-lg font-bold flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
              >
                ↑
              </button>
            </div>
            <p className="text-center text-[11px] text-muted mt-2">
              Enter to send · Shift+Enter for new line
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;
