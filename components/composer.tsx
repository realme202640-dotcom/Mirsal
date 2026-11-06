"use client";

import { useState } from "react";

type Props = {
  placeholder: string;
  busy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
};

export function Composer({ placeholder, busy, onSend, onStop }: Props) {
  const [input, setInput] = useState("");

  function submit() {
    const text = input.trim();
    if (!text || busy) return;
    onSend(text);
    setInput("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="sticky bottom-0 bg-background pb-5 pt-2"
    >
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary">
        <label htmlFor="message" className="sr-only">
          اكتب طلبك
        </label>
        <textarea
          id="message"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              if (e.nativeEvent.isComposing || e.keyCode === 229) return;
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className="max-h-48 min-h-12 flex-1 resize-y bg-transparent px-2 py-2 leading-relaxed placeholder:text-muted-foreground focus:outline-none"
        />
        {busy ? (
          <button
            type="button"
            onClick={onStop}
            className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            إيقاف
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition disabled:opacity-40"
          >
            أرسل
          </button>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Enter للإرسال، Shift + Enter لسطر جديد
      </p>
    </form>
  );
}
