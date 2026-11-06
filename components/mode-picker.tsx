"use client";

import { TONES, WRITING_MODES, type ToneId, type WritingModeId } from "@/lib/modes";

type Props = {
  mode: WritingModeId;
  tone: ToneId;
  onModeChange: (mode: WritingModeId) => void;
  onToneChange: (tone: ToneId) => void;
};

export function ModePicker({ mode, tone, onModeChange, onToneChange }: Props) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">نوع المهمة</legend>
        {WRITING_MODES.map((m) => (
          <label
            key={m.id}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
              mode === m.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            <input
              type="radio"
              name="mode"
              value={m.id}
              checked={mode === m.id}
              onChange={() => onModeChange(m.id)}
              className="sr-only"
            />
            {m.label}
          </label>
        ))}
      </fieldset>

      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="tone" className="text-muted-foreground">
          النبرة:
        </label>
        <select
          id="tone"
          value={tone}
          onChange={(e) => onToneChange(e.target.value as ToneId)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {TONES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
