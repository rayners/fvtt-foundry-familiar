/**
 * Settings configuration dialog for Foundry Familiar
 * Provides advanced configuration options and connection testing
 */

import { SettingsManager } from '../settings';

export class FamiliarSettingsDialog extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'familiar-settings',
      title: 'Foundry Familiar Configuration',
      template: 'modules/foundry-familiar/templates/settings-dialog.hbs',
      width: 650,
      height: 600,
      closeOnSubmit: false,
      submitOnChange: false,
      resizable: true,
      classes: ['familiar-settings'],
      tabs: [{ navSelector: '.tabs', contentSelector: '.sheet-body', initial: 'connection' }],
    });
  }

  async getData() {
    const settings = SettingsManager.getSettings();

    return {
      ...settings,
      isLocalEndpoint:
        settings.llmEndpoint.includes('localhost') || settings.llmEndpoint.includes('127.0.0.1'),
      endpoints: [
        {
          value: 'http://localhost:11434/v1/chat/completions',
          label: 'Ollama (Default)',
          type: 'local',
        },
        { value: 'http://localhost:3000/v1/chat/completions', label: 'Local Proxy', type: 'local' },
        { value: 'https://api.openai.com/v1/chat/completions', label: 'OpenAI', type: 'remote' },
        { value: 'custom', label: 'Custom Endpoint', type: 'custom' },
      ],
      models: [
        { value: 'llama3.2', label: 'Llama 3.2 (Recommended for local)' },
        { value: 'qwen2.5', label: 'Qwen 2.5' },
        { value: 'gpt-4', label: 'GPT-4 (OpenAI)' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (OpenAI)' },
        { value: 'custom', label: 'Custom Model Name' },
      ],
    };
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);

    // Test connection button
    html.find('#test-connection').click(async event => {
      event.preventDefault();
      await this._testConnection(html);
    });

    // Reset to defaults button
    html.find('#reset-defaults').click(async event => {
      event.preventDefault();
      await this._resetDefaults(html);
    });

    // Endpoint dropdown change
    html.find('#endpoint-select').change(event => {
      const selectedValue = $(event.target).val() as string;
      const customField = html.find('#llmEndpoint');

      if (selectedValue === 'custom') {
        customField.prop('readonly', false).focus();
      } else {
        customField.val(selectedValue).prop('readonly', true);
      }
    });

    // Model dropdown change
    html.find('#model-select').change(event => {
      const selectedValue = $(event.target).val() as string;
      const customField = html.find('#model');

      if (selectedValue === 'custom') {
        customField.prop('readonly', false).focus();
      } else {
        customField.val(selectedValue).prop('readonly', true);
      }
    });

    // Initialize dropdowns
    this._initializeDropdowns(html);
  }

  private _initializeDropdowns(html: JQuery) {
    const settings = SettingsManager.getSettings();

    // Set endpoint dropdown
    const endpointSelect = html.find('#endpoint-select');
    const endpointField = html.find('#llmEndpoint');
    const predefinedEndpoints = [
      'http://localhost:11434/v1/chat/completions',
      'http://localhost:3000/v1/chat/completions',
      'https://api.openai.com/v1/chat/completions',
    ];

    if (predefinedEndpoints.includes(settings.llmEndpoint)) {
      endpointSelect.val(settings.llmEndpoint);
      endpointField.prop('readonly', true);
    } else {
      endpointSelect.val('custom');
      endpointField.prop('readonly', false);
    }

    // Set model dropdown
    const modelSelect = html.find('#model-select');
    const modelField = html.find('#model');
    const predefinedModels = ['llama3.2', 'qwen2.5', 'gpt-4', 'gpt-3.5-turbo'];

    if (predefinedModels.includes(settings.model)) {
      modelSelect.val(settings.model);
      modelField.prop('readonly', true);
    } else {
      modelSelect.val('custom');
      modelField.prop('readonly', false);
    }
  }

  async _updateObject(event: Event, formData: any) {
    try {
      // Save all settings
      for (const [key, value] of Object.entries(formData)) {
        if (key in SettingsManager.getSettings()) {
          await SettingsManager.setSetting(key as any, value);
        }
      }

      ui.notifications.info('Foundry Familiar settings saved successfully!');

      // Keep dialog open for further configuration
      this.render();
    } catch (error) {
      console.error('Error saving Familiar settings:', error);
      ui.notifications.error('Failed to save settings. Check console for details.');
    }
  }

  private async _testConnection(html: JQuery) {
    const button = html.find('#test-connection');
    const originalText = button.text();

    // Update button state
    button.prop('disabled', true).text('Testing...');

    try {
      // Get current form values for testing
      const testEndpoint = html.find('#llmEndpoint').val() as string;
      const testApiKey = html.find('#apiKey').val() as string;
      const testModel = html.find('#model').val() as string;

      // Validate required fields
      if (!testEndpoint || testEndpoint.trim() === '') {
        throw new Error('LLM Endpoint URL is required');
      }
      if (!testModel || testModel.trim() === '') {
        throw new Error('Model name is required');
      }

      // Temporarily save settings for test
      const originalSettings = SettingsManager.getSettings();
      await SettingsManager.setSetting('llmEndpoint', testEndpoint);
      await SettingsManager.setSetting('apiKey', testApiKey);
      await SettingsManager.setSetting('model', testModel);

      // Test connection
      const result = await SettingsManager.testConnection();

      // Restore original settings
      await SettingsManager.setSetting('llmEndpoint', originalSettings.llmEndpoint);
      await SettingsManager.setSetting('apiKey', originalSettings.apiKey);
      await SettingsManager.setSetting('model', originalSettings.model);

      // Show result
      if (result.success) {
        ui.notifications.info(result.message);
        button.addClass('success').text('✓ Connected');
        setTimeout(() => {
          button.removeClass('success').text(originalText);
        }, 3000);
      } else {
        ui.notifications.error(`Connection failed: ${result.message}`);
        button.addClass('error').text('✗ Failed');
        setTimeout(() => {
          button.removeClass('error').text(originalText);
        }, 3000);
      }
    } catch (error) {
      console.error('Connection test error:', error);
      ui.notifications.error('Connection test failed. Check console for details.');
      button.addClass('error').text('✗ Error');
      setTimeout(() => {
        button.removeClass('error').text(originalText);
      }, 3000);
    } finally {
      button.prop('disabled', false);
    }
  }

  private async _resetDefaults(_html: JQuery) {
    const confirm = await Dialog.confirm({
      title: 'Reset to Defaults',
      content:
        '<p>Are you sure you want to reset all Foundry Familiar settings to their default values?</p>',
      defaultYes: false,
    });

    if (confirm) {
      try {
        await SettingsManager.resetToDefaults();
        ui.notifications.info('Settings reset to defaults.');
        this.render(); // Re-render with new values
      } catch (error) {
        console.error('Error resetting settings:', error);
        ui.notifications.error('Failed to reset settings. Check console for details.');
      }
    }
  }

  /**
   * Show the settings dialog
   */
  static show() {
    new FamiliarSettingsDialog().render(true);
  }
}
