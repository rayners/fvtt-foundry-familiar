/**
 * FVTT Familiar - AI-powered assistant for Foundry VTT
 * Provides LLM integration for campaign assistance and content generation
 */

// Import styles to trigger SCSS compilation
import './styles/familiar.scss';

import { FamiliarManager } from './core/familiar-manager';
import { LLMService } from './core/llm-service';
import { ToolSystem } from './core/tool-system';
import { SettingsManager } from './settings';
import { FamiliarSettingsDialog } from './ui/settings-dialog';
import { micromark } from 'micromark';

let familiarManager: FamiliarManager;

/**
 * Initialize the Familiar module
 */
Hooks.once('init', () => {
  // Register module settings first
  SettingsManager.registerSettings();
  
  // Only log if console logging is enabled
  const settings = SettingsManager.getSettings();
  if (settings.enableConsoleLogging) {
    console.log('🧙 Foundry Familiar | Initializing module');
  }
  
  // Initialize core services
  const llmService = new LLMService();
  const toolSystem = new ToolSystem();
  
  // Initialize manager
  familiarManager = new FamiliarManager(llmService, toolSystem);
});

/**
 * Setup API and register commands when ready
 */
Hooks.once('ready', () => {
  // Expose global API
  game.foundryFamiliar = familiarManager.getAPI();

  // Only show help if console logging is enabled
  const settings = SettingsManager.getSettings();
  if (settings.enableConsoleLogging) {
    console.log('🧙 Foundry Familiar ready. Commands:');
    console.log('  game.foundryFamiliar.ask(prompt) - Ask with tool access (full conversation in console)');
    console.log('  game.foundryFamiliar.summon(prompt) - Simple prompt/response');
    console.log('  game.foundryFamiliar.settings() - Open settings dialog (configure name, icon, system prompt)');
    console.log('');
    console.log('🧙 Chat Commands:');
    console.log('  /ask <prompt> - Enhanced AI with tools (shows thinking in console)');
    console.log('  /familiar <prompt> - Simple AI response');
    console.log('');
    console.log('⚙️  Use game.foundryFamiliar.settings() for full configuration (not Module Settings)');
  }
  
  // Add settings method to API
  game.foundryFamiliar.settings = () => FamiliarSettingsDialog.show();

  // Register chat commands
  Hooks.on('chatMessage', (chatLog, message, _chatData): boolean => {
    // Enhanced ask command with tools
    if (message.startsWith('/ask')) {
      const query = message.slice('/ask'.length).trim();
      if (!query) return true;

      familiarManager.askWithTools(query);
      return false; // Prevent normal chat processing
    }

    // Simple familiar command
    if (message.startsWith('/familiar')) {
      const query = message.slice('/familiar'.length).trim();
      if (!query) return true;

      familiarManager.handlePrompt(query).then((response) => {
        // Filter out thinking tags and convert markdown to HTML
        const filteredContent = response.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        const htmlContent = micromark(filteredContent);
          
        ChatMessage.create({ 
          content: `<strong>${SettingsManager.getSettings().familiarIcon} ${SettingsManager.getSettings().familiarName} says:</strong><br>${htmlContent}` 
        });
      });
      return false; // Prevent normal chat processing
    }

    return true;
  });
});