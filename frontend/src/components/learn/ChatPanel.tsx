import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../../types";
import { chatService, RETURN_PRINT_HINTS } from "../../services/chatService";
import {
  Send,
  Bot,
  User,
  Lightbulb,
} from "lucide-react";

interface ChatPanelProps {
  onShowTraceModal: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ onShowTraceModal }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    chatService.getInitialMessages()
  );
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Why is print different from return?",
    "Give me another contrast example.",
    "Can you explain this more simply?",
    "Can you show me what happened step by step?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    if (query.toLowerCase().includes("step by step")) {
      setIsTyping(false);
      onShowTraceModal();
      return;
    }

    try {
      const result = await chatService.askQuestion(query, hintLevel);
      setMessages((prev) => [...prev, result.responseMessage]);
      setHintLevel(result.nextHintLevel);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTriggerNextHint = () => {
    const nextLvl = Math.min(4, hintLevel + 1);
    const hint = RETURN_PRINT_HINTS[nextLvl - 1];
    setHintLevel(nextLvl);
    const hintMsg: ChatMessage = {
      id: "hint-msg-" + Date.now(),
      sender: "relearn",
      text: `💡 **${hint.title}**\n\n${hint.content}`,
      timestamp: "Just now",
      hintLevel: nextLvl,
    };
    setMessages((prev) => [...prev, hintMsg]);
  };

  return (
    <div className="flex flex-col h-full bg-[#090d13] border border-[#212734] rounded text-xs select-none">
      {/* Header */}
      <div className="px-3 py-2 bg-[#0c1017] border-b border-[#212734] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#161c26] border border-[#262e3d] flex items-center justify-center text-[#8b949e]">
            <Bot className="w-3 h-3 text-[#58a6ff]" />
          </div>
          <div>
            <h4 className="font-semibold text-[#f0f6fc] text-xs font-mono">Ask Re:Learn</h4>
            <p className="text-[10px] text-[#6e7681]">Cognitive Tutor & Hint Ladder</p>
          </div>
        </div>

        {/* Hint Ladder Indicator */}
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-[10px] text-[#8b949e] bg-[#12161f] px-1.5 py-0.5 rounded border border-[#212734]">
            Hint {hintLevel} / 4
          </span>
          {hintLevel < 4 && (
            <button
              onClick={handleTriggerNextHint}
              className="px-2 py-0.5 rounded bg-[#161b24] hover:bg-[#1f2634] text-[10px] text-[#c9d1d9] border border-[#262e3d] font-medium transition-colors flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3 text-[#d29922]" />
              <span>Next Hint</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 custom-scrollbar select-text">
        {messages.map((msg) => {
          const isRelearn = msg.sender === "relearn";
          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isRelearn ? "justify-start" : "justify-end"}`}
            >
              {isRelearn && (
                <div className="w-5 h-5 rounded bg-[#141922] border border-[#262e3d] flex items-center justify-center text-[#8b949e] shrink-0 text-[9px] font-mono">
                  RE
                </div>
              )}

              <div
                className={`max-w-[85%] p-2.5 rounded text-xs leading-relaxed ${
                  isRelearn
                    ? "bg-[#0e1218] border border-[#212734] text-[#c9d1d9]"
                    : "bg-[#18202d] border border-[#2d384c] text-[#f0f6fc]"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>

              {!isRelearn && (
                <div className="w-5 h-5 rounded bg-[#18202d] border border-[#2d384c] flex items-center justify-center text-[#f0f6fc] shrink-0 text-[9px]">
                  <User className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-[#6e7681] text-xs font-mono p-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] animate-pulse" />
            <span>Formulating conceptual guidance...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-2.5 py-1.5 bg-[#0c1017] border-t border-[#1e2533] flex flex-wrap gap-1">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="px-2 py-0.5 rounded bg-[#12161f] hover:bg-[#161c26] text-[10px] text-[#8b949e] hover:text-[#f0f6fc] border border-[#212734] transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2 bg-[#0c1017] border-t border-[#212734] flex items-center gap-1.5"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about this misconception..."
          className="flex-1 bg-[#090d13] border border-[#212734] rounded px-2.5 py-1.5 text-xs text-[#c9d1d9] placeholder:text-[#6e7681] focus:outline-none focus:border-[#388bfd] font-sans"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-1.5 rounded bg-[#1e2736] hover:bg-[#273347] disabled:opacity-40 disabled:cursor-not-allowed text-[#f0f6fc] border border-[#37465f] transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
