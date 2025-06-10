// Foundry VTT v13+ type definitions for familiar
// Based on patterns from E&E and S&S modules

declare global {
  interface Game {
    foundryFamiliar?: FamiliarAPI;
    journal: Collection<JournalEntry>;
    scenes: Collection<Scene>;
    actors: Collection<Actor>;
    items: Collection<Item>;
    playlists: Collection<Playlist>;
    tables: Collection<RollTable>;
    macros: Collection<Macro>;
    cards: Collection<Cards>;
    folders: Collection<Folder>;
    user?: FoundryUser;
    users: Collection<FoundryUser>;
    modules: Collection<Module>;
    socket: any;
    time: {
      worldTime: number;
    };
  }

  interface Window {
    game: Game;
    Hooks: HooksManager;
    ui: any;
    ChatMessage: typeof ChatMessage;
    renderTemplate: (template: string, data: any) => Promise<string>;
  }

  interface FoundryUser {
    id: string;
    name: string;
    isGM: boolean;
  }

  interface Module {
    id: string;
    api?: any;
    [key: string]: any;
  }

  interface Collection<T> {
    size: number;
    get(id: string): T | undefined;
    getName(name: string): T | undefined;
    [Symbol.iterator](): Iterator<T>;
    values(): IterableIterator<T>;
    forEach(callback: (value: T, key: string) => void): void;
  }

  interface JournalEntry {
    id: string;
    name: string;
    pages: Collection<JournalEntryPage>;
    folder?: Folder;
  }

  interface JournalEntryPage {
    id: string;
    name: string;
    type: string;
    text: {
      content?: string;
    };
  }

  interface Folder {
    id: string;
    name: string;
    type?: string;
    contents?: Collection<any>;
    children?: Collection<Folder>;
  }

  interface Scene {
    id: string;
    name: string;
    active?: boolean;
    navigation?: boolean;
    background?: { src?: string };
    foreground?: { src?: string };
    tokens?: Collection<any>;
    notes?: Collection<any>;
    lights?: Collection<any>;
    folder?: Folder;
  }

  interface Actor {
    id: string;
    name: string;
    type: string;
    system?: any;
    items?: Collection<any>;
    folder?: Folder;
  }

  interface Item {
    id: string;
    name: string;
    type: string;
    system?: any;
    folder?: Folder;
  }

  interface Playlist {
    id: string;
    name: string;
    sounds?: Collection<any>;
    playing?: boolean;
    mode?: number;
    folder?: Folder;
  }

  interface RollTable {
    id: string;
    name: string;
    formula?: string;
    results?: Collection<any>;
    folder?: Folder;
  }

  interface Macro {
    id: string;
    name: string;
    type: string;
    scope: string;
    command?: string;
    folder?: Folder;
  }

  interface Cards {
    id: string;
    name: string;
    type?: string;
    cards?: Collection<any>;
    folder?: Folder;
  }

  interface HooksManager {
    on(event: string, callback: (...args: any[]) => void): void;
    once(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    call(event: string, ...args: any[]): boolean;
  }

  class ChatMessage {
    static create(data: ChatMessageData): Promise<ChatMessage>;
  }

  interface ChatMessageData {
    content: string;
    type?: number;
    user?: string;
    speaker?: any;
  }

  const game: Game;
  const Hooks: HooksManager;
}

// Familiar-specific types
export interface FamiliarAPI {
  ask(prompt: string): Promise<void>;
  summon(prompt: string): Promise<void>;
  settings(): void;
}

export interface LLMResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  max_tokens?: number;
}

export {};
