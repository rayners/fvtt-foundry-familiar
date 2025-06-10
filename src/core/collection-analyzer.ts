/**
 * Generic collection analysis for all Foundry document types
 * Handles journals, scenes, actors, items, playlists, tables, macros, etc.
 */

export class CollectionAnalyzer {
  /**
   * Map collection type strings to actual game collections
   */
  private getCollection(type: string): Collection<any> | undefined {
    const collectionMap: Record<string, Collection<any>> = {
      'journals': game.journal,
      'scenes': game.scenes,
      'actors': game.actors,
      'items': game.items,
      'playlists': game.playlists,
      'tables': game.tables,
      'macros': game.macros,
      'cards': game.cards,
      'folders': game.folders
    };

    return collectionMap[type.toLowerCase()];
  }

  /**
   * List all available collection types
   */
  getAvailableCollectionTypes(): string[] {
    return [
      'journals', 'scenes', 'actors', 'items', 
      'playlists', 'tables', 'macros', 'cards', 'folders'
    ];
  }

  /**
   * List all entries in a collection with id, name, and folder
   */
  listCollection(type: string): Array<{
    id: string;
    name: string;
    folder?: string;
    type: string;
    metadata?: Record<string, any>;
  }> {
    const collection = this.getCollection(type);
    if (!collection) {
      throw new Error(`Unknown collection type: ${type}. Available types: ${this.getAvailableCollectionTypes().join(', ')}`);
    }

    return Array.from(collection).map(entry => {
      const baseInfo = {
        id: entry.id,
        name: entry.name || entry.title || `Unnamed ${type}`,
        folder: entry.folder?.name,
        type: type
      };

      // Add type-specific metadata
      const metadata = this.getEntryMetadata(entry, type);
      
      return {
        ...baseInfo,
        ...(Object.keys(metadata).length > 0 && { metadata })
      };
    });
  }

  /**
   * Get a specific collection member by ID
   */
  getCollectionMember(type: string, id: string): {
    id: string;
    name: string;
    folder?: string;
    type: string;
    content: string;
    metadata: Record<string, any>;
  } {
    const collection = this.getCollection(type);
    if (!collection) {
      throw new Error(`Unknown collection type: ${type}. Available types: ${this.getAvailableCollectionTypes().join(', ')}`);
    }

    const entry = collection.get(id);
    if (!entry) {
      throw new Error(`No ${type} found with ID: ${id}`);
    }

    const content = this.extractContent(entry, type);
    const metadata = this.getEntryMetadata(entry, type);

    return {
      id: entry.id,
      name: entry.name || entry.title || `Unnamed ${type}`,
      folder: entry.folder?.name,
      type: type,
      content,
      metadata
    };
  }

