# Foundry Familiar

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> ⚠️ **EARLY ALPHA - EXTREMELY LIMITED TESTING** ⚠️
>
> This module is in the very early stages of alpha development with minimal testing.
> **Only tested with Ollama using the qwen3 model so far.**
>
> - Features are incomplete and APIs will change
> - Bugs and breaking changes are expected
> - Other AI services (OpenAI, etc.) are untested
> - Limited compatibility verification
>
> **Do not use this in your active games yet!**

A simple FoundryVTT module that integrates a large language model (LLM) into the game interface, providing a "magical familiar" that can answer questions, summarize content, and assist GMs with campaign management through AI.

## 📚 Documentation

Full documentation will be available at: **[docs.rayners.dev/familiar](https://docs.rayners.dev/familiar)** (coming soon)

## About

Foundry Familiar adds an AI-powered assistant directly into your FoundryVTT interface. The familiar can read your journal entries, answer questions about your campaign, and provide contextual assistance to game masters. It uses OpenAI-compatible API endpoints, making it compatible with local AI models like Ollama as well as cloud services.

## Development Status

This module is in the very early stages of alpha development with minimal testing.

### ⚠️ Testing Limitations

- **Only tested with**: Ollama + qwen3 model
- **Untested**: OpenAI, custom endpoints, other models
- **Compatibility**: Limited verification across different setups

### Current Implementation Status

- [x] Core LLM integration with Ollama/qwen3
- [x] Basic settings configuration dialog
- [x] Simple journal access and summarization
- [ ] Comprehensive testing across AI services
- [ ] OpenAI/cloud service verification
- [ ] Multi-model compatibility testing
- [ ] Advanced tool system
- [ ] UI/UX polish and error handling
- [ ] Production-ready stability

Development is tracked privately but bug reports are welcome via [GitHub Issues](https://github.com/rayners/fvtt-familiar/issues).

## Features

### ✅ Currently Implemented (Limited Testing)

- **LLM Integration**: OpenAI-compatible API support (tested with Ollama/qwen3 only)
- **Basic Settings**: Configuration dialog with connection testing (Ollama-verified)
- **Journal Tools**: Read and summarize journal entries through AI
- **System Agnostic**: Designed to work across game systems (limited verification)
- **Local AI**: Confirmed working with Ollama/qwen3 (cloud services untested)

### 🚧 In Development

- Enhanced tool system for deeper Foundry integration
- Improved UI components and user experience
- Advanced prompt engineering and context management
- Performance optimizations
- Comprehensive error handling

## Architecture

### Core Components

- **TypeScript + Rollup**: Modern build system with type safety
- **Settings Manager**: Centralized configuration with validation
- **Tool System**: Extensible framework for AI-Foundry integration
- **API Layer**: OpenAI-compatible chat completions interface

### Key Functions

- `game.foundryFamiliar.ask()`: Main tool-enhanced interface with journal access
- `game.foundryFamiliar.summon()`: Simple prompt/response interface
- `game.foundryFamiliar.settings()`: Opens settings configuration dialog

## Requirements

- **Foundry VTT**: v13.0.0 or later
- **Game Systems**: Designed to work with any system (limited testing)
- **LLM Service**: OpenAI-compatible API endpoint
  - **Tested**: Ollama with qwen3 model
  - **Untested**: OpenAI, custom endpoints, other models

## Installation

### Manual Installation (Current Method)

1. Download the latest release from [GitHub Releases](https://github.com/rayners/fvtt-familiar/releases)
2. Extract to your Foundry VTT modules directory
3. Restart Foundry VTT
4. Enable the module in your world
5. Configure your LLM endpoint in Module Settings

### Future Installation

Once published to the Foundry package repository:

```
https://github.com/rayners/fvtt-familiar/releases/latest/download/module.json
```

## Configuration

1. **Open Settings**: Game Settings → Configure Settings → Module Settings → Foundry Familiar
2. **Set Endpoint**: Choose from Ollama, Local Proxy, OpenAI, or custom endpoint
3. **Configure Model**: Select or specify your AI model
4. **Test Connection**: Use the built-in connection test to verify setup
5. **Customize Behavior**: Adjust temperature, tokens, and system prompts

## Usage

### Command Line Interface

```javascript
// Enhanced AI with tools (includes journal access)
game.foundryFamiliar.ask('Summarize all journals in this campaign');

// Simple prompt/response
game.foundryFamiliar.summon('Tell me about fantasy tavern names');

// Open settings dialog
game.foundryFamiliar.settings();
```

### Chat Commands

```
/ask <prompt>      # Chat command with tools
/familiar <prompt> # Simple chat command
```

## Contributing

This project follows the standard development practices for FoundryVTT modules:

1. **Setup**: Clone repository and run `npm install`
2. **Development**: Use `npm run build` for builds, `npm run dev` for watching
3. **Testing**: All changes should include appropriate tests
4. **Documentation**: Update documentation for user-facing changes

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development setup and guidelines.

## Support

- **Documentation**: [docs.rayners.dev/familiar](https://docs.rayners.dev/familiar) (coming soon)
- **Bug Reports**: [GitHub Issues](https://github.com/rayners/fvtt-familiar/issues)
- **Discord**: Find @rayners78 in the FoundryVTT Discord

### Supporting Development

Consider supporting continued development:

- **GitHub Sponsors**: [github.com/sponsors/rayners](https://github.com/sponsors/rayners)
- **Patreon**: [patreon.com/rayners](https://patreon.com/rayners)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Foundry VTT Compatibility**: v13+  
**Module Version**: 0.1.0 (Alpha)  
**Last Updated**: December 2024

# Test CI action fix
