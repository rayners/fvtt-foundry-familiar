/**
 * Module settings for Foundry Familiar
 * Handles configuration of LLM endpoints, API keys, and behavior
 */

import { FamiliarSettingsDialog } from './ui/settings-dialog';

export interface FamiliarSettings {
  llmEndpoint: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enableConsoleLogging: boolean;
  enableToolCalls: boolean;
  familiarName: string;
  familiarIcon: string;
}

export class SettingsManager {
  private static readonly SETTINGS_KEY = 'foundry-familiar';

  /**
   * Register all module settings
   */
  static registerSettings(): void {
    // LLM Configuration
    game.settings.register(this.SETTINGS_KEY, 'llmEndpoint', {
      name: 'LLM Endpoint URL',
      hint: 'URL of your LLM API endpoint (OpenAI-compatible). Examples: https://api.openai.com/v1/chat/completions, http://localhost:11434/v1/chat/completions',
      scope: 'world',
      config: false,
      type: String,
      default: 'http://localhost:11434/v1/chat/completions',
    });

    game.settings.register(this.SETTINGS_KEY, 'apiKey', {
      name: 'API Key',
      hint: 'API key for your LLM service (leave empty for local endpoints)',
      scope: 'world',
      config: false,
      type: String,
      default: '',
    });

    game.settings.register(this.SETTINGS_KEY, 'model', {
      name: 'Model Name',
      hint: 'Model to use for requests (e.g., gpt-4, llama3.2, qwen2.5)',
      scope: 'world',
      config: false,
      type: String,
      default: 'qwen3',
    });

    // Behavior Configuration
    game.settings.register(this.SETTINGS_KEY, 'temperature', {
      name: 'Temperature',
      hint: 'Controls creativity/randomness (0.0 = deterministic, 1.0 = very creative)',
      scope: 'world',
      config: false,
      type: Number,
      default: 0.1,
      range: {
        min: 0.0,
        max: 2.0,
        step: 0.1,
      },
    });

    game.settings.register(this.SETTINGS_KEY, 'maxTokens', {
      name: 'Max Tokens',
      hint: 'Maximum response length (higher = longer responses but slower)',
      scope: 'world',
      config: false,
      type: Number,
      default: 600,
      range: {
        min: 50,
        max: 2000,
        step: 50,
      },
    });

    game.settings.register(this.SETTINGS_KEY, 'systemPrompt', {
      name: 'System Prompt',
      hint: 'Personality and role for the Familiar',
      scope: 'world',
      config: false, // Hidden from game settings - only in custom dialog
      type: String,
      default:
        'You are a helpful magical familiar assisting a game master. You have access to tools to help answer questions about the campaign.',
    });

    // Debug & Development
    game.settings.register(this.SETTINGS_KEY, 'enableConsoleLogging', {
      name: 'Enable Console Logging',
      hint: 'Show detailed LLM conversation logs in browser console (useful for debugging)',
      scope: 'world',
      config: false,
      type: Boolean,
      default: false,
    });

    game.settings.register(this.SETTINGS_KEY, 'enableToolCalls', {
      name: 'Enable Tool System',
      hint: 'Allow the AI to use tools to access Foundry data (disable for simple chat only)',
      scope: 'world',
      config: false,
      type: Boolean,
      default: true,
    });

    // Familiar Customization
    game.settings.register(this.SETTINGS_KEY, 'familiarName', {
      name: 'Familiar Name',
      hint: 'What to call your magical familiar',
      scope: 'world',
      config: false, // Hidden from game settings - only in custom dialog
      type: String,
      default: 'Familiar',
    });

    game.settings.register(this.SETTINGS_KEY, 'familiarIcon', {
      name: 'Familiar Icon',
      hint: 'Emoji or symbol to represent your familiar (e.g., 🧙, 🦉, 🐱, ⭐)',
      scope: 'world',
      config: false, // Hidden from game settings - only in custom dialog
      type: String,
      default: '🧙',
    });

    // Custom settings menu for familiar configuration
    game.settings.registerMenu(this.SETTINGS_KEY, 'familiarConfig', {
      name: 'Familiar Configuration',
      label: 'Configure Familiar',
      hint: "Configure your magical familiar's LLM connection, behavior, and appearance",
      icon: 'fas fa-magic',
      type: FamiliarSettingsDialog,
      restricted: true,
    });
  }

  /**
   * Get all current settings as a typed object
   */
  static getSettings(): FamiliarSettings {
    return {
      llmEndpoint: game.settings.get(this.SETTINGS_KEY, 'llmEndpoint') as string,
      apiKey: game.settings.get(this.SETTINGS_KEY, 'apiKey') as string,
      model: game.settings.get(this.SETTINGS_KEY, 'model') as string,
      temperature: game.settings.get(this.SETTINGS_KEY, 'temperature') as number,
      maxTokens: game.settings.get(this.SETTINGS_KEY, 'maxTokens') as number,
      systemPrompt: game.settings.get(this.SETTINGS_KEY, 'systemPrompt') as string,
      enableConsoleLogging: game.settings.get(this.SETTINGS_KEY, 'enableConsoleLogging') as boolean,
      enableToolCalls: game.settings.get(this.SETTINGS_KEY, 'enableToolCalls') as boolean,
      familiarName: game.settings.get(this.SETTINGS_KEY, 'familiarName') as string,
      familiarIcon: game.settings.get(this.SETTINGS_KEY, 'familiarIcon') as string,
    };
  }

  /**
   * Get a single setting value
   */
  static getSetting<K extends keyof FamiliarSettings>(key: K): FamiliarSettings[K] {
    return game.settings.get(this.SETTINGS_KEY, key) as FamiliarSettings[K];
  }

  /**
   * Set a single setting value
   */
  static async setSetting<K extends keyof FamiliarSettings>(
    key: K,
    value: FamiliarSettings[K]
  ): Promise<void> {
    await game.settings.set(this.SETTINGS_KEY, key, value);
  }

  /**
   * Test LLM connection with current settings
   */
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const settings = this.getSettings();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (settings.apiKey) {
        headers['Authorization'] = `Bearer ${settings.apiKey}`;
      }

      const response = await fetch(settings.llmEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: settings.model,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          message: `Connection failed: ${response.status} ${response.statusText}\n${errorText}`,
        };
      }

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return {
          success: true,
          message: 'Connection successful! The Familiar is ready to assist.',
        };
      } else {
        return {
          success: false,
          message: 'Connection successful but response format unexpected',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Reset all settings to defaults
   */
  static async resetToDefaults(): Promise<void> {
    const defaultSettings: Partial<FamiliarSettings> = {
      llmEndpoint: 'http://localhost:11434/v1/chat/completions',
      apiKey: '',
      model: 'llama3.2',
      temperature: 0.7,
      maxTokens: 600,
      systemPrompt:
        'You are a helpful magical familiar assisting a game master. You have access to tools to help answer questions about the campaign.',
      enableConsoleLogging: false,
      enableToolCalls: true,
      familiarName: 'Familiar',
      familiarIcon: '🧙',
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      await game.settings.set(this.SETTINGS_KEY, key, value);
    }
  }
}
