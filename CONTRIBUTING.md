# Contributing to Foundry Familiar

Thank you for your interest in contributing to Foundry Familiar! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or later
- **npm**: v8 or later
- **FoundryVTT**: v13+ for testing
- **Git**: For version control

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rayners/fvtt-familiar.git
   cd fvtt-familiar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the module:**
   ```bash
   npm run build
   ```

4. **Link to FoundryVTT (optional):**
   ```bash
   # Create symlink to your Foundry modules directory
   npm run link-module
   ```

### Development Commands

```bash
# Build for development
npm run build

# Build and watch for changes
npm run dev

# Clean build artifacts
npm run clean

# Run tests (when available)
npm test

# Lint code
npm run lint
```

## 📁 Project Structure

```
fvtt-familiar/
├── src/                    # TypeScript source code
│   ├── core/              # Core functionality
│   ├── ui/                # User interface components
│   ├── styles/            # SCSS stylesheets
│   └── module.ts          # Main module entry point
├── templates/             # Handlebars templates
├── languages/             # Localization files
├── dist/                  # Built module (generated)
├── module.json           # Foundry module manifest
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
├── rollup.config.js      # Build configuration
└── vite.config.ts        # Development server config
```

## 🔧 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled, full type safety required
- **ESLint**: Follow the configured linting rules
- **Formatting**: Use consistent indentation and spacing
- **Comments**: Document complex logic and public APIs

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Functions/Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **CSS Classes**: `kebab-case`

### Architecture Principles

1. **System Agnostic**: Code should work across all game systems
2. **Type Safety**: Use TypeScript strictly, avoid `any` types
3. **Error Handling**: Graceful degradation and user-friendly errors
4. **Privacy First**: Support local AI models and minimal data collection
5. **Extensible**: Design for future feature additions

### Module Integration

- **Never use globalThis**: Use standard Foundry patterns instead
- **Use `game.modules.get('familiar').api`**: For module APIs
- **Wrap in try-catch**: Always use optional chaining for safety
- **Respect settings**: Never alter other modules' settings

## 🧪 Testing

### Test Requirements

- Unit tests for core business logic
- Integration tests for Foundry interactions
- Manual testing across different game systems
- Connection testing with various AI services

### Testing Guidelines

- Test both success and failure cases
- Mock external dependencies (AI APIs, Foundry APIs)
- Verify error handling and edge cases
- Test with different browser environments

## 📝 Documentation

### Documentation Standards

- **README.md**: Technical overview for developers
- **README_FOUNDRY.md**: User-focused guide for Foundry users
- **Code Comments**: Document complex logic and APIs
- **Changelog**: Follow semantic versioning and keep detailed logs

### Writing Guidelines

- Use clear, concise language
- Include code examples where helpful
- Be honest about limitations and alpha status
- Avoid overpromising features or compatibility

## 🐛 Bug Reports

### Before Reporting

1. Check existing [GitHub Issues](https://github.com/rayners/fvtt-familiar/issues)
2. Test with the latest version
3. Verify it's not a configuration issue

### Good Bug Reports Include

- **Environment**: Foundry version, browser, operating system
- **Module Version**: Which version of Foundry Familiar
- **Steps to Reproduce**: Clear steps to trigger the bug
- **Expected Behavior**: What should have happened
- **Actual Behavior**: What actually happened
- **Console Logs**: Any error messages or warnings
- **Screenshots**: If UI-related

## ✨ Feature Requests

### Before Requesting

1. Check if the feature already exists
2. Search existing feature requests
3. Consider if it fits the module's scope

### Good Feature Requests Include

- **Use Case**: Why is this feature needed?
- **User Story**: "As a GM, I want to..."
- **Implementation Ideas**: How might this work?
- **Alternatives**: What workarounds exist?

## 🔄 Pull Request Process

### Before Submitting

1. **Fork the repository** and create a feature branch
2. **Test thoroughly** across different scenarios
3. **Update documentation** if needed
4. **Follow code style** guidelines
5. **Write clear commit messages**

### Pull Request Guidelines

- **Title**: Clear, descriptive title
- **Description**: Explain what changes and why
- **Testing**: Describe how you tested the changes
- **Breaking Changes**: Highlight any breaking changes
- **Screenshots**: For UI changes

### Review Process

1. Automated checks must pass
2. Manual testing by maintainers
3. Code review for style and architecture
4. Documentation review
5. Merge when approved

## 🎯 Development Priorities

### Current Focus Areas

1. **Core Stability**: Bug fixes and error handling
2. **User Experience**: UI/UX improvements
3. **Documentation**: Better user guides and examples
4. **Testing**: Comprehensive test coverage
5. **Performance**: Optimization and efficiency

### Future Roadmap

- Enhanced tool system for broader Foundry integration
- Advanced prompt engineering capabilities
- Multi-language localization support
- Additional AI service integrations
- Performance monitoring and analytics

## 📞 Getting Help

### Development Questions

- **GitHub Discussions**: For general questions
- **Discord**: Find @rayners78 in FoundryVTT Discord
- **Email**: For sensitive issues

### Resources

- [FoundryVTT API Documentation](https://foundryvtt.com/api/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)

## 📄 License

By contributing to Foundry Familiar, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Foundry Familiar!** Your help makes this project better for the entire FoundryVTT community.