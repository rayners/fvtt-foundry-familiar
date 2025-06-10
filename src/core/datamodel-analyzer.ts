/**
 * DataModel analysis for Foundry VTT systems and modules
 * Inspects document schemas, system data models, and module structures
 */

export class DataModelAnalyzer {
  /**
   * Analyze the active game system's data models
   */
  analyzeGameSystem(): {
    systemId: string;
    systemTitle: string;
    version: string;
    documentTypes: Record<string, any>;
    templateTypes: Record<string, any>;
    dataModels: Record<string, any>;
  } {
    const system = game.system;
    const config = CONFIG;

    return {
      systemId: system.id,
      systemTitle: system.title || system.data?.title || 'Unknown System',
      version: system.version || system.data?.version || 'Unknown',
      documentTypes: this.extractDocumentTypes(config),
      templateTypes: this.extractTemplateTypes(config),
      dataModels: this.extractDataModels(config)
    };
  }

  /**
   * Analyze installed modules and their data contributions
   */
  analyzeModules(): Array<{
    id: string;
    title: string;
    version: string;
    active: boolean;
    api: boolean;
    configContributions: string[];
    documentModifications: string[];
    hookRegistrations: string[];
  }> {
    const modules: Array<any> = [];

    for (const [id, module] of game.modules.entries()) {
      const analysis = {
        id,
        title: module.title || module.data?.title || id,
        version: module.version || module.data?.version || 'Unknown',
        active: module.active,
        api: !!(module.api || (global as any)[id] || (window as any)[id]),
        configContributions: this.findConfigContributions(id),
        documentModifications: this.findDocumentModifications(id),
        hookRegistrations: this.findModuleHooks(id)
      };
      
      modules.push(analysis);
    }

    return modules.sort((a, b) => {
      if (a.active && !b.active) return -1;
      if (!a.active && b.active) return 1;
      return a.title.localeCompare(b.title);
    });
  }

  /**
   * Analyze document schemas for specific document types
   */
  analyzeDocumentSchema(documentType: string): {
    documentType: string;
    documentClass: string;
    dataSchema: Record<string, any>;
    systemFields: Record<string, any>;
    moduleFields: Record<string, any>;
    methods: string[];
    properties: string[];
  } {
    const docClass = this.getDocumentClass(documentType);
    if (!docClass) {
      throw new Error(`Unknown document type: ${documentType}. Available types: ${this.getAvailableDocumentTypes().join(', ')}`);
    }

    // Get a sample document to analyze its structure
    const collection = this.getCollectionForType(documentType);
    const sampleDoc = collection?.values().next().value;

    return {
      documentType,
      documentClass: docClass.name,
      dataSchema: this.extractSchemaFields(docClass),
      systemFields: sampleDoc?.system ? this.analyzeObjectStructure(sampleDoc.system, 'system') : {},
      moduleFields: this.extractModuleFields(sampleDoc),
      methods: this.extractClassMethods(docClass),
      properties: this.extractClassProperties(docClass)
    };
  }

  /**
   * Get CONFIG object analysis
   */
  analyzeConfig(): {
    foundryVersion: string;
    systemConfig: Record<string, any>;
    moduleConfig: Record<string, any>;
    documentConfig: Record<string, any>;
    canvasConfig: Record<string, any>;
    statusEffects: any[];
    conditions: Record<string, any>;
  } {
    const config = CONFIG;

    return {
      foundryVersion: game.version || 'Unknown',
      systemConfig: this.extractSystemConfig(config),
      moduleConfig: this.extractModuleConfig(config),
      documentConfig: this.extractDocumentConfig(config),
      canvasConfig: this.extractCanvasConfig(config),
      statusEffects: config.statusEffects || [],
      conditions: config.Condition || {}
    };
  }

  /**
   * Analyze data model inheritance and structure
   */
  analyzeDataModelInheritance(documentType: string): {
    inheritanceChain: string[];
    mixins: string[];
    dataFields: Record<string, any>;
    validationRules: Record<string, any>;
    defaultValues: Record<string, any>;
  } {
    const docClass = this.getDocumentClass(documentType);
    if (!docClass) {
      throw new Error(`Unknown document type: ${documentType}`);
    }

    return {
      inheritanceChain: this.getInheritanceChain(docClass),
      mixins: this.getMixins(docClass),
      dataFields: this.extractDataFields(docClass),
      validationRules: this.extractValidationRules(docClass),
      defaultValues: this.extractDefaultValues(docClass)
    };
  }

  /**
   * Compare data models between different systems
   */
  compareSystemModels(_systemId1: string, _systemId2: string): {
    commonFields: string[];
    uniqueToSystem1: string[];
    uniqueToSystem2: string[];
    differentImplementations: string[];
    compatibility: 'high' | 'medium' | 'low';
  } {
    // This would need system data to be loaded
    // For now, return a placeholder structure
    return {
      commonFields: [],
      uniqueToSystem1: [],
      uniqueToSystem2: [],
      differentImplementations: [],
      compatibility: 'medium'
    };
  }

