/**
 * Tests for CollectionAnalyzer
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CollectionAnalyzer } from '../../src/core/collection-analyzer';
import { MockCollection } from '../setup';

describe('CollectionAnalyzer', () => {
  let analyzer: CollectionAnalyzer;

  beforeEach(() => {
    analyzer = new CollectionAnalyzer();

    // Setup mock collections
    const mockActors = new MockCollection<any>();
    mockActors.set('actor1', {
      id: 'actor1',
      name: 'Red Dragon',
      type: 'npc',
      system: {
        attributes: { hp: { value: 100, max: 100 } },
        details: { biography: { value: '<p>A fearsome red dragon</p>' } },
      },
      folder: { name: 'Dragons' },
    });

    const mockScenes = new MockCollection<any>();
    mockScenes.set('scene1', {
      id: 'scene1',
      name: 'Dragon Lair',
      active: true,
      background: { src: 'dragon-lair.jpg' },
      tokens: new MockCollection(),
      folder: undefined,
    });

    // Mock the game collections
    (global as any).game.actors = mockActors;
    (global as any).game.scenes = mockScenes;
  });

  describe('getAvailableCollectionTypes', () => {
    it('should return list of available collection types', () => {
      const types = analyzer.getAvailableCollectionTypes();

      expect(types).toContain('journals');
      expect(types).toContain('scenes');
      expect(types).toContain('actors');
      expect(types).toContain('items');
      expect(types.length).toBeGreaterThan(5);
    });
  });

  describe('listCollection', () => {
    it('should list actors with metadata', () => {
      const result = analyzer.listCollection('actors');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'actor1',
        name: 'Red Dragon',
        folder: 'Dragons',
        type: 'actors',
        metadata: {
          actorType: 'npc',
        },
      });
    });

    it('should list scenes with metadata', () => {
      const result = analyzer.listCollection('scenes');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'scene1',
        name: 'Dragon Lair',
        type: 'scenes',
        metadata: {
          active: true,
          tokenCount: 0,
        },
      });
    });

    it('should throw error for unknown collection type', () => {
      expect(() => analyzer.listCollection('unknown')).toThrow('Unknown collection type: unknown');
    });
  });

  describe('getCollectionMember', () => {
    it('should get actor details', () => {
      const result = analyzer.getCollectionMember('actors', 'actor1');

      expect(result).toMatchObject({
        id: 'actor1',
        name: 'Red Dragon',
        folder: 'Dragons',
        type: 'actors',
      });
      expect(result.content).toContain('Type: npc');
      expect(result.content).toContain('HP: 100/100');
      expect(result.content).toContain('Biography: A fearsome red dragon');
    });

    it('should throw error for non-existent member', () => {
      expect(() => analyzer.getCollectionMember('actors', 'nonexistent')).toThrow(
        'No actors found with ID: nonexistent'
      );
    });

    it('should throw error for unknown collection type', () => {
      expect(() => analyzer.getCollectionMember('unknown', 'id')).toThrow(
        'Unknown collection type: unknown'
      );
    });
  });

  describe('searchCollection', () => {
    it('should find actors by name', () => {
      const results = analyzer.searchCollection('actors', 'dragon');

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        id: 'actor1',
        name: 'Red Dragon',
        relevance: 'name',
      });
    });

    it('should find actors by content', () => {
      const results = analyzer.searchCollection('actors', 'fearsome');

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        id: 'actor1',
        name: 'Red Dragon',
        relevance: 'content',
      });
    });

    it('should return empty array for no matches', () => {
      const results = analyzer.searchCollection('actors', 'nonexistent');

      expect(results).toHaveLength(0);
    });

    it('should prioritize name matches over content matches', () => {
      // Add another actor that matches in content only
      const mockActors = game.actors as MockCollection<any>;
      mockActors.set('actor2', {
        id: 'actor2',
        name: 'Blue Drake',
        type: 'npc',
        system: {
          details: { biography: { value: 'This drake fears red dragons' } },
        },
      });

      const results = analyzer.searchCollection('actors', 'red');

      expect(results).toHaveLength(2);
      expect(results[0].relevance).toBe('name'); // Red Dragon (name match)
      expect(results[1].relevance).toBe('content'); // Blue Drake (content match)
    });
  });
});
