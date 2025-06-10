/**
 * LLM Service for handling API communication
 * Supports OpenAI-compatible endpoints
 */

import type { LLMRequest, LLMResponse } from '../types/foundry-types';
import { SettingsManager } from '../settings';

export class LLMService {
  /**
   * Send request to LLM API using current settings
   */
  async sendRequest(request: LLMRequest): Promise<LLMResponse> {
    const settings = SettingsManager.getSettings();
    const shouldLog = settings.enableConsoleLogging;

    try {
      if (shouldLog) {
        console.log('🌐 === LLM API REQUEST ===');
        console.log('🌐 Endpoint:', settings.llmEndpoint);
        console.log('🌐 Model:', request.model);
        console.log('🌐 Messages:', request.messages.length);
        console.log('🌐 Temperature:', request.temperature);
        console.log('🌐 Max Tokens:', request.max_tokens);
        console.log('🌐 Request Body Size:', JSON.stringify(request).length, 'chars');
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (settings.apiKey) {
        headers['Authorization'] = `Bearer ${settings.apiKey}`;
      }

      const response = await fetch(settings.llmEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (shouldLog) {
        console.log('🌐 Response Status:', response.status, response.statusText);
      }

      if (!response.ok) {
        const errorText = await response.text();
        if (shouldLog) {
          console.log('🌐 ❌ API Error Response:', errorText);
        }
        console.error('LLM API error:', response.status, errorText);
        throw new Error(`LLM API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (shouldLog) {
        console.log('🌐 ✅ Response received, choices:', data.choices?.length || 0);
        if (data.choices?.[0]?.message?.content) {
          console.log('🌐 Response length:', data.choices[0].message.content.length, 'chars');
        }
        console.log('🌐 === LLM API RESPONSE COMPLETE ===');
      }

      return data;
    } catch (error) {
      if (shouldLog) {
        console.log('🌐 💥 LLM API ERROR:', error);
      }
      console.error('LLM service error:', error);
      throw error;
    }
  }

  /**
   * Test connection to LLM endpoint using current settings
   */
  async testConnection(): Promise<boolean> {
    try {
      const settings = SettingsManager.getSettings();
      const response = await this.sendRequest({
        model: settings.model,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5,
        temperature: 0.1,
      });
      return !!response.choices;
    } catch (error) {
      console.warn('LLM connection test failed:', error);
      return false;
    }
  }
}
