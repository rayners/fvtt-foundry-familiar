/**
 * Tests for ToolSystem
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ToolSystem } from '../../src/core/tool-system';

describe('ToolSystem', () => {
  let toolSystem: ToolSystem;

  beforeEach(() => {
    toolSystem = new ToolSystem();
  });

  describe('executeTool', () => {
    it('should execute list_collection_types tool', async () => {
      const result = await toolSystem.executeTool('list_collection_types', '');

      expect(result).toContain('Available collection types:');
      expect(result).toContain('journals');
      expect(result).toContain('actors');
      expect(result).toContain('items');
    });

    it('should execute list_collection tool', async () => {
      const result = await toolSystem.executeTool('list_collection', 'journals');

      expect(result).toContain('Test Journal');
    });

    it('should execute search_collection tool', async () => {
      const result = await toolSystem.executeTool('search_collection', 'journals,test');

      expect(result).toContain('Test Journal');
    });

    it('should handle unknown tool', async () => {
      await expect(toolSystem.executeTool('unknown_tool', 'params')).rejects.toThrow(
        'Unknown tool: unknown_tool'
      );
    });

    it('should handle tool errors gracefully', async () => {
      const result = await toolSystem.executeTool('list_collection', 'nonexistent_type');

      expect(result).toContain('Unknown collection type');
      expect(result).toContain('Available types');
    });
  });

  describe('getAvailableTools', () => {
    it('should return list of available tools', () => {
      const tools = toolSystem.getAvailableTools();

      expect(tools.length).toBeGreaterThan(0);

      // Check for generic collection tools
      const collectionTools = tools.filter(
        t => t.name.includes('collection') || t.name.includes('analyze')
      );
      expect(collectionTools.length).toBeGreaterThan(0);

      // Ensure no legacy journal tools
      const journalTools = tools.filter(
        t => t.name === 'list_journals' || t.name === 'read_journal' || t.name === 'search_journals'
      );
      expect(journalTools).toHaveLength(0);
    });
  });

  describe('tool integration', () => {
    it('should format collection listing output correctly', async () => {
      const result = await toolSystem.executeTool('list_collection', 'journals');

      expect(result).toContain('RESULT: list_collection');
      expect(result).toContain('COUNT:');
      expect(result).toContain('ENTRIES:');
    });

    it('should handle empty search results', async () => {
      const result = await toolSystem.executeTool('search_collection', 'journals,nonexistent');

      expect(result).toContain('No journals found matching');
    });

    it('should handle collection type listing', async () => {
      const result = await toolSystem.executeTool('list_collection_types', '');

      expect(result).toContain('Available collection types:');
      expect(result).toContain('journals');
    });
  });
});
