import React, { useState, useEffect, useRef } from "react";

export interface CommandItem {
  id: string;
  title: string;
  category?: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    (cmd.category && cmd.category.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-[12vh] px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="wb-glass rounded-[6px] w-[560px] max-w-full text-[#CCCCCC] font-sans text-xs overflow-hidden shadow-2xl flex flex-col border border-[#3C3C3C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input bar */}
        <div className="p-2.5 border-b border-[#2B2B2B] bg-[#1E1E1E]/90 flex items-center gap-2">
          <span className="codicon codicon-search text-[#888888] text-sm" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search concepts (e.g. Run, Scenario, Breakdown)..."
            className="flex-1 bg-transparent text-white text-xs placeholder-[#777777] focus:outline-none font-sans"
          />
          <kbd className="text-[10px] text-[#777777] bg-[#141414] px-1.5 py-0.5 rounded border border-[#333333]">
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[340px] overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-[#777777] italic">No matching commands</div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? "bg-[#04395E] text-white" : "hover:bg-white/5 text-[#CCCCCC]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {cmd.category && (
                      <span className="text-[10px] text-[#888888] uppercase tracking-wider font-semibold">
                        {cmd.category}:
                      </span>
                    )}
                    <span className="truncate">{cmd.title}</span>
                  </div>

                  {cmd.shortcut && (
                    <kbd className="text-[10px] text-[#888888] font-mono bg-[#141414] px-1.5 py-0.5 rounded border border-[#333333] shrink-0 ml-2">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
