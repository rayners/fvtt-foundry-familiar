/**
 * Tool system for LLM function calling
 * Provides structured access to Foundry data
 */

import { CollectionAnalyzer } from './collection-analyzer';
import { DataModelAnalyzer } from './datamodel-analyzer';

export class ToolSystem {
  private collectionAnalyzer: CollectionAnalyzer;
  private dataModelAnalyzer: DataModelAnalyzer;

  constructor() {
    this.collectionAnalyzer = new CollectionAnalyzer();
    this.dataModelAnalyzer = new DataModelAnalyzer();
  }

  /**
   * Execute a tool by name with parameters
   * Returns both user-friendly and LLM formats
   */
  async executeTool(toolName: string, toolParams: string): Promise<string> {
    switch (toolName) {
      // Generic collection tools
      case 'list_collection':
        return this.listCollection(toolParams);

      case 'get_collection_member':
        return this.getCollectionMember(toolParams);

      case 'search_collection':
        return this.searchCollection(toolParams);

      case 'list_by_folder':
        return this.listByFolder(toolParams);

      case 'list_collection_types':
        return this.listCollectionTypes();

      // DataModel analysis tools
      case 'analyze_game_system':
        return this.analyzeGameSystem();

      case 'analyze_modules':
        return this.analyzeModules();

      case 'analyze_document_schema':
        return this.analyzeDocumentSchema(toolParams);

      case 'analyze_config':
        return this.analyzeConfig();

      case 'analyze_datamodel_inheritance':
        return this.analyzeDataModelInheritance(toolParams);

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  /**
   * List available collection types
   */
  private listCollectionTypes(): string {
    const types = this.collectionAnalyzer.getAvailableCollectionTypes();
    return `Available collection types:\n${types.map(type => `- ${type}`).join('\n')}`;
  }

  /**
   * List all entries in a collection
   */
  private listCollection(type: string): string {
    try {
      const entries = this.collectionAnalyzer.listCollection(type);

      if (entries.length === 0) {
        return `No ${type} found in the game.`;
      }

      // Limit results to prevent overwhelming the LLM
      const maxResults = 20;
      const displayEntries = entries.slice(0, maxResults);
      const hasMore = entries.length > maxResults;

      // LLM format includes IDs for tool calls
      const llmFormatted = displayEntries.map((entry, index) => {
        return `${index + 1}. ${entry.name} (ID: ${entry.id})${entry.folder ? ` [Folder: ${entry.folder}]` : ''}`;
      });

      // User format hides IDs but keeps all other info
      const userFormatted = displayEntries.map((entry, index) => {
        return `${index + 1}. ${entry.name}${entry.folder ? ` [Folder: ${entry.folder}]` : ''}`;
      });

      let result = `RESULT: list_collection\nCOUNT: ${entries.length}\nENTRIES:\n${llmFormatted.join('\n')}\n\nUSER_VIEW:\n${userFormatted.join('\n')}`;

      if (hasMore) {
        result += `\n\n[Showing first ${maxResults} of ${entries.length} entries. Use get_collection_member(type, id) for details on specific entries]`;
      }

      return result;
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Get a specific collection member by type and ID
   */
  private getCollectionMember(params: string): string {
    try {
      // Parse parameters: type,id
      const [type, id] = params.split(',').map(p => p.trim());

      if (!type || !id) {
        return 'Error: get_collection_member requires two parameters: type,id\nExample: get_collection_member("actors", "actor123")';
      }

      const member = this.collectionAnalyzer.getCollectionMember(type, id);

      // LLM format includes ID for potential follow-up tool calls
      let llmResult = `=== ${member.name} (${member.type}) ===\n`;
      llmResult += `ID: ${member.id}\n`;
      if (member.folder) {
        llmResult += `Folder: ${member.folder}\n`;
      }

      // User format omits ID
      let userResult = `=== ${member.name} (${member.type}) ===\n`;
      if (member.folder) {
        userResult += `Folder: ${member.folder}\n`;
      }

      // Common metadata and content for both formats
      let commonContent = '';
      if (Object.keys(member.metadata).length > 0) {
        commonContent += `\nMetadata:\n`;
        Object.entries(member.metadata).forEach(([key, value]) => {
          commonContent += `- ${key}: ${value}\n`;
        });
      }
      commonContent += `\nContent:\n${member.content}`;

      return llmResult + commonContent + `\n\nUSER_VIEW:\n` + userResult + commonContent;
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * List collection entries by folder name
   */
  private listByFolder(params: string): string {
    try {
      // Parse parameters: type,folderName
      const [type, folderName] = params.split(',').map(p => p.trim());

      if (!type || !folderName) {
        return 'Error: list_by_folder requires two parameters: type,folderName\nExample: list_by_folder("actors", "Pre-Gen Characters")';
      }

      const entries = this.collectionAnalyzer.listCollection(type);

      // Filter by folder name (case-insensitive partial match)
      const filtered = entries.filter(
        entry => entry.folder && entry.folder.toLowerCase().includes(folderName.toLowerCase())
      );

      if (filtered.length === 0) {
        return `No ${type} found in folders containing "${folderName}".`;
      }

      const maxResults = 20;
      const displayEntries = filtered.slice(0, maxResults);
      const hasMore = filtered.length > maxResults;

      // LLM format with IDs
      const llmFormatted = displayEntries.map((entry, index) => {
        return `${index + 1}. ${entry.name} (ID: ${entry.id})`;
      });

      // User format without IDs
      const userFormatted = displayEntries.map((entry, index) => {
        return `${index + 1}. ${entry.name}`;
      });

      let result = `RESULT: list_by_folder\nCOUNT: ${filtered.length}\nFOLDER: ${folderName}\nENTRIES:\n${llmFormatted.join('\n')}\n\nUSER_VIEW:\n${userFormatted.join('\n')}`;

      if (hasMore) {
        result += `\n\n[Showing first ${maxResults} of ${filtered.length} entries]`;
      }

      return result;
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Search a collection for specific content
   */
  private searchCollection(params: string): string {
    try {
      // Parse parameters: type,query
      const [type, query] = params.split(',').map(p => p.trim());

      if (!type || !query) {
        return 'Error: search_collection requires two parameters: type,query\nExample: search_collection("actors", "dragon")';
      }

      const results = this.collectionAnalyzer.searchCollection(type, query);

      if (results.length === 0) {
        return `No ${type} found matching "${query}".`;
      }

      const maxResults = 10; // Fewer for search since content is longer
      const displayResults = results.slice(0, maxResults);
      const hasMore = results.length > maxResults;

      // LLM format with IDs
      const llmFormatted = displayResults.map((result, index) => {
        const contentPreview =
          result.content.length > 100 ? result.content.substring(0, 100) + '...' : result.content;
        return `${index + 1}. ${result.name} (ID: ${result.id}) - ${result.relevance} match\n   Preview: ${contentPreview}`;
      });

      // User format without IDs
      const userFormatted = displayResults.map((result, index) => {
        const contentPreview =
          result.content.length > 100 ? result.content.substring(0, 100) + '...' : result.content;
        return `${index + 1}. ${result.name} - ${result.relevance} match\n   Preview: ${contentPreview}`;
      });

      let output = `RESULT: search_collection\nCOUNT: ${results.length}\nQUERY: ${query}\nENTRIES:\n${llmFormatted.join('\n\n')}\n\nUSER_VIEW:\n${userFormatted.join('\n\n')}`;

      if (hasMore) {
        output += `\n\n[Showing first ${maxResults} of ${results.length} matches. Use get_collection_member(type, id) for full details]`;
      }

      return output;
    } catch (error) {
      return (error as Error).message;
    }
  }

  /**
   * Analyze the current game system's data models
   */
  private analyzeGameSystem(): string {
    try {
      const analysis = this.dataModelAnalyzer.analyzeGameSystem();

      let result = `=== GAME SYSTEM ANALYSIS ===\n`;
      result += `System: ${analysis.systemTitle} (${analysis.systemId})\n`;
      result += `Version: ${analysis.version}\n\n`;

      if (Object.keys(analysis.documentTypes).length > 0) {
        result += `Document Types:\n`;
        Object.entries(analysis.documentTypes).forEach(([docType, types]) => {
          result += `- ${docType}: ${Object.keys(types as object).join(', ')}\n`;
        });
        result += '\n';
      }

      if (Object.keys(analysis.dataModels).length > 0) {
        result += `Data Models:\n`;
        Object.entries(analysis.dataModels).forEach(([docType, models]) => {
          result += `- ${docType}: ${(models as string[]).join(', ')}\n`;
        });
        result += '\n';
      }

      if (Object.keys(analysis.templateTypes).length > 0) {
        result += `Template Types:\n`;
        Object.entries(analysis.templateTypes).forEach(([docType, template]) => {
          result += `- ${docType}: ${Object.keys(template as object).join(', ')}\n`;
        });
      }

      return result;
    } catch (error) {
      return `Error analyzing game system: ${(error as Error).message}`;
    }
  }

  /**
   * Analyze installed modules and their integrations
   */
  private analyzeModules(): string {
    try {
      const modules = this.dataModelAnalyzer.analyzeModules();

      let result = `=== MODULES ANALYSIS ===\n`;
      result += `Total Modules: ${modules.length}\n`;

      const activeModules = modules.filter(m => m.active);
      const inactiveModules = modules.filter(m => !m.active);

      result += `Active: ${activeModules.length} | Inactive: ${inactiveModules.length}\n\n`;

      if (activeModules.length > 0) {
        result += `ACTIVE MODULES:\n`;
        activeModules.forEach(module => {
          result += `\n- ${module.title} (${module.id}) v${module.version}\n`;
          if (module.api) {
            result += `  • Has API exposed\n`;
          }
          if (module.configContributions.length > 0) {
            result += `  • CONFIG contributions: ${module.configContributions.join(', ')}\n`;
          }
          if (module.documentModifications.length > 0) {
            result += `  • Document modifications: ${module.documentModifications.join(', ')}\n`;
          }
        });
      }

      if (inactiveModules.length > 0) {
        result += `\n\nINACTIVE MODULES: ${inactiveModules.map(m => m.title).join(', ')}`;
      }

      return result;
    } catch (error) {
      return `Error analyzing modules: ${(error as Error).message}`;
    }
  }

  /**
   * Analyze document schema for a specific type
   */
  private analyzeDocumentSchema(documentType: string): string {
    try {
      const schema = this.dataModelAnalyzer.analyzeDocumentSchema(documentType);

      let result = `=== ${documentType.toUpperCase()} DOCUMENT SCHEMA ===\n`;
      result += `Document Class: ${schema.documentClass}\n\n`;

      if (Object.keys(schema.dataSchema).length > 0) {
        result += `Data Schema Fields:\n`;
        Object.entries(schema.dataSchema).forEach(([field, info]) => {
          result += `- ${field}: ${(info as any).type}${(info as any).required ? ' (required)' : ''}\n`;
        });
        result += '\n';
      }

      if (Object.keys(schema.systemFields).length > 0) {
        result += `System Fields (sample from existing document):\n`;
        Object.entries(schema.systemFields).forEach(([field, type]) => {
          result += `- ${field}: ${type}\n`;
        });
        result += '\n';
      }

      if (Object.keys(schema.moduleFields).length > 0) {
        result += `Module Fields (flags):\n`;
        Object.entries(schema.moduleFields).forEach(([moduleId, fields]) => {
          result += `- ${moduleId}:\n`;
          Object.entries(fields as object).forEach(([field, type]) => {
            result += `  • ${field}: ${type}\n`;
          });
        });
        result += '\n';
      }

      if (schema.methods.length > 0) {
        result += `Available Methods: ${schema.methods.slice(0, 10).join(', ')}${schema.methods.length > 10 ? '...' : ''}\n`;
      }

      return result;
    } catch (error) {
      return `Error analyzing document schema: ${(error as Error).message}`;
    }
  }

  /**
   * Analyze CONFIG object and system configuration
   */
  private analyzeConfig(): string {
    try {
      const config = this.dataModelAnalyzer.analyzeConfig();

      let result = `=== CONFIG ANALYSIS ===\n`;
      result += `Foundry Version: ${config.foundryVersion}\n\n`;

      if (Object.keys(config.systemConfig).length > 0) {
        result += `System Configuration:\n`;
        Object.entries(config.systemConfig).forEach(([key, value]) => {
          result += `- ${key}:\n`;
          Object.entries(value as object).forEach(([prop, val]) => {
            if (val) {
              result += `  • ${prop}: ${Array.isArray(val) ? `[${(val as string[]).join(', ')}]` : typeof val}\n`;
            }
          });
        });
        result += '\n';
      }

      if (Object.keys(config.moduleConfig).length > 0) {
        result += `Module CONFIG Additions:\n`;
        Object.entries(config.moduleConfig).forEach(([key, type]) => {
          result += `- CONFIG.${key}: ${type}\n`;
        });
        result += '\n';
      }

      if (config.statusEffects.length > 0) {
        result += `Status Effects: ${config.statusEffects.length} configured\n`;
      }

      if (Object.keys(config.conditions).length > 0) {
        result += `Conditions: ${Object.keys(config.conditions).join(', ')}\n`;
      }

      return result;
    } catch (error) {
      return `Error analyzing CONFIG: ${(error as Error).message}`;
    }
  }

  /**
   * Analyze data model inheritance for a document type
   */
  private analyzeDataModelInheritance(documentType: string): string {
    try {
      const inheritance = this.dataModelAnalyzer.analyzeDataModelInheritance(documentType);

      let result = `=== ${documentType.toUpperCase()} INHERITANCE ANALYSIS ===\n`;

      if (inheritance.inheritanceChain.length > 0) {
        result += `Inheritance Chain:\n`;
        inheritance.inheritanceChain.forEach((className, index) => {
          result += `${'  '.repeat(index)}${index > 0 ? '↳ ' : ''}${className}\n`;
        });
        result += '\n';
      }

      if (inheritance.mixins.length > 0) {
        result += `Mixins: ${inheritance.mixins.join(', ')}\n\n`;
      }

      if (Object.keys(inheritance.dataFields).length > 0) {
        result += `Data Fields:\n`;
        Object.entries(inheritance.dataFields).forEach(([field, info]) => {
          result += `- ${field}: ${(info as any).type}${(info as any).required ? ' (required)' : ''}\n`;
        });
        result += '\n';
      }

      if (Object.keys(inheritance.defaultValues).length > 0) {
        result += `Default Values:\n`;
        Object.entries(inheritance.defaultValues).forEach(([field, value]) => {
          result += `- ${field}: ${JSON.stringify(value)}\n`;
        });
      }

      return result;
    } catch (error) {
      return `Error analyzing inheritance: ${(error as Error).message}`;
    }
  }

  /**
   * Get available tool descriptions
   */
  getAvailableTools(): Array<{
    name: string;
    description: string;
    parameters: string;
  }> {
    return [
      // Generic collection tools
      {
        name: 'list_collection_types',
        description: 'Lists all available collection types (journals, scenes, actors, items, etc.)',
        parameters: 'none',
      },
      {
        name: 'list_collection',
        description:
          'Lists all entries in a specific collection type with ID, name, and folder location',
        parameters:
          'type (string) - Collection type (journals, scenes, actors, items, playlists, tables, macros, cards, folders)',
      },
      {
        name: 'get_collection_member',
        description: 'Gets detailed information about a specific collection member by ID',
        parameters: 'type,id (string) - Collection type and member ID separated by comma',
      },
      {
        name: 'search_collection',
        description: 'Searches a collection for entries matching a query (by name or content)',
        parameters: 'type,query (string) - Collection type and search query separated by comma',
      },

      // DataModel analysis tools
      {
        name: 'analyze_game_system',
        description:
          "Analyzes the current game system's data models, document types, and configuration",
        parameters: 'none',
      },
      {
        name: 'analyze_modules',
        description: 'Analyzes all installed modules, their status, and integration points',
        parameters: 'none',
      },
      {
        name: 'analyze_document_schema',
        description: 'Analyzes the schema and structure of a specific document type',
        parameters:
          'documentType (string) - Document type to analyze (actor, item, scene, journal, etc.)',
      },
      {
        name: 'analyze_config',
        description: 'Analyzes the CONFIG object and system configuration settings',
        parameters: 'none',
      },
      {
        name: 'analyze_datamodel_inheritance',
        description: 'Analyzes inheritance chain and data model structure for a document type',
        parameters: 'documentType (string) - Document type to analyze inheritance for',
      },
    ];
  }
}
