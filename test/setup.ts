/**
 * Test setup for Foundry Familiar module
 * Based on foundry-test-utils patterns from E&E and S&S
 */

import { vi, beforeEach } from 'vitest';

// Mock Foundry global objects
const mockGame = {
  journal: new Map(),
  user: { id: 'test-user', name: 'Test User', isGM: true },
  users: new Map(),
  modules: new Map(),
  socket: {
    on: vi.fn(),
    emit: vi.fn()
  },
  time: {
    worldTime: 0
  }
};

const mockHooks = {
  on: vi.fn(),
  once: vi.fn(),
  off: vi.fn(),
  call: vi.fn()
};

const mockChatMessage = {
  create: vi.fn().mockResolvedValue({ id: 'test-message' })
};

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
}

// Mock journal entry page
const createMockJournalPage = (id: string, name: string, content: string = '') => ({
  id,
  name,
  type: 'text',
  text: { content }
});

// Mock journal entry
const createMockJournalEntry = (name: string, content: string = '') => {
  const pages = new MockCollection<any>();
  pages.set('page1', createMockJournalPage('page1', 'Main Page', content));
  
  return {
    id: `journal-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    pages,
    folder: undefined
  };
};

// Setup global mocks
beforeEach(() => {
  // Clear all mocks
  vi.clearAllMocks();
  
  // Setup fresh journal collection
  const journalCollection = new MockCollection<any>();
  journalCollection.set('test-journal', createMockJournalEntry('Test Journal', '<p>Test content</p>'));
  journalCollection.set('empty-journal', createMockJournalEntry('Empty Journal', ''));
  
  mockGame.journal = journalCollection;
  
  // Setup globals
  global.game = mockGame as any;
  global.Hooks = mockHooks as any;
  global.ChatMessage = mockChatMessage as any;
  
  // Mock fetch for LLM API calls
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({
      choices: [{
        message: {
          content: 'Mock LLM response'
        }
      }]
    }),
    text: () => Promise.resolve('Mock response text')
  });
});

// Helper functions for tests
export const createMockLLMResponse = (content: string) => ({
  choices: [{
    message: { content }
  }]
});

export const mockFailedLLMResponse = () => {
  global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
};

export const mockLLMResponseWithDelay = (content: string, delay: number = 100) => {
  global.fetch = vi.fn().mockImplementation(() => 
    new Promise(resolve => 
      setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve(createMockLLMResponse(content))
      }), delay)
    )
  );
};

export { MockCollection, createMockJournalEntry };