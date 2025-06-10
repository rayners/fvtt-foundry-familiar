# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Module Overview

Foundry Familiar is a simple FoundryVTT module that integrates a large language model (LLM) into the game interface. It provides a "magical familiar" that can answer questions, summarize content, and assist GMs with campaign management through AI.

## Architecture

### Core Components
- **familiar.js**: Single-file module containing all functionality
- **module.json**: Standard FoundryVTT module manifest
- **LLM Integration**: Uses OpenAI-compatible API endpoints (default: localhost:3000)

### Key Functions
- `game.foundryFamiliar.ask()`: Main tool-enhanced interface with journal access
- `game.foundryFamiliar.summon()`: Simple prompt/response interface
- `game.foundryFamiliar.settings()`: Opens settings configuration dialog

### Tool System
The module implements a simple tool-calling system for LLM access to Foundry data:
- `list_journals()`: Returns available journal entries
- `read_journal(name)`: Reads full journal content
- `search_journals(query)`: Searches journals by content/name

## Development Notes

### LLM Integration Pattern
- Uses OpenAI-compatible chat completions API
- Hardcoded to localhost:3000 endpoint (typical for local proxy)
- Tool calls parsed via regex from LLM responses
- Conversation history maintained for multi-turn interactions

### Foundry Integration
- Registers global `game.foundryFamiliar` API on ready hook
- Uses `game.journal` collection for data access
- Outputs responses via `ChatMessage.create()`
- Strips HTML from journal content for cleaner LLM consumption

### Current Status
- Basic functionality implemented but much code commented out
- Socket handling for multiplayer partially implemented but disabled
- No UI components - purely API-driven
- No configuration system - settings hardcoded

## Common Tasks

### Testing the Module
```javascript
// Test basic functionality
game.foundryFamiliar.summon("Tell me about this world")

// Test tool integration with journal access
game.foundryFamiliar.ask("List all journals in this campaign")

// Test settings dialog
game.foundryFamiliar.settings()
```

### Debugging
- Check browser console for LLM API responses and tool execution logs
- Verify LLM endpoint is accessible at localhost:3000
- Use `game.foundryFamiliar.ask("list journals")` to verify journal access through tools

### Architecture Considerations
- Module is designed to work entirely client-side (no server components)
- Assumes local LLM proxy running on localhost:3000
- Tool system is extensible but currently limited to journal operations
- Error handling is basic - failed API calls return friendly error messages