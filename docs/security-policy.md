# CodeLens AI — Security Policy

## Overview

CodeLens AI handles user authentication, code execution, and AI interactions. This document outlines our security architecture, threat model, and guidelines.

---

## Authentication & Authorization

### JWT Token Security
- Tokens signed with **HS256** algorithm
- Default expiration: **30 minutes**
- Tokens contain `sub` (username) and `user_id` claims
- Bearer token required for all protected endpoints

### Password Security
- Passwords hashed with **bcrypt** (directly using the bcrypt library).  Note that bcrypt only considers the first 72 bytes of input; longer passwords are automatically truncated to avoid runtime errors.
- Minimum 8 characters enforced
- Hash comparison uses constant-time comparison
- Raw passwords never stored or logged

### Rate Limiting
- Redis-backed rate limiting (10 requests/minute per user)
- Graceful fallback if Redis unavailable (fail open)
- Rate limit key format: `rate_limit:<action>:<identifier>`

---

## Code Execution Security

### Sandboxing
- User code executes in **isolated Python process** via `subprocess`
- Execution timeout: **30 seconds** (configurable)
- Memory limit: **100 MB** (on supported systems)
- Working directory: system temp directory (no file system access)
- Temporary files cleaned up after execution

### Restricted Operations
- Code runs with standard `__builtins__` only
- No file system write access outside temp
- Network access from executed code is possible (known limitation)
- No shell command execution from user code

### Known Limitations
> **⚠ WARNING:** The `exec()` call in `execution_tracer.py` runs user code in the server process. For production deployment, use a separate sandboxed container or subprocess with `seccomp` profiles.

---

## API Security

### CORS Configuration
Allowed origins (configurable via settings):
- `http://localhost:3000` (frontend dev server)
- `http://localhost:5173` (Vite default)
- `http://localhost:8000` (backend/docs)
- `http://127.0.0.1:3000`, `http://127.0.0.1:5173`

### Input Validation
- All inputs validated with **Pydantic** models
- Code submissions limited to **10 KB**
- SQL injection prevented via SQLAlchemy parameterized queries
- XSS prevented via React's default output escaping
- Null bytes stripped from all text inputs

### Security Headers (Nginx)
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

---

## Data Protection

### Sensitive Data Handling
- API keys hashed with SHA-256 before storage
- Passwords never returned in API responses
- User emails obfuscated in logs (`j***n@example.com`)
- Environment variables used for all secrets

### Database Security
- SQLite for development (single-user)
- Connection pooling with `pool_pre_ping=True`
- Automatic connection recycling every 3600 seconds
- Alembic migrations for schema versioning

---

## Dependency Security

### Python Dependencies
| Package           | Purpose              | Security Note                      |
|-------------------|----------------------|------------------------------------|
| `bcrypt`          | Password hashing     | Industry-standard, constant-time   |
| `pyjwt`           | JWT tokens           | Verify algorithm explicitly        |
| `python-jose`     | JOSE implementation  | Used for token validation          |
| `fastapi`         | Web framework        | Built-in validation & docs         |

### Supply Chain
- Pin minimum versions in `requirements.txt`
- Run `pip audit` periodically for vulnerability scanning
- Review dependency updates before upgrading

---

## Deployment Security

### Docker
- Use slim base images (`python:3.11-slim`)
- No root user in containers (recommended: add `USER` directive)
- Multi-stage builds for frontend (build → nginx)
- `.dockerignore` excludes sensitive files

### Kubernetes
- Secrets stored in K8s `Secret` objects (base64-encoded)
- Network policies recommended between pods
- Resource limits set on all containers
- Liveness and readiness probes configured

### Environment
- Never commit `.env` files to version control
- Use strong, randomly generated `SECRET_KEY`
- Rotate secrets periodically
- Disable `debug=True` in production

---

## Incident Response

### Reporting Vulnerabilities
Report security issues to the development team via:
- Email: security@codelens-ai.example.com
- Open a confidential issue in the repository

### Response Process
1. Acknowledge report within 24 hours
2. Assess severity and impact
3. Develop and test fix
4. Deploy patch
5. Notify affected users if applicable

---

## Security Checklist for Deployment

- [ ] Change `SECRET_KEY` from default value
- [ ] Set `debug=False` in production
- [ ] Enable HTTPS (TLS termination at load balancer)
- [ ] Configure firewall rules
- [ ] Set up log monitoring and alerting
- [ ] Run `pip audit` for dependency vulnerabilities
- [ ] Review CORS origins for production domains
- [ ] Configure rate limiting with Redis
- [ ] Add `USER nonroot` to Dockerfiles
- [ ] Enable Kubernetes network policies
