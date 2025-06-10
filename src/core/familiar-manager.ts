/**
 * Core manager for Familiar functionality
 * Coordinates between LLM service, tool system, and Foundry integration
 */

import type { FamiliarAPI, LLMMessage } from '../types/foundry-types';
import type { LLMService } from './llm-service';
import type { ToolSystem } from './tool-system';
import { SettingsManager } from '../settings';
import { micromark } from 'micromark';

export class FamiliarManager {
  constructor(
    private llmService: LLMService,
    private toolSystem: ToolSystem
  ) {}

  /**
   * Get the public API for external access
   */
  getAPI(): FamiliarAPI {
    return {
      ask: this.askWithTools.bind(this),
      summon: this.summonFamiliar.bind(this),
      settings: this.openSettings.bind(this),
    };
  }

  /**
   * Open the settings configuration dialog
   */
  openSettings(): void {
    // Use the same approach as other Foundry modules to open settings
    import('../ui/settings-dialog').then(module => {
      module.FamiliarSettingsDialog.show();
    });
  }

  /**
   * Simple prompt/response without tools
   */
  async summonFamiliar(prompt: string): Promise<void> {
    try {
      const settings = SettingsManager.getSettings();
      const response = await this.llmService.sendRequest({
        model: settings.model,
        messages: [
          {
            role: 'system',
            content: settings.systemPrompt,
          },
          { role: 'user', content: prompt },
        ],
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
      });

      const content = response.choices?.[0]?.message?.content || '🪄 The Familiar is silent.';

      // Filter out thinking tags and convert markdown to HTML
      const filteredContent = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      const htmlContent = micromark(filteredContent);

      await ChatMessage.create({
        content: `<strong>${settings.familiarIcon} ${settings.familiarName} says:</strong><br>${htmlContent}`,
      });
    } catch (error) {
      console.error('Familiar error:', error);
      const settings = SettingsManager.getSettings();
      await ChatMessage.create({
        content: `<strong>${settings.familiarIcon} ${settings.familiarName} says:</strong><br>⚠️ The familiar encountered a magical disturbance.`,
      });
    }
  }

