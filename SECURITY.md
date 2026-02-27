# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of CodeLens AI seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please email us at security@codelens-ai.org with the following information:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any additional information that might help us understand the issue

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following in your report:

- Your name and affiliation (if any)
- A detailed description of the vulnerability
- Steps to reproduce the issue
- Any proof-of-concept or exploit code
- Impact assessment of the vulnerability

## Security Measures

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Session management with secure cookies
- Password hashing with bcrypt

### Data Protection
- Encryption at rest for sensitive data
- TLS encryption for data in transit
- Regular security audits
- Input validation and sanitization

### Infrastructure Security
- Container isolation
- Network segmentation
- Regular dependency updates
- Security scanning in CI/CD pipeline

### Privacy
- GDPR compliance
- Minimal data collection
- User data deletion upon request
- Transparent privacy policy

## Third-Party Dependencies

We regularly audit our dependencies for known vulnerabilities using:
- GitHub Dependabot
- Snyk security scanning
- OWASP dependency check

## Incident Response Plan

In the event of a security incident:
1. Containment and eradication
2. Investigation and analysis
3. Notification to affected users
4. Post-incident review and improvements

## Contact

For any security-related questions or concerns, please contact:

security@codelens-ai.org
