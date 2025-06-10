# Changelog

> **Development Status**: Foundry Familiar is in active development. Breaking changes may occur between versions until v1.0 release.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Documentation improvements and user guides
- Enhanced error handling and validation

### Changed

- Improved settings dialog user experience
- Better visual design for reference section

### Fixed

- Dropdown text alignment issues in settings dialog
- Connection test functionality improvements

## [0.1.0] - 2024-12-09

### Added

- **Initial early alpha release - very limited testing**
- Core LLM integration with OpenAI-compatible APIs
- Support for AI services (testing status):
  - Ollama (✅ tested with qwen3 model)
  - OpenAI (❌ untested)
  - Custom endpoints (❌ untested)
- Comprehensive settings configuration dialog with:
  - Connection testing functionality
  - Endpoint and model selection
  - Temperature and token limit controls
  - System prompt customization
  - Familiar name and icon personalization
- Journal access tools for AI context:
  - `game.familiar.ask()` - Enhanced AI with journal tools
  - `game.familiar.summon()` - Simple prompt/response
  - `game.familiar.summarizeJournal()` - Direct journal summarization
  - `game.familiar.listJournals()` - Journal discovery
- Chat commands:
  - `/ask <prompt>` - AI with tools
  - `/familiar <prompt>` - Simple AI chat
- System-agnostic design compatible with all FoundryVTT game systems
- TypeScript codebase with modern build system
- Debug logging and console output options
- Privacy-first design with local AI model support

### Technical Features

- OpenAI-compatible chat completions API integration
- Extensible tool system for Foundry data access
- Centralized settings management with validation
- Modern FormApplication-based settings dialog
- Responsive UI design with proper accessibility
- Error handling and connection validation
- Module API for programmatic access

---

## Development Notes

### Alpha Release Focus

This initial release establishes the core foundation:

- Reliable LLM integration across multiple services
- Intuitive configuration interface
- Basic tool system for journal access
- Clean, extensible architecture for future features

### Known Limitations

- **Very limited testing**: Only tested with Ollama/qwen3 combination
- **Untested configurations**: OpenAI, custom endpoints, other models
- UI components are functional but not yet polished
- Tool system is basic (journal access only)
- No multi-language support yet
- Limited error recovery options
- Testing coverage is incomplete

### Upcoming Features

Future releases will focus on:

- Enhanced tool system with broader Foundry integration
- Improved UI/UX with better visual design
- Advanced prompt engineering and context management
- Performance optimizations
- Comprehensive testing and bug fixes
- Multi-language localization support

---

_For detailed development history and technical decisions, see the development documentation._
