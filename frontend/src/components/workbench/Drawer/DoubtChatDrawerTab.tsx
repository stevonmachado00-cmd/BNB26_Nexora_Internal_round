import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../state/workbenchMachine";

interface DoubtChatDrawerTabProps {
  messages: ChatMessage[];
  contextChips: string[];
  tutoringTier: number;
  setTutoringTier: (tier: number) => void;
  isAnswering: boolean;
  onSendMessage: (text: string) => void;
  onRemoveChip: (chip: string) => void;
}

export const DoubtChatDrawerTab: React.FC<DoubtChatDrawerTabProps> = ({
  messages,
  contextChips,
  tutoringTier,
  setTutoringTier,
  isAnswering,
  onSendMessage,
  onRemoveChip,
}) => {
  const [inputText, setInputText] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const suggestedChips = [
    "Why does print return None?",
    "Show me a similar example",
    "How does return send values back?",
  ];

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isAnswering) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAnswering]);

  return (
    <div className="h-full flex flex-col bg-[#1F1F1F] text-[#CCCCCC] text-xs font-sans select-text overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`max-w-[70ch] ${
                isUser
                  ? "ml-auto bg-[#264F78]/30 border border-[#264F78]/50 p-2.5 rounded-[6px]"
                  : "bg-[#181818] border border-[#2B2B2B] p-3 rounded-[6px] space-y-1.5"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-[#888888]">
                <span className="font-semibold text-white">
                  {isUser ? "You" : "Re:Learn Tutor"}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              <div className="text-[12px] text-[#DDDDDD] leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </div>

              {msg.codeSnippet && (
                <pre className="p-2 rounded bg-[#111111] font-mono text-[11px] text-[#CE9178] overflow-x-auto border border-[#2B2B2B]">
                  {msg.codeSnippet}
                </pre>
              )}
            </div>
          );
        })}

        {isAnswering && (
          <div className="flex items-center gap-2 text-xs text-[#888888] py-1">
            <span className="codicon codicon-loading codicon-modifier-spin text-xs text-[#007ACC]" />
            <span>Tutor thinking…</span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Suggested chips (3 ghost chips) */}
      <div className="px-4 py-1.5 border-t border-[#2B2B2B] flex items-center gap-2 overflow-x-auto bg-[#181818]">
        {suggestedChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(chip)}
            className="px-2.5 py-0.5 rounded-full border border-[#333333] hover:border-[#555555] text-[11px] text-[#AAAAAA] hover:text-white shrink-0 transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Context Chips + Input */}
      <div className="p-3 bg-[#181818] border-t border-[#2B2B2B] space-y-2">
        {contextChips.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-[#777777] uppercase font-semibold">
              Context:
            </span>
            {contextChips.map((chip, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-[#252526] text-[#3794FF] text-[11px] font-mono flex items-center gap-1 border border-[#383838]"
              >
                <span>{chip}</span>
                <button
                  onClick={() => onRemoveChip(chip)}
                  className="hover:text-white"
                  title="Remove chip"
                >
                  <span className="codicon codicon-close text-[10px]" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative flex items-center rounded border border-[#333333] focus-within:border-[#007ACC] bg-[#1F1F1F]">
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this line... (Enter to send)"
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-[#777777] resize-none focus:outline-none max-h-20"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isAnswering}
            className="mr-2 p-1 text-[#007ACC] hover:text-[#0098FF] disabled:opacity-40 transition-colors cursor-pointer"
            title="Send Message"
          >
            <span className="codicon codicon-send text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};
