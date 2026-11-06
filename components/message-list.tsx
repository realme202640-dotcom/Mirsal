"use client";

import { useState } from "react";
import type { UIMessage } from "ai";

type Props = {
  messages: UIMessage[];
  status: string;
};

function getText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
}

export function MessageList({ messages, status }: Props) {
  const lastIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <ol className="flex flex-col gap-5" aria-live="polite">
      {messages.map((message) => {
        const text = getText(message);
        return message.role === "user" ? (
          <li key={message.id} className="flex justify-start">
            <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-ss-sm bg-muted px-4 py-3 leading-relaxed">
              {text}
            </div>
          </li>
        ) : (
          <li key={message.id}>
            <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="whitespace-pre-wrap leading-loose text-pretty">{text}</div>
              {text && <CopyButton text={text} />}
            </article>
          </li>
        );
      })}
      {status === "submitted" && lastIsUser && (
        <li className="text-sm text-muted-foreground" role="status">
          مرسال يكتب...
        </li>
      )}
    </ol>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-4 flex justify-end border-t border-border pt-3">
      <button
        type="button"
        onClick={copy}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-muted"
      >
        {copied ? "تم النسخ" : "نسخ النص"}
      </button>
    </div>
  );
}
