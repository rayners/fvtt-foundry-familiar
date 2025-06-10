# 🧙 Foundry Familiar

**An AI-powered magical assistant for your FoundryVTT campaigns**

Foundry Familiar brings the power of artificial intelligence directly into your FoundryVTT interface. Like a magical familiar that has read all your campaign notes, this AI assistant can answer questions about your world, summarize journal entries, and help you manage your campaign more effectively.

Imagine having a tireless assistant who has memorized every detail of your campaign world. Foundry Familiar uses advanced AI technology to provide exactly that - an intelligent companion that can read your journals, answer questions about your NPCs, summarize plot threads, and help you stay organized as a Game Master.

[![Support on Patreon](https://img.shields.io/badge/Patreon-Support%20Development-ff424d?style=flat-square&logo=patreon)](https://patreon.com/rayners)

> ⚠️ **EARLY ALPHA - VERY LIMITED TESTING** ⚠️
>
> This module is in the very early stages of development with minimal testing.
> **Only tested with Ollama using the qwen3 model so far.**
> Other AI services (OpenAI, etc.) are completely untested.
>
> **Not recommended for any games - use at your own risk!**

---

**Perfect for Game Masters who want to:**

- ✅ **Quick Reference**: Ask questions about your campaign without digging through notes
- ✅ **Session Prep**: Get AI-generated summaries of previous sessions or story arcs
- ✅ **Creative Assistance**: Brainstorm ideas with an AI that knows your world
- ✅ **Campaign Management**: Keep track of complex storylines and character relationships

**Key Benefits:**

- 🎯 **Context-Aware**: The AI reads your actual journal entries and world content
- 🔄 **System Agnostic**: Works with any game system in FoundryVTT
- 🏠 **Privacy Options**: Use local AI models or cloud services - your choice
- ⚡ **Instant Access**: Available directly in your FoundryVTT interface

---

## 📦 Installation

### Step 1: Install the Module

**Option A: Manual Installation (Current)**

1. Download the latest release from [GitHub](https://github.com/rayners/fvtt-familiar/releases)
2. Extract the ZIP file to your FoundryVTT modules directory
3. Restart FoundryVTT

**Option B: Foundry Package Manager (Coming Soon)**

1. Open the Add-on Modules tab in your Foundry setup
2. Click "Install Module"
3. Search for "Foundry Familiar"
4. Click Install

### Step 2: Enable the Module

1. In your world, go to **Settings** → **Manage Modules**
2. Find "Foundry Familiar" and check the box to enable it
3. Click **Save Module Settings**

### Step 3: Configure Your AI Service

1. Go to **Game Settings** → **Configure Settings** → **Module Settings**
2. Find "Foundry Familiar" and click **Configure Familiar**
3. Choose your AI service:
   - **Ollama (Local)**: Free, private, runs on your computer
   - **OpenAI**: Cloud service, requires API key and credits
   - **Local Proxy**: For advanced users with custom setups
   - **Custom Endpoint**: For other OpenAI-compatible services

---

## ⚙️ Configuration

### Choosing Your AI Service

**🏠 Ollama (Only Tested Option)**

- **Testing Status**: ✅ Confirmed working with qwen3 model
- **Pros**: Free, private, no data leaves your computer
- **Cons**: Requires technical setup, uses computer resources
- **Setup**: Install [Ollama](https://ollama.com) and download the qwen3 model
- **Recommended**: This is currently the only verified configuration

**⚠️ OpenAI (UNTESTED)**

- **Testing Status**: ❌ No testing performed yet
- **Risk**: May not work properly or at all
- **Setup**: Get an API key from [OpenAI](https://platform.openai.com)
- **Warning**: Use at your own risk - functionality not verified

### Basic Configuration

1. **Select Endpoint**: Choose your AI service from the dropdown
2. **Set Model**: Pick an AI model (qwen3 tested for Ollama, others untested)
3. **Add API Key**: Only needed for cloud services like OpenAI
4. **Test Connection**: Click the test button to verify everything works
5. **Customize Behavior**:
   - **Temperature**: Controls creativity (0.1 = focused, 1.0 = creative)
   - **Max Tokens**: Maximum response length
   - **System Prompt**: Instructions for how the AI should behave

---

## 💡 How to Use

### Quick Commands

**In JavaScript Console:**

```javascript
// Ask a question with full access to your journals
game.foundryFamiliar.ask('What happened in the last session?');

// Simple question without journal access
game.foundryFamiliar.summon('Give me some tavern names');

// Open settings configuration
game.foundryFamiliar.settings();
```

**In Chat:**

```
/ask Who is the mayor of Waterdeep in my campaign?
/familiar Generate 5 random NPC names
```

### Practical Examples

**Session Preparation:**

- "List all journals and summarize what the party learned about the dragon cult"
- "What NPCs did the party meet in the last three sessions?"
- "Search through my journals for unresolved plot threads"

**During Play:**

- "Find information about Lord Blackwood in my journals"
- "Search my session notes for tavern names"
- "Look through recent journals and tell me the party's current objectives"

**Creative Assistance:**

- "Generate some complications for traveling through the Whispering Woods"
- "What would a typical day look like in the mining town of Rockfall?"
- "Create a short description of a mysterious magical artifact"

---

## 🔧 Troubleshooting

### Connection Issues

**Problem**: "Connection failed" error

- **Check**: Is your AI service running? (For Ollama, check if it's started)
- **Verify**: Are the endpoint URL and model name correct?
- **Test**: Try the built-in connection test in settings

**Problem**: "Model not found" error

- **Ollama**: Run `ollama pull qwen3` to download the tested model
- **OpenAI**: Untested - functionality not verified

### Performance Issues

**Problem**: Responses are slow

- **Local AI**: This is normal - local models are slower but private
- **Cloud AI**: Check your internet connection
- **Large Responses**: Reduce the "Max Tokens" setting

**Problem**: AI responses seem off-topic

- **Solution**: Adjust the system prompt to be more specific
- **Tips**: Include context like "You are assisting with a D&D campaign"

### Feature Requests

This module is in active development. If you have ideas for improvements:

1. Check existing [GitHub Issues](https://github.com/rayners/fvtt-familiar/issues)
2. Create a new issue with the "enhancement" label
3. Describe your use case and how it would help your games

---

## 🎮 Privacy & Safety

- **Local Models**: When using Ollama, your data never leaves your computer
- **Cloud Services**: OpenAI and similar services will process your campaign data
- **No Tracking**: This module doesn't collect analytics or usage data
- **Your Control**: You can disable the module or change AI services anytime

---

## 📞 Support

### Getting Help

- **Documentation**: [Complete Documentation](https://docs.rayners.dev/familiar) (coming soon)
- **Issues**: [GitHub Issues](https://github.com/rayners/fvtt-familiar/issues)
- **Discord**: Find @rayners78 in the FoundryVTT Discord

### Supporting Development

If Foundry Familiar helps your games, consider supporting its development:

- **Patreon**: [patreon.com/rayners](https://patreon.com/rayners)
- **GitHub Sponsors**: [github.com/sponsors/rayners](https://github.com/sponsors/rayners)

Your support helps fund continued development and new features!

---

**Last Updated:** December 2024  
**Module Version:** 0.1.0 (Alpha)  
**Foundry Compatibility:** v13+  
**License:** MIT

_Foundry Familiar is not affiliated with Foundry Gaming LLC._
