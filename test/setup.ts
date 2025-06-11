/**
 * Test setup for Foundry Familiar module
 * Based on foundry-test-utils patterns from E&E and S&S
 */

import { vi, beforeEach } from 'vitest';

// Set up FormApplication IMMEDIATELY before any other code runs
const MockFormApplication = class {
  static get defaultOptions() {
    return {
      classes: ['form'],
      popOut: true,
      editable: true,
      closeOnSubmit: true,
      submitOnChange: false,
      resizable: false,
    };
  }
  
  constructor(_options: any = {}) {
    // Mock constructor
  }
  
  async getData() {
    return {};
  }
  
  activateListeners(_html: any) {}
  
  async _updateObject(_event: any, _formData: any) {}
  
  render(_force?: boolean) {
    return this;
  }
  
  close() {
    return Promise.resolve();
  }
};

global.FormApplication = MockFormApplication;
global.mergeObject = vi.fn((target, source) => ({ ...target, ...source }));

// Mock Collection class
class MockCollection<T> extends Map<string, T> {
  getName(name: string): T | undefined {
    for (const [, value] of this) {
      if ((value as any).name === name) {
        return value;
      }
    }
    return undefined;
  }

  get size(): number {
    return super.size;
  }

  entries(): IterableIterator<[string, T]> {
    return super.entries();
  }

  values(): IterableIterator<T> {
    return super.values();
  }

  forEach(callback: (value: T, key: string) => void): void {
    for (const [key, value] of this) {
      callback(value, key);
    }
  }

  *[Symbol.iterator](): Iterator<T> {
    for (const value of super.values()) {
      yield value;
    }
  }
}

// Mock Foundry global objects
const mockGame = {
  journal: new MockCollection(),
  scenes: new MockCollection(),
  actors: new MockCollection(),
  items: new MockCollection(),
  playlists: new MockCollection(),
  tables: new MockCollection(),
  macros: new MockCollection(),
  cards: new MockCollection(),
  folders: new MockCollection(),
  user: { id: 'test-user', name: 'Test User', isGM: true },
  users: new MockCollection(),
  modules: new MockCollection(),
  socket: {
    on: vi.fn(),
    emit: vi.fn(),
  },
  time: {
    worldTime: 0,
  },
  system: { id: 'test-system', title: 'Test System' },
  version: '12.0.0',
  settings: {
    get: vi.fn((module, key) => {
      // Mock familiar settings with defaults
      if (module === 'foundry-familiar') {
        const defaults = {
          llmEndpoint: 'http://localhost:3000/v1/chat/completions',
          apiKey: '',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000,
          systemPrompt: 'You are a helpful AI assistant.',
          enableConsoleLogging: false,
          enableToolCalls: true,
          familiarName: 'Familiar',
          familiarIcon: '🧙',
        };
        return defaults[key];
      }
      return undefined;
    }),
    set: vi.fn(),
    register: vi.fn(),
    registerMenu: vi.fn(),
  },
};

const mockHooks = {
  on: vi.fn(),
  once: vi.fn(),
  off: vi.fn(),
  call: vi.fn(),
};

const mockChatMessage = {
  create: vi.fn().mockResolvedValue({ id: 'test-message' }),
};

// Mock journal entry page
const createMockJournalPage = (id: string, name: string, content: string = '') => ({
  id,
  name,
  type: 'text',
  text: { content },
});

// Mock journal entry
const createMockJournalEntry = (name: string, content: string = '') => {
  const pages = new MockCollection<any>();
  pages.set('page1', createMockJournalPage('page1', 'Main Page', content));

  return {
    id: `journal-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    pages,
    folder: undefined,
  };
};

// Create mock actors and scenes for testing
const createMockActor = (
  id: string,
  name: string,
  type: string = 'npc',
  folderName?: string,
  biography?: string
) => ({
  id,
  name,
  type,
  folder: folderName ? { name: folderName } : undefined,
  system: {
    details: {
      biography: {
        value: biography || `<p>A fearsome ${name.toLowerCase()} with incredible power.</p>`,
      },
    },
  },
});

const createMockScene = (id: string, name: string, active: boolean = false) => ({
  id,
  name,
  active,
  navigation: false,
  tokens: new MockCollection(),
  notes: new MockCollection(),
  lights: new MockCollection(),
});

// Setup global mocks
beforeEach(() => {
  // Clear all mocks
  vi.clearAllMocks();

  // Setup fresh collections with test data
  const journalCollection = new MockCollection<any>();
  journalCollection.set(
    'test-journal',
    createMockJournalEntry('Test Journal', '<p>Test content</p>')
  );
  journalCollection.set('empty-journal', createMockJournalEntry('Empty Journal', ''));

  const actorCollection = new MockCollection<any>();
  actorCollection.set(
    'actor1',
    createMockActor(
      'actor1',
      'Red Dragon',
      'npc',
      'Dragons',
      '<p>A fearsome red dragon with incredible power.</p>'
    )
  );
  actorCollection.set(
    'actor2',
    createMockActor(
      'actor2',
      'Blue Drake',
      'npc',
      undefined,
      '<p>A blue drake that breathes red lightning.</p>'
    )
  );

  const sceneCollection = new MockCollection<any>();
  sceneCollection.set('scene1', createMockScene('scene1', 'Dragon Lair', true));

  // Update game collections
  mockGame.journal = journalCollection;
  mockGame.actors = actorCollection;
  mockGame.scenes = sceneCollection;

  // Setup globals
  global.game = mockGame as any;
  global.Hooks = mockHooks as any;
  global.ChatMessage = mockChatMessage as any;

  // Add missing global constants for type definitions
  global.CONFIG = {};
  global.global = global;
  global.Dialog = { confirm: vi.fn() };
  global.ui = { notifications: { info: vi.fn(), error: vi.fn() } };

  // Mock fetch for LLM API calls
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        choices: [
          {
            message: {
              content: 'Mock LLM response',
            },
          },
        ],
      }),
    text: () => Promise.resolve('Mock response text'),
  });
});

// Helper functions for tests
export const createMockLLMResponse = (content: string) => ({
  choices: [
    {
      message: { content },
    },
  ],
});

export const mockFailedLLMResponse = () => {
  global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
};

export const mockLLMResponseWithDelay = (content: string, delay: number = 100) => {
  global.fetch = vi.fn().mockImplementation(
    () =>
      new Promise(resolve =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: () => Promise.resolve(createMockLLMResponse(content)),
            }),
          delay
        )
      )
  );
};

export { MockCollection, createMockJournalEntry };
