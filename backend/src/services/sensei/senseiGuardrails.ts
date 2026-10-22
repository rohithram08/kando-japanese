export enum SenseiIntent {
  ALLOWED = 'ALLOWED',
  OUT_OF_DOMAIN = 'OUT_OF_DOMAIN',
  PROMPT_INJECTION = 'PROMPT_INJECTION',
  PLATFORM_DATA_QUERY = 'PLATFORM_DATA_QUERY'
}

const INJECTION_PATTERNS = [
  /ignore (all |previous )?instructions/i,
  /system prompt/i,
  /database (schema|credentials)/i,
  /api key/i,
  /act as a /i,
  /disregard/i,
  /developer mode/i,
  /you are now DAN/i,
  /bypass/i
];

const OUT_OF_DOMAIN_PATTERNS = [
  /how to code/i,
  /python|react|javascript|c\+\+|java|rust|golang|php|kubernetes|aws|docker|linux|cloud\b/i,
  /who is the president/i,
  /write (a |an )?(essay|poem|code|app|script)/i,
  /hack /i,
  /politics|news\b/i,
  /essay about/i,
  /global warming/i,
  /weather in /i,
  /crypto|bitcoin|ethereum|stocks\b/i
];

const PLATFORM_DATA_PATTERNS = [
  /what does (.*?) mean/i,
  /how to use/i,
  /lesson \d+/i,
  /grammar/i,
  /kanji/i,
  /vocabulary/i,
  /listening/i,
  /reading|story/i,
  /explain/i,
  /difference between/i
];

export class SenseiGuardrails {
  
  public classify(message: string): SenseiIntent {
    const text = message.toLowerCase();

    // 1. Check prompt injection
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(text)) {
        return SenseiIntent.PROMPT_INJECTION;
      }
    }

    // 2. Check clear out-of-domain
    for (const pattern of OUT_OF_DOMAIN_PATTERNS) {
      if (pattern.test(text)) {
        return SenseiIntent.OUT_OF_DOMAIN;
      }
    }

    // 3. Check if it explicitly needs RAG data
    for (const pattern of PLATFORM_DATA_PATTERNS) {
      if (pattern.test(text)) {
        return SenseiIntent.PLATFORM_DATA_QUERY;
      }
    }

    return SenseiIntent.ALLOWED;
  }

  public getRejectionMessage(intent: SenseiIntent): string {
    if (intent === SenseiIntent.PROMPT_INJECTION) {
      return "I'm your Kando Japanese Sensei 🌸 I cannot share my internal instructions or system configuration! Let's get back to studying Japanese.";
    }
    if (intent === SenseiIntent.OUT_OF_DOMAIN) {
      return "I'm your Kando Japanese Sensei 🌸 I'm here to help you learn Japanese. Let's get back to your Japanese practice!";
    }
    return "I'm sorry, I cannot process that right now.";
  }
}

export const senseiGuardrails = new SenseiGuardrails();
