# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Module Overview

Foundry Familiar is a Foundry VTT module that provides an AI-powered "magical familiar" assistant. The module is written in TypeScript and bundles through Rollup into `dist/module.js`.

- Entry point: `src/module.ts` wires up Hooks, registers settings, exposes the `game.foundryFamiliar` API, and binds chat commands.
- Core services live under `src/core/` and are composed through the `FamiliarManager` class.
- UI assets (settings dialog template + SCSS) are located in `templates/` and `src/styles/`.

## Architecture Snapshot

### Core Services

- **FamiliarManager** (`src/core/familiar-manager.ts`)
  - Bridges the Foundry chat commands and exposed API to the LLM + tool subsystems.
  - Filters `<think>` tags, converts Markdown responses to HTML via `micromark`, and posts chat messages.
  - Coordinates iterative tool usage (up to 5 loops) while logging when console logging is enabled.

- **LLMService** (`src/core/llm-service.ts`)
  - Wraps `fetch` calls to OpenAI-compatible `/chat/completions` endpoints.
  - Inserts API key headers when configured and surfaces detailed error messages.
  - Handles abort signalling for connection tests in the settings dialog.

- **ToolSystem** (`src/core/tool-system.ts`)
  - Provides structured tool handlers (`list_collection`, `get_collection_member`, `search_collection`, `list_by_folder`, etc.).
  - Uses `CollectionAnalyzer` and `DataModelAnalyzer` helpers to inspect Foundry collections, folders, and document metadata.
  - Returns combined results that include an LLM-oriented format plus a user-facing view for console logging.

### Settings and UI

- **SettingsManager** (`src/settings.ts`)
  - Registers hidden world-scope settings for endpoint, API key, model, temperature, max tokens, system prompt, logging toggles, and familiar personalization.
  - Exposes strongly typed getters/setters used throughout the module.

- **FamiliarSettingsDialog** (`src/ui/settings-dialog.ts` + `templates/settings-dialog.hbs`)
  - Custom FormApplication providing tabbed configuration, connection testing, and preset endpoints/models.
  - Calls `LLMService.testConnection` and persists settings via `SettingsManager`.

### Foundry Integration

- Hooks registered in `src/module.ts` expose `game.foundryFamiliar` with `ask`, `summon`, and `settings` methods and register `/ask` + `/familiar` chat commands.
- Chat messages render the familiar response with configured name/icon and Markdown-rendered content.
- Tool execution triggers browser notifications and console diagnostics when enabled.

## Development Context

For shared development standards and architectural references, consult the Development Context repository checked out at `./dev-context/`:

- [Development Context Reference](dev-context/README.md)
- Development workflow: [dev-context/foundry-development-practices.md](dev-context/foundry-development-practices.md)
- Testing standards: [dev-context/testing-practices.md](dev-context/testing-practices.md)
- Architecture patterns: [dev-context/module-architecture-patterns.md](dev-context/module-architecture-patterns.md)
- Documentation standards: [dev-context/documentation-standards.md](dev-context/documentation-standards.md)

Review `dev-context/ai-code-access-restrictions.md` before working with any proprietary Foundry content.

## Common Tasks

### Installing Dependencies

```bash
npm install
```

### Quality Pipeline

Run the full validation stack (lint, format check, type check, tests, build):

```bash
npm run validate
```

Individual tasks:

- Lint: `npm run lint`
- Format check: `npm run format:check`
- Type check: `npm run typecheck`
- Unit tests (Vitest + jsdom): `npm run test:run`
- Production build: `npm run build`

### Local Development

- `npm run dev` / `npm run build:watch` – Rollup watcher that rebuilds `dist/`.
- Link into a Foundry data directory using scripts in `package.json` (`npm run link-node`, `npm run link-electron`, or `npm run link-copy`).

### Manual Testing in Foundry

1. Install the module into a Foundry world and ensure the configured endpoint is reachable.
2. Use `/familiar <prompt>` for simple completions.
3. Use `/ask <prompt>` to exercise the tool loop—watch the browser console for detailed traces.
4. Open the Familiar configuration dialog via `game.foundryFamiliar.settings()` to adjust endpoint/model, toggle tool usage, and test connectivity.

## Debugging Tips

- Enable "Console Logging" in the Familiar settings dialog to inspect LLM payloads, tool calls, and results.
- Tool results include both LLM-formatted and user-facing blocks—only the user view should be surfaced to players.
- Connection tests in the settings dialog will warn if the endpoint rejects credentials, timeouts, or returns non-2xx responses.

## Release Notes

- `module.json` controls Foundry metadata, compatibility, and manifest URLs. Update before packaging releases.
- `ROLLUP` build outputs to `dist/`; ensure the folder is regenerated (`npm run build`) before distributing the module.

