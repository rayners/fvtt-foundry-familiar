# Foundry Familiar Roadmap

> **Development Status**: This roadmap reflects current planning intentions. Features, timelines, and priorities may change based on user feedback, technical discoveries, and development resources.

## Current Release: v0.1.0 (Alpha)

**Released**: December 2024  
**Focus**: Core LLM integration and basic tool system  
**Testing Status**: Very limited - only tested with Ollama/qwen3

✅ **Completed Features**:
- OpenAI-compatible API integration (tested: Ollama/qwen3, untested: OpenAI/custom)
- Basic journal reading and summarization tools
- Settings configuration dialog with connection testing
- Chat commands and console API access
- System-agnostic design for all FoundryVTT game systems

---

## Planned Development

### v0.2.0 - Entity Creation & Enhanced Tools
**Target**: Q1 2025  
**Theme**: From reading to writing

🎯 **Core Features**:
- **Journal Entry Creation**: AI can create new journal entries based on prompts
  - "Create a journal entry about the tavern the party just discovered"
  - "Write session notes for what happened today"
  - Template-based generation for consistency

- **Extended Tool System**: Support for user-defined AI tools
  - Plugin architecture for custom tool definitions
  - Community tool sharing and distribution
  - Integration with existing module APIs

- **Enhanced Context Management**: 
  - Better prompt engineering with campaign context
  - Selective journal inclusion for focused responses
  - Conversation memory within sessions

🔧 **Technical Improvements**:
- Comprehensive test coverage (unit + integration)
- Performance optimizations for large campaigns
- Better error handling and user feedback
- Code documentation and API stability

### v0.3.0 - Advanced Entity Support
**Target**: Q2 2025  
**Theme**: Expanding creative capabilities

🎯 **Planned Features**:
- **Actor/NPC Creation**: Generate NPCs with stats and descriptions
  - System-specific stat generation (D&D 5e, PF2e, etc.)
  - Portrait and token suggestions
  - Relationship mapping to existing NPCs

- **Scene Enhancement**: AI assistance for scene creation
  - Environmental descriptions
  - Weather and atmosphere generation
  - Points of interest suggestions

- **Advanced Journal Features**:
  - Multi-format output (handouts, letters, maps descriptions)
  - Cross-referencing between journal entries
  - Campaign timeline generation

### v0.4.0 - Workflow Automation
**Target**: Q3 2025  
**Theme**: Intelligent campaign management

🎯 **Envisioned Features**:
- **Session Management**: Automated session prep and cleanup
  - Pre-session briefings based on previous notes
  - Post-session summary generation
  - Plot thread tracking and reminders

- **Campaign Analytics**: Insights into campaign patterns
  - Player engagement tracking
  - Story arc progression analysis
  - NPC interaction frequency

- **Smart Notifications**: Proactive GM assistance
  - Reminder about unresolved plot threads
  - Suggestions for character development opportunities
  - Calendar integration for session planning

### v1.0.0 - Stable Release
**Target**: Late 2025  
**Theme**: Production-ready reliability

🎯 **Release Goals**:
- Feature-complete core functionality
- Comprehensive documentation and tutorials
- Multi-language localization support
- Integration with major FoundryVTT modules
- Performance optimized for large campaigns
- Extensive testing across game systems

---

## Feature Exploration

### Community-Requested Features
*These features depend on user feedback and technical feasibility*

**Module Integration**:
- Simple Calendar integration for date-aware content
- Combat tracking and tactical suggestions
- Inventory management and treasure generation
- Map annotation and location descriptions

**Advanced AI Capabilities**:
- Image generation integration (DALL-E, Stable Diffusion)
- Voice synthesis for NPC dialogue
- Real-time language translation
- Campaign world consistency checking

**Collaboration Features**:
- Player access to familiar (with GM permissions)
- Campaign knowledge sharing between GMs
- Multi-campaign data correlation
- Campaign export/import functionality

### Technical Innovations
*Experimental features that may influence future direction*

**Performance & Scalability**:
- Local embedding models for fast search
- Incremental knowledge base updates
- Campaign data compression and optimization
- Multi-threaded processing for complex queries

**User Experience**:
- Native UI integration beyond dialogs
- Drag-and-drop content generation
- Visual workflow builder for complex prompts
- Mobile-responsive interface design

---

## Development Principles

### Quality Standards
- **Testing First**: No feature ships without comprehensive tests
- **Documentation**: User guides updated with every feature
- **Privacy**: Local AI options always available
- **Performance**: Optimized for real campaign usage

### Community Engagement
- **User Feedback**: Regular surveys and feature request analysis
- **Beta Testing**: Early access program for major features
- **Open Development**: Transparent progress updates and decision rationale
- **Contribution Welcome**: Clear pathways for community code contributions

### Technical Constraints
- **System Agnostic**: Features must work across all FoundryVTT systems
- **Backward Compatibility**: Migration paths for breaking changes
- **Resource Conscious**: Minimal impact on FoundryVTT performance
- **Security First**: Secure handling of AI API credentials and campaign data

---

## Timeline Considerations

### Factors Affecting Development Speed
- **Foundry Updates**: New FoundryVTT versions may require adaptation
- **AI Technology**: Rapid changes in AI capabilities and APIs
- **User Adoption**: Feature prioritization based on actual usage patterns
- **Technical Discoveries**: Complex integrations may take longer than expected

### Release Philosophy
- **Alpha Releases**: Monthly feature additions with breaking changes possible
- **Beta Releases**: Quarterly stable builds for wider testing
- **Major Versions**: Annual releases with comprehensive feature sets
- **Patch Releases**: As needed for critical bugs and security issues

---

## Getting Involved

### How You Can Influence This Roadmap

**Feedback Channels**:
- [GitHub Issues](https://github.com/rayners/fvtt-familiar/issues) for feature requests
- [Discord](https://discord.gg/foundryvtt) (@rayners78) for real-time discussion
- [Patreon](https://patreon.com/rayners) for development support and early access

**What Helps Most**:
- **Specific Use Cases**: "I want to do X with my Y campaign"
- **Workflow Descriptions**: How you currently manage campaigns
- **Integration Needs**: Which other modules you use
- **Technical Constraints**: Your setup limitations (local vs cloud AI, etc.)

**Beta Testing**:
- Early access to new features for feedback
- Testing across different game systems and setups
- Documentation review and improvement suggestions

---

**Last Updated**: December 2024  
**Next Review**: March 2025

*This roadmap is a living document. Features, timelines, and priorities will evolve based on user needs, technical feasibility, and development resources.*