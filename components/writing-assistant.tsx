"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { TONES, WRITING_MODES, type ToneId, type WritingModeId } from "@/lib/modes";
import { ModePicker } from "./mode-picker";
import { MessageList } from "./message-list";
import { Composer } from "./composer";

export function WritingAssistant() {
  const [mode, setMode] = useState<WritingModeId>(WRITING_MODES[0].id);
  const [tone, setTone] = useState<ToneId>(TONES[0].id);
  const { messages, sendMessage, status, stop, error, setMessages } = useChat();

  const busy = status === "submitted" || status === "streaming";
  const activeMode = WRITING_MODES.find((m) => m.id === mode) ?? WRITING_MODES[0];

  function handleSend(text: string) {
    sendMessage({ text }, { body: { mode, tone } });
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4">
      <header className="flex items-center justify-between gap-4 border-b border-border py-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">مرسال</h1>
          <p className="text-sm text-muted-foreground">مساعدك في كتابة الرسائل وصياغتها</p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            disabled={busy}
            className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted disabled:opacity-50"
          >
            محادثة جديدة
          </button>
        )}
      </header>

      <ModePicker mode={mode} tone={tone} onModeChange={setMode} onToneChange={setTone} />

      <main className="flex-1 py-6">
        {messages.length === 0 ? (
          <EmptyState hint={activeMode.hint} onPick={handleSend} />
        ) : (
          <MessageList messages={messages} status={status} />
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            حدث خطأ أثناء الاتصال بالمساعد. حاول مرة أخرى.
          </p>
        )}
      </main>

      <Composer placeholder={activeMode.hint} busy={busy} onSend={handleSend} onStop={stop} />
    </div>
  );
}

function EmptyState({ hint, onPick }: { hint: string; onPick: (text: string) => void }) {
  const examples = [
    "اكتب رسالة تهنئة لزميل بمناسبة ترقيته",
    "بريد متابعة لعميل لم يرد على عرض السعر",
    "رسالة شكر لفريق العمل بعد إطلاق المشروع",
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="space-y-2">
        <p className="font-serif text-2xl text-foreground">بماذا نكتب اليوم؟</p>
        <p className="text-muted-foreground text-pretty">{hint}</p>
      </div>
      <ul className="flex w-full max-w-md flex-col gap-2">
        {examples.map((example) => (
          <li key={example}>
            <button
              type="button"
              onClick={() => onPick(example)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-start text-sm transition hover:border-primary hover:text-primary"
            >
              {example}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
