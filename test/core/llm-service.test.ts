/**
 * Tests for LLMService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LLMService } from '../../src/core/llm-service';
import { createMockLLMResponse, mockFailedLLMResponse } from '../setup';

describe('LLMService', () => {
  let service: LLMService;

  beforeEach(() => {
    service = new LLMService();
  });

  describe('sendRequest', () => {
    it('should send request to LLM API successfully', async () => {
      const mockResponse = createMockLLMResponse('Test response');
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await service.sendRequest({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test prompt' }]
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('test prompt')
        })
      );
    });

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error')
      });

      await expect(service.sendRequest({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }]
      })).rejects.toThrow('LLM API returned 500');
    });

    it('should handle network errors', async () => {
      mockFailedLLMResponse();

      await expect(service.sendRequest({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }]
      })).rejects.toThrow('Network error');
    });

    it('should send complete request parameters', async () => {
      const mockResponse = createMockLLMResponse('Response');
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await service.sendRequest({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'System prompt' },
          { role: 'user', content: 'User prompt' }
        ],
        temperature: 0.7,
        max_tokens: 100
      });

      const callArgs = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      expect(requestBody).toEqual({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'System prompt' },
          { role: 'user', content: 'User prompt' }
        ],
        temperature: 0.7,
        max_tokens: 100
      });
    });
  });

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      const mockResponse = createMockLLMResponse('test');
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await service.testConnection();
      
      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      mockFailedLLMResponse();

      const result = await service.testConnection();
      
      expect(result).toBe(false);
    });

    it('should return false for invalid response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ error: 'Invalid response' })
      });

      const result = await service.testConnection();
      
      expect(result).toBe(false);
    });
  });

  describe('custom endpoint', () => {
    it('should use custom endpoint when provided', async () => {
      const customService = new LLMService('http://custom.endpoint/api');
      const mockResponse = createMockLLMResponse('Response');
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await customService.sendRequest({
        model: 'test',
        messages: [{ role: 'user', content: 'test' }]
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://custom.endpoint/api',
        expect.any(Object)
      );
    });
  });
});