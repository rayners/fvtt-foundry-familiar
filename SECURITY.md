# Security Policy

## Supported Versions

Foundry Familiar is currently in alpha development. Security updates will be provided for:

| Version | Supported         |
| ------- | ----------------- |
| 0.1.x   | ✅ Active support |
| < 0.1   | ❌ Not supported  |

## Reporting a Vulnerability

### Security Contact

If you discover a security vulnerability in Foundry Familiar, please report it responsibly:

- **Email**: [rayners@example.com](mailto:rayners@example.com)
- **Subject**: "SECURITY: Foundry Familiar Vulnerability Report"
- **Response Time**: 48-72 hours

### Please Do Not

- Open public GitHub issues for security vulnerabilities
- Discuss vulnerabilities in public forums or Discord
- Test vulnerabilities on systems you don't own

### What to Include

1. **Description**: Clear description of the vulnerability
2. **Impact**: What could an attacker accomplish?
3. **Reproduction**: Steps to reproduce the issue
4. **Environment**: Foundry version, browser, operating system
5. **Proof of Concept**: Code or screenshots (if safe to share)

## Security Considerations

### Data Privacy

**Local AI Models (Ollama)**

- ✅ All data stays on your computer
- ✅ No external data transmission
- ✅ Full user control over AI processing

**Cloud AI Services (OpenAI, etc.)**

- ⚠️ Campaign data sent to third-party services
- ⚠️ Subject to provider's privacy policies
- ⚠️ May be logged or used for service improvement

**Module Data Collection**

- ✅ No analytics or telemetry collected
- ✅ No user tracking or identification
- ✅ No automatic data transmission

### API Key Security

**Best Practices**

- Store API keys securely in Foundry's settings system
- Never commit API keys to version control
- Use environment variables for development
- Regularly rotate API keys
- Monitor API usage for anomalies

**Module Implementation**

- API keys stored in Foundry's encrypted settings
- Keys not logged or transmitted to unauthorized services
- Settings marked as "restricted" (GM-only access)

### Network Security

**HTTPS Enforcement**

- All cloud API communications use HTTPS
- Certificate validation enforced
- No fallback to insecure protocols

**Local Development**

- Local AI services may use HTTP (localhost only)
- No external access to local development servers
- Clear warnings about development vs. production setups

### Input Validation

**User Input**

- All user prompts sanitized before AI transmission
- Maximum length limits enforced
- Injection attack prevention measures

**API Responses**

- AI responses filtered and validated
- HTML/script injection prevention
- Safe rendering in Foundry interface

### Access Control

**Module Permissions**

- Settings require GM permissions
- API access restricted to authorized users
- Clear permission boundaries enforced

**Game System Integration**

- Read-only access to journal entries
- No modification of game data without explicit user action
- Respect Foundry's permission system

## Known Security Considerations

### Alpha Software Limitations

1. **Incomplete Input Validation**: Some edge cases may not be handled
2. **Limited Error Handling**: Errors might leak information
3. **Debug Features**: Console logging may expose sensitive data
4. **Configuration Complexity**: Easy to misconfigure security settings

### Third-Party Dependencies

**AI Service Providers**

- OpenAI, Anthropic, and similar services have their own security policies
- Data processing occurs on their infrastructure
- Subject to their terms of service and privacy policies

**JavaScript Dependencies**

- Module uses npm packages with known security scanning
- Regular updates to address known vulnerabilities
- Minimal dependency footprint to reduce attack surface

## Security Updates

### Update Process

1. **Vulnerability Assessment**: Severity and impact analysis
2. **Patch Development**: Fix implementation and testing
3. **Security Advisory**: Public disclosure (if appropriate)
4. **Release**: Emergency release for critical issues
5. **Communication**: Notify users of security updates

### User Responsibilities

- **Keep Updated**: Install security updates promptly
- **Secure Configuration**: Use HTTPS endpoints when possible
- **API Key Management**: Protect and rotate API keys regularly
- **Access Control**: Limit GM access to trusted users
- **Monitor Usage**: Watch for unusual AI service usage

## Compliance

### Data Protection

**GDPR Compliance**

- Module processes minimal personal data
- Users control all data shared with AI services
- No automated profiling or decision making
- Users can delete all stored settings

**Privacy by Design**

- Default to local AI models when possible
- Clear disclosure of data transmission
- User choice in privacy vs. convenience trade-offs

### Industry Standards

- Follow OWASP security guidelines
- Implement defense-in-depth strategies
- Regular security reviews and updates
- Community security feedback integration

## Contact Information

For security-related questions or concerns:

- **Security Email**: [rayners@example.com](mailto:rayners@example.com)
- **General Issues**: [GitHub Issues](https://github.com/rayners/fvtt-familiar/issues)
- **Community**: FoundryVTT Discord (@rayners78)

## Acknowledgments

We appreciate the security research community and responsible disclosure practices. Security researchers who responsibly report vulnerabilities will be acknowledged (with permission) in release notes and security advisories.

---

**Last Updated**: December 2024  
**Next Review**: March 2025