  /**
   * Enhanced prompt with tool access
   */
  async askWithTools(prompt: string): Promise<void> {
    try {
      const settings = SettingsManager.getSettings();

      // Check if tools are disabled
      if (!settings.enableToolCalls) {
        await this.summonFamiliar(prompt);
        return;
      }

      const systemPrompt = this.buildSystemPrompt();
      const conversationHistory: LLMMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ];

      if (settings.enableConsoleLogging) {
        console.log('🧙 === FAMILIAR CONVERSATION START ===');
        console.log('🧙 System Prompt:', systemPrompt);
        console.log('🧙 User Request:', prompt);
        console.log('🧙 =====================================');
      }

      const maxIterations = 5;
      let iteration = 0;

      while (iteration < maxIterations) {
        iteration++;

        if (settings.enableConsoleLogging) {
          console.log(`\n🧙 === ITERATION ${iteration} ===`);
          console.log('🧙 Sending to LLM:', {
            messageCount: conversationHistory.length,
            messages: conversationHistory.map(m => ({
              role: m.role,
              contentLength: m.content.length,
            })),
          });
        }

        const response = await this.llmService.sendRequest({
          model: settings.model,
          messages: conversationHistory,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
        });

        const content =
          response.choices?.[0]?.message?.content || '🪄 Nothing came through the veil.';
        if (settings.enableConsoleLogging) {
          console.log(`🧙 Raw LLM Response:`, content);
        }

        // Check for new tool call format
        const toolCallMatch = content.match(/TOOL_CALL:\s*(\w+)[\s\S]*?PARAMS:\s*(.+?)(?:\n|$)/);

        if (!toolCallMatch) {
          // No tool call, this is the final response
          if (settings.enableConsoleLogging) {
            console.log('🧙 ✅ Final response (no tool call detected)');
            console.log('🧙 === CONVERSATION END ===\n');
          }

          // Filter out thinking tags and convert markdown to HTML
          const filteredContent = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
          const htmlContent = micromark(filteredContent);

          await ChatMessage.create({
            content: `<strong>${settings.familiarIcon} ${settings.familiarName} says:</strong><br>${htmlContent}`,
          });
          return;
        }

        // Execute tool call
        const toolName = toolCallMatch[1];
        const toolParams = toolCallMatch[2].trim();

        if (settings.enableConsoleLogging) {
          console.log(`🧙 🔧 Tool Call Detected: ${toolName}("${toolParams}")`);
        }

        // Show thinking indicator
        (ui as any)?.notifications?.info(
          `${settings.familiarIcon} ${settings.familiarName} is thinking...`,
          { permanent: false }
        );

        let toolResult: string;
        try {
          toolResult = await this.toolSystem.executeTool(toolName, toolParams);
          if (settings.enableConsoleLogging) {
            console.log(
              `🧙 ✅ Tool Result (${toolResult.length} chars):`,
              toolResult.length > 200 ? toolResult.substring(0, 200) + '...' : toolResult
            );
          }
        } catch (err) {
          toolResult = `Error executing tool: ${(err as Error).message}`;
          if (settings.enableConsoleLogging) {
            console.log(`🧙 ❌ Tool Error:`, toolResult);
          }
        }

        // Parse tool result to separate LLM and user formats
        const { llmFormat, userFormat } = this.parseToolResult(toolResult);

        // Add tool call and result to conversation (LLM gets full result including IDs)
        conversationHistory.push(
          { role: 'assistant', content },
          { role: 'user', content: `Tool result: ${llmFormat}` }
        );

        // Store user-friendly format for potential display
        if (settings.enableConsoleLogging && userFormat) {
          console.log(`🧙 👤 User-friendly tool result:`, userFormat);
        }

        if (settings.enableConsoleLogging) {
          console.log(`🧙 📝 Added to conversation: assistant message + tool result`);
          console.log(`🧙 📊 Conversation now has ${conversationHistory.length} messages`);
        }
      }

      // Fallback if we hit max iterations
      if (settings.enableConsoleLogging) {
        console.log('🧙 ❌ Max iterations reached without final response');
        console.log('🧙 === CONVERSATION END (TIMEOUT) ===\n');
      }

      await ChatMessage.create({
        content: `<strong>${settings.familiarIcon} ${settings.familiarName} says:</strong><br>⚠️ I got a bit confused trying to use my tools. Let me try a simpler approach.`,
      });
    } catch (error) {
      const settings = SettingsManager.getSettings();
      if (settings.enableConsoleLogging) {
        console.log('🧙 💥 CONVERSATION ERROR:', error);
        console.log('🧙 === CONVERSATION END (ERROR) ===\n');
      }
      console.error('Familiar error:', error);
      await ChatMessage.create({
        content: `<strong>${settings.familiarIcon} ${settings.familiarName} says:</strong><br>⚠️ The familiar encountered a magical disturbance.`,
      });
    }
  }

  /**
   * Handle simple prompt (used by chat command)
   */
  async handlePrompt(prompt: string): Promise<string> {
    try {
      const settings = SettingsManager.getSettings();
      const response = await this.llmService.sendRequest({
        model: settings.model,
        messages: [
          {
            role: 'system',
            content: settings.systemPrompt,
          },
          { role: 'user', content: prompt },
        ],
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
      });

      return response.choices?.[0]?.message?.content || '🪄 The Familiar is silent.';
    } catch (error) {
      console.error('Familiar error:', error);
      return '⚠️ The Familiar encountered a magical disturbance.';
    }
  }

  /**
   * Parse tool result to separate LLM format (with IDs) from user format (without IDs)
   */
  private parseToolResult(toolResult: string): { llmFormat: string; userFormat: string | null } {
    // Check if the result contains USER_VIEW section
    const userViewMatch = toolResult.match(/\n\nUSER_VIEW:\n([\s\S]*?)(?:\n\n|$)/);

    if (userViewMatch) {
      // Extract the user-friendly version
      const userFormat = userViewMatch[1].trim();

      // Remove the USER_VIEW section from LLM format
      const llmFormat = toolResult.replace(/\n\nUSER_VIEW:[\s\S]*$/, '').trim();

      return { llmFormat, userFormat };
    }

    // No user view found, return original as LLM format
    return { llmFormat: toolResult, userFormat: null };
  }

  /**
   * Build system prompt with tool information
   */
  private buildSystemPrompt(): string {
    const settings = SettingsManager.getSettings();
    return `${settings.systemPrompt}

You have access to tools to help answer questions about the campaign.

CRITICAL INSTRUCTIONS:
1. ALWAYS use tools for campaign data - never guess or make up content
2. After getting tool results, IMMEDIATELY STOP and answer using ONLY the tool data
3. NEVER make another tool call after receiving tool results
4. NEVER invent or hallucinate data - use ONLY what tools return
5. If you see "Tool result:" in the conversation, that means you MUST answer now

Available tools:
- list_collection_types(): Lists all available collection types (journals, scenes, actors, items, etc.)
- list_collection(type): Lists all entries in a collection with ID, name, and folder location
- get_collection_member(type,id): Gets detailed information about a specific collection member
- search_collection(type,query): Searches a collection for entries matching a query
- list_by_folder(type,folderName): Lists entries in a specific folder (supports partial folder name matching)

DataModel analysis tools:
- analyze_game_system(): Analyzes current game system's data models and configuration
- analyze_modules(): Analyzes all installed modules and their integrations
- analyze_document_schema(type): Analyzes schema and structure of a document type
- analyze_config(): Analyzes CONFIG object and system settings
- analyze_datamodel_inheritance(type): Analyzes inheritance chain for a document type

Collection types available: journals, scenes, actors, items, playlists, tables, macros, cards, folders

ALWAYS start by using tools when asked about specific campaign content. Use the generic collection tools for access to all game data including journals.

Tool call format (use EXACTLY this format):
TOOL_CALL: tool_name
PARAMS: parameter1, parameter2

Example workflows:
User: "List all my NPCs"
Assistant: I'll list all actors in your campaign.

TOOL_CALL: list_collection
PARAMS: actors

User: "Tell me about the dragon named Flameheart"
Assistant: I'll search for actors named Flameheart.

TOOL_CALL: search_collection
PARAMS: actors, Flameheart

User: "Show me actors in the Pre-Gen Characters folder"
Assistant: I'll search for actors in the Pre-Gen Characters folder.

TOOL_CALL: list_by_folder
PARAMS: actors, Pre-Gen Characters

WORKFLOW: User asks question → Use ONE tool → Get results → Answer question using the actual data (NO MORE TOOLS)

IMPORTANT: When you see "Tool result:" followed by data, that is the FINAL step. You must:
1. Use ONLY that exact data in your response
2. Do NOT call any more tools
3. Do NOT make up additional information
4. Provide a clear answer based on the tool results

[After getting tool results, immediately provide your final answer]`;
  }
}
