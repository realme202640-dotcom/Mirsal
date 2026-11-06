import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import { TONES, WRITING_MODES } from "@/lib/modes";

export const maxDuration = 60;

const MAX_MESSAGES = 40;

export async function POST(req: Request) {
  const { messages, mode, tone }: { messages: UIMessage[]; mode?: string; tone?: string } =
    await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Invalid request", { status: 400 });
  }

  const selectedMode = WRITING_MODES.find((m) => m.id === mode) ?? WRITING_MODES[0];
  const selectedTone = TONES.find((t) => t.id === tone) ?? TONES[0];

  const system = `أنت «مرسال»، مساعد كتابة ورسائل محترف باللغة العربية.
- اكتب بالعربية الفصحى الواضحة ما لم يطلب المستخدم لغة أو لهجة أخرى، وإن كتب المستخدم بلغة أخرى فأجب بلغته.
- النبرة المطلوبة: ${selectedTone.label}.
- المهمة الحالية: ${selectedMode.instruction}
- قدّم النص الجاهز للنسخ مباشرة دون مقدمات مثل «بالتأكيد» أو «إليك».
- تجنب تنسيق Markdown الثقيل؛ استخدم فقرات وأسطر عادية.
- لا تختلق معلومات شخصية أو أرقاماً؛ استخدم عناصر نائبة بين أقواس مربعة مثل [التاريخ].`;

  const result = streamText({
    model: "anthropic/claude-sonnet-5.5",
    system,
    messages: await convertToModelMessages(messages.slice(-MAX_MESSAGES)),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
