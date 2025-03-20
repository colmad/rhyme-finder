// Type definitions for Web Speech API (Speech Synthesis)
// These are supplementary to the built-in TypeScript definitions
// to ensure all browser implementations are covered

interface Window {
  speechSynthesis: SpeechSynthesis;
}

interface SpeechSynthesisEvent extends Event {
  utterance: SpeechSynthesisUtterance;
  charIndex?: number;
  charLength?: number;
  elapsedTime?: number;
  name?: string;
  error?: string;
}

interface SpeechSynthesisErrorEvent extends SpeechSynthesisEvent {
  error: string;
}

interface SpeechSynthesisUtterance extends EventTarget {
  text: string;
  lang: string;
  voice: SpeechSynthesisVoice | null;
  volume: number;
  rate: number;
  pitch: number;

  onstart: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null;
  onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null;
  onerror: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => void) | null;
  onpause: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null;
  onresume: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null;
  onboundary: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null;
  onmark: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null;

  addEventListener(type: "start", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: "end", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: "error", listener: (ev: SpeechSynthesisErrorEvent) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: "pause", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: "resume", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: "boundary", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: "mark", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener(type: "start", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: "end", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: "error", listener: (ev: SpeechSynthesisErrorEvent) => void, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: "pause", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: "resume", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: "boundary", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: "mark", listener: (ev: SpeechSynthesisEvent) => void, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface SpeechSynthesisUtteranceConstructor {
  new(text?: string): SpeechSynthesisUtterance;
  prototype: SpeechSynthesisUtterance;
}

interface SpeechSynthesisVoice {
  readonly voiceURI: string;
  readonly name: string;
  readonly lang: string;
  readonly localService: boolean;
  readonly default: boolean;
}

interface SpeechSynthesis {
  readonly speaking: boolean;
  readonly pending: boolean;
  readonly paused: boolean;
  onvoiceschanged: ((this: SpeechSynthesis, ev: Event) => void) | null;

  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  pause(): void;
  resume(): void;
  getVoices(): SpeechSynthesisVoice[];

  addEventListener(type: "voiceschanged", listener: (ev: Event) => void, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener(type: "voiceschanged", listener: (ev: Event) => void, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare let SpeechSynthesisUtterance: SpeechSynthesisUtteranceConstructor;