  /**
   * Search collections by name or content
   */
  searchCollection(type: string, query: string): Array<{
    id: string;
    name: string;
    folder?: string;
    type: string;
    content: string;
    relevance: 'name' | 'content';
  }> {
    const collection = this.getCollection(type);
    if (!collection) {
      throw new Error(`Unknown collection type: ${type}. Available types: ${this.getAvailableCollectionTypes().join(', ')}`);
    }

    const searchQuery = query.toLowerCase();
    const results: Array<{
      id: string;
      name: string;
      folder?: string;
      type: string;
      content: string;
      relevance: 'name' | 'content';
    }> = [];

    for (const entry of collection) {
      const name = entry.name || entry.title || '';
      let relevance: 'name' | 'content' | null = null;
      
      // Check name match first (higher priority)
      if (name.toLowerCase().includes(searchQuery)) {
        relevance = 'name';
      } else {
        // Check content match
        const content = this.extractContent(entry, type);
        if (content.toLowerCase().includes(searchQuery)) {
          relevance = 'content';
        }
      }

      if (relevance) {
        const content = this.extractContent(entry, type);
        results.push({
          id: entry.id,
          name,
          folder: entry.folder?.name,
          type: type,
          content: content.length > 300 ? content.substring(0, 300) + '...' : content,
          relevance
        });
      }
    }

    // Sort by relevance (name matches first)
    return results.sort((a, b) => {
      if (a.relevance === 'name' && b.relevance === 'content') return -1;
      if (a.relevance === 'content' && b.relevance === 'name') return 1;
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Extract content from different document types
   */
  private extractContent(entry: any, type: string): string {
    switch (type.toLowerCase()) {
      case 'journals':
        return this.extractJournalContent(entry);
      
      case 'scenes':
        return this.extractSceneContent(entry);
      
      case 'actors':
        return this.extractActorContent(entry);
      
      case 'items':
        return this.extractItemContent(entry);
      
      case 'playlists':
        return this.extractPlaylistContent(entry);
      
      case 'tables':
        return this.extractTableContent(entry);
      
      case 'macros':
        return this.extractMacroContent(entry);
      
      case 'cards':
        return this.extractCardContent(entry);
      
      case 'folders':
        return this.extractFolderContent(entry);
      
      default:
        return 'Content extraction not implemented for this type';
    }
  }

  /**
   * Get type-specific metadata
   */
  private getEntryMetadata(entry: any, type: string): Record<string, any> {
    const baseMetadata: Record<string, any> = {};

    switch (type.toLowerCase()) {
      case 'journals':
        baseMetadata.pageCount = entry.pages?.size || 0;
        break;
      
      case 'scenes':
        baseMetadata.active = entry.active;
        baseMetadata.navigation = entry.navigation;
        baseMetadata.tokenCount = entry.tokens?.size || 0;
        break;
      
      case 'actors':
        baseMetadata.actorType = entry.type;
        baseMetadata.system = entry.system?.constructor?.name;
        break;
      
      case 'items':
        baseMetadata.itemType = entry.type;
        baseMetadata.system = entry.system?.constructor?.name;
        break;
      
      case 'playlists':
        baseMetadata.soundCount = entry.sounds?.size || 0;
        baseMetadata.playing = entry.playing;
        break;
      
      case 'tables':
        baseMetadata.resultCount = entry.results?.size || 0;
        baseMetadata.formula = entry.formula;
        break;
      
      case 'macros':
        baseMetadata.macroType = entry.type;
        baseMetadata.scope = entry.scope;
        break;
    }

    return baseMetadata;
  }

  /**
   * Extract journal content (existing logic)
   */
  private extractJournalContent(entry: any): string {
    const allText: string[] = [];
    
    if (entry.pages) {
      for (const page of entry.pages) {
        if (page.type === 'text' && page.text?.content) {
          const cleanText = page.text.content.replace(/<[^>]*>/g, '').trim();
          if (cleanText) {
            allText.push(`Page: ${page.name}\n${cleanText}`);
          }
        }
      }
    }
    
    return allText.join('\n\n') || 'No readable content found';
  }

  /**
   * Extract scene content
   */
  private extractSceneContent(entry: any): string {
    const parts: string[] = [];
    
    if (entry.background?.src) {
      parts.push(`Background: ${entry.background.src}`);
    }
    
    if (entry.foreground?.src) {
      parts.push(`Foreground: ${entry.foreground.src}`);
    }
    
    if (entry.tokens?.size > 0) {
      parts.push(`Tokens: ${entry.tokens.size} tokens placed`);
    }
    
    if (entry.notes?.size > 0) {
      parts.push(`Journal Notes: ${entry.notes.size} notes`);
    }
    
    if (entry.lights?.size > 0) {
      parts.push(`Lighting: ${entry.lights.size} light sources`);
    }
    
    return parts.length > 0 ? parts.join('\n') : 'Empty scene';
  }

  /**
   * Extract actor content
   */
  private extractActorContent(entry: any): string {
    const parts: string[] = [];
    
    parts.push(`Type: ${entry.type}`);
    
    if (entry.system) {
      // Try to extract common attributes
      const system = entry.system;
      if (system.details?.biography?.value) {
        const cleanBio = system.details.biography.value.replace(/<[^>]*>/g, '').trim();
        parts.push(`Biography: ${cleanBio}`);
      }
      
      if (system.attributes?.hp) {
        parts.push(`HP: ${system.attributes.hp.value}/${system.attributes.hp.max}`);
      }
    }
    
    if (entry.items?.size > 0) {
      parts.push(`Items: ${entry.items.size} items`);
    }
    
    return parts.join('\n') || 'No detailed information available';
  }

  /**
   * Extract item content
   */
  private extractItemContent(entry: any): string {
    const parts: string[] = [];
    
    parts.push(`Type: ${entry.type}`);
    
    if (entry.system?.description?.value) {
      const cleanDesc = entry.system.description.value.replace(/<[^>]*>/g, '').trim();
      parts.push(`Description: ${cleanDesc}`);
    }
    
    if (entry.system?.quantity !== undefined) {
      parts.push(`Quantity: ${entry.system.quantity}`);
    }
    
    if (entry.system?.price !== undefined) {
      parts.push(`Price: ${entry.system.price}`);
    }
    
    return parts.join('\n') || 'No detailed information available';
  }

  /**
   * Extract playlist content
   */
  private extractPlaylistContent(entry: any): string {
    const parts: string[] = [];
    
    if (entry.sounds?.size > 0) {
      parts.push(`Sounds: ${entry.sounds.size} tracks`);
      const soundList = Array.from(entry.sounds).map((sound: any) => sound.name).slice(0, 5);
      parts.push(`Tracks: ${soundList.join(', ')}${entry.sounds.size > 5 ? '...' : ''}`);
    }
    
    if (entry.mode !== undefined) {
      parts.push(`Mode: ${entry.mode === 0 ? 'Sequential' : 'Shuffle'}`);
    }
    
    return parts.join('\n') || 'Empty playlist';
  }

  /**
   * Extract table content
   */
  private extractTableContent(entry: any): string {
    const parts: string[] = [];
    
    if (entry.formula) {
      parts.push(`Formula: ${entry.formula}`);
    }
    
    if (entry.results?.size > 0) {
      parts.push(`Results: ${entry.results.size} entries`);
      const resultList = Array.from(entry.results).slice(0, 3).map((result: any) => 
        `${result.range}: ${result.text}`
      );
      parts.push(resultList.join('\n'));
      if (entry.results.size > 3) {
        parts.push('...');
      }
    }
    
    return parts.join('\n') || 'Empty table';
  }

  /**
   * Extract macro content
   */
  private extractMacroContent(entry: any): string {
    const parts: string[] = [];
    
    parts.push(`Type: ${entry.type}`);
    parts.push(`Scope: ${entry.scope}`);
    
    if (entry.command) {
      const command = entry.command.length > 200 ? 
        entry.command.substring(0, 200) + '...' : 
        entry.command;
      parts.push(`Command:\n${command}`);
    }
    
    return parts.join('\n') || 'Empty macro';
  }

  /**
   * Extract card content
   */
  private extractCardContent(entry: any): string {
    const parts: string[] = [];
    
    if (entry.cards?.size > 0) {
      parts.push(`Cards: ${entry.cards.size} cards`);
    }
    
    if (entry.type) {
      parts.push(`Type: ${entry.type}`);
    }
    
    return parts.join('\n') || 'Empty card deck';
  }

  /**
   * Extract folder content
   */
  private extractFolderContent(entry: any): string {
    const parts: string[] = [];
    
    parts.push(`Type: ${entry.type}`);
    
    if (entry.contents?.size > 0) {
      parts.push(`Contents: ${entry.contents.size} items`);
    }
    
    if (entry.children?.size > 0) {
      parts.push(`Subfolders: ${entry.children.size} folders`);
    }
    
    return parts.join('\n') || 'Empty folder';
  }
}