  // Private helper methods

  private extractDocumentTypes(config: any): Record<string, any> {
    const types: Record<string, any> = {};
    
    if (config.Actor?.typeLabels) {
      types.Actor = config.Actor.typeLabels;
    }
    if (config.Item?.typeLabels) {
      types.Item = config.Item.typeLabels;
    }
    if (config.JournalEntry?.typeLabels) {
      types.JournalEntry = config.JournalEntry.typeLabels;
    }
    
    return types;
  }

  private extractTemplateTypes(config: any): Record<string, any> {
    const templates: Record<string, any> = {};
    
    if (config.Actor?.template) {
      templates.Actor = config.Actor.template;
    }
    if (config.Item?.template) {
      templates.Item = config.Item.template;
    }
    
    return templates;
  }

  private extractDataModels(config: any): Record<string, any> {
    const models: Record<string, any> = {};
    
    // Look for system-specific data model registrations
    if (config.Actor?.dataModels) {
      models.Actor = Object.keys(config.Actor.dataModels);
    }
    if (config.Item?.dataModels) {
      models.Item = Object.keys(config.Item.dataModels);
    }
    
    return models;
  }

  private findConfigContributions(moduleId: string): string[] {
    const contributions: string[] = [];
    const config = CONFIG;
    
    // Look for module-specific CONFIG additions
    if ((config as any)[moduleId]) {
      contributions.push(`CONFIG.${moduleId}`);
    }
    
    // Check for common integration points
    const checkPaths = [
      'Actor.typeLabels',
      'Item.typeLabels',
      'statusEffects',
      'sounds',
      'ui'
    ];
    
    for (const path of checkPaths) {
      const value = this.getNestedProperty(config, path);
      if (value && typeof value === 'object') {
        const keys = Object.keys(value);
        if (keys.some(key => key.includes(moduleId) || key.toLowerCase().includes(moduleId.toLowerCase()))) {
          contributions.push(`CONFIG.${path}`);
        }
      }
    }
    
    return contributions;
  }

  private findDocumentModifications(moduleId: string): string[] {
    const modifications: string[] = [];
    
    // Check for document class modifications
    const documentTypes = ['Actor', 'Item', 'Scene', 'JournalEntry'];
    
    for (const docType of documentTypes) {
      const docClass = (CONFIG as any)[docType]?.documentClass;
      if (docClass) {
        // Check if the class has been modified by looking for non-standard methods
        const prototype = docClass.prototype;
        const methods = Object.getOwnPropertyNames(prototype);
        
        if (methods.some(method => method.includes(moduleId) || method.startsWith('_module'))) {
          modifications.push(`${docType} class methods`);
        }
      }
    }
    
    return modifications;
  }

  private findModuleHooks(moduleId: string): string[] {
    // This is difficult to detect at runtime, so return common hook patterns
    return [
      'init',
      'ready',
      `render${moduleId}`,
      `create${moduleId}`,
      `update${moduleId}`,
      `delete${moduleId}`
    ];
  }

  private getDocumentClass(documentType: string): any {
    const typeMap: Record<string, any> = {
      'actor': CONFIG.Actor?.documentClass,
      'item': CONFIG.Item?.documentClass,
      'scene': CONFIG.Scene?.documentClass,
      'journal': CONFIG.JournalEntry?.documentClass,
      'macro': CONFIG.Macro?.documentClass,
      'playlist': CONFIG.Playlist?.documentClass,
      'table': CONFIG.RollTable?.documentClass
    };
    
    return typeMap[documentType.toLowerCase()];
  }

  private getCollectionForType(documentType: string): Collection<any> | undefined {
    const collectionMap: Record<string, Collection<any>> = {
      'actor': game.actors,
      'item': game.items,
      'scene': game.scenes,
      'journal': game.journal,
      'macro': game.macros,
      'playlist': game.playlists,
      'table': game.tables
    };
    
    return collectionMap[documentType.toLowerCase()];
  }

  private getAvailableDocumentTypes(): string[] {
    return ['actor', 'item', 'scene', 'journal', 'macro', 'playlist', 'table'];
  }

  private extractSchemaFields(docClass: any): Record<string, any> {
    const schema: Record<string, any> = {};
    
    if (docClass.schema) {
      const schemaObj = docClass.schema;
      for (const [key, field] of Object.entries(schemaObj)) {
        schema[key] = {
          type: (field as any).constructor?.name || 'Unknown',
          required: (field as any).required || false,
          initial: (field as any).initial
        };
      }
    }
    
    return schema;
  }

  private analyzeObjectStructure(obj: any, prefix: string = ''): Record<string, any> {
    const structure: Record<string, any> = {};
    
    if (!obj || typeof obj !== 'object') return structure;
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (value === null || value === undefined) {
        structure[fullKey] = 'null/undefined';
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        structure[fullKey] = 'object';
        // Don't recurse too deeply to avoid circular references
        if (prefix.split('.').length < 3) {
          Object.assign(structure, this.analyzeObjectStructure(value, fullKey));
        }
      } else if (Array.isArray(value)) {
        structure[fullKey] = `array[${value.length}]`;
      } else {
        structure[fullKey] = typeof value;
      }
    }
    
    return structure;
  }

  private extractModuleFields(doc: any): Record<string, any> {
    const moduleFields: Record<string, any> = {};
    
    if (doc?.flags) {
      for (const [moduleId, moduleData] of Object.entries(doc.flags)) {
        if (moduleData && typeof moduleData === 'object') {
          moduleFields[moduleId] = this.analyzeObjectStructure(moduleData, `flags.${moduleId}`);
        }
      }
    }
    
    return moduleFields;
  }

  private extractClassMethods(docClass: any): string[] {
    const methods: string[] = [];
    const prototype = docClass.prototype;
    
    const methodNames = Object.getOwnPropertyNames(prototype);
    for (const name of methodNames) {
      if (typeof prototype[name] === 'function' && name !== 'constructor') {
        methods.push(name);
      }
    }
    
    return methods.sort();
  }

  private extractClassProperties(docClass: any): string[] {
    const properties: string[] = [];
    const prototype = docClass.prototype;
    
    const propertyNames = Object.getOwnPropertyNames(prototype);
    for (const name of propertyNames) {
      if (typeof prototype[name] !== 'function') {
        properties.push(name);
      }
    }
    
    return properties.sort();
  }

  private extractSystemConfig(config: any): Record<string, any> {
    const systemConfig: Record<string, any> = {};
    
    // Common system configuration areas
    const systemKeys = [
      'Actor', 'Item', 'Combat', 'Dice', 'Token', 'ActiveEffect'
    ];
    
    for (const key of systemKeys) {
      if (config[key]) {
        systemConfig[key] = {
          typeLabels: config[key].typeLabels,
          template: config[key].template,
          dataModels: config[key].dataModels ? Object.keys(config[key].dataModels) : undefined
        };
      }
    }
    
    return systemConfig;
  }

  private extractModuleConfig(config: any): Record<string, any> {
    const moduleConfig: Record<string, any> = {};
    
    // Look for module-specific CONFIG additions
    for (const key of Object.keys(config)) {
      if (key.includes('-') || key.includes('_')) {
        // Likely a module key
        moduleConfig[key] = typeof config[key];
      }
    }
    
    return moduleConfig;
  }

  private extractDocumentConfig(config: any): Record<string, any> {
    return {
      documentTypes: Object.keys(config).filter(key => 
        config[key]?.documentClass || config[key]?.typeLabels
      ),
      embeddedDocuments: Object.keys(config).filter(key =>
        config[key]?.embedded || key.includes('Embedded')
      )
    };
  }

  private extractCanvasConfig(config: any): Record<string, any> {
    return {
      layers: config.Canvas?.layers ? Object.keys(config.Canvas.layers) : [],
      lightSources: config.Canvas?.lightSources || [],
      gridTypes: config.Canvas?.gridTypes || []
    };
  }

  private getInheritanceChain(docClass: any): string[] {
    const chain: string[] = [];
    let current = docClass;
    
    while (current && current.name) {
      chain.push(current.name);
      current = Object.getPrototypeOf(current);
      
      // Prevent infinite loops
      if (chain.length > 10) break;
    }
    
    return chain;
  }

  private getMixins(docClass: any): string[] {
    // This is difficult to detect automatically in JavaScript
    // Return common Foundry mixins if detected
    const mixins: string[] = [];
    
    if (Object.prototype.hasOwnProperty.call(docClass.prototype, 'sheet')) {
      mixins.push('SheetMixin');
    }
    if (Object.prototype.hasOwnProperty.call(docClass.prototype, 'testUserPermission')) {
      mixins.push('PermissionMixin');
    }
    
    return mixins;
  }

  private extractDataFields(docClass: any): Record<string, any> {
    const fields: Record<string, any> = {};
    
    if (docClass.defineSchema) {
      try {
        const schema = docClass.defineSchema();
        for (const [key, field] of Object.entries(schema)) {
          fields[key] = {
            type: (field as any).constructor?.name,
            required: (field as any).required,
            initial: (field as any).initial
          };
        }
      } catch {
        // Schema definition might require instantiation
      }
    }
    
    return fields;
  }

  private extractValidationRules(_docClass: any): Record<string, any> {
    // Validation rules are typically embedded in field definitions
    // This would require deeper schema analysis
    return {};
  }

  private extractDefaultValues(docClass: any): Record<string, any> {
    const defaults: Record<string, any> = {};
    
    if (docClass.defaultData) {
      Object.assign(defaults, docClass.defaultData);
    }
    
    return defaults;
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}