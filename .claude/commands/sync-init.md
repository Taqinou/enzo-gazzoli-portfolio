---
description: Full project review and .agent/rules/init.md synchronization
---

---
description: "Full project review and .agent/rules/init.md synchronization"
---

You are a documentation specialist. Your mission is to perform a **COMPLETE REVIEW** of the entire project and update init.md to reflect the current state of the codebase.

**You need to always ULTRA THINK.**

## Phase 1: Project Exploration (EXHAUSTIVE)

### 1.1 Structure Analysis
- Map ALL directories: frontend, backend, data-collector, scripts, configs
- Identify NEW packages, services, or modules added since last update
- Detect DELETED or RENAMED files/directories
- Check for new environment variables in `.env.example` files

### 1.2 Backend Review
- Scan `backend/app/` for new endpoints, services, models
- Check `alembic/versions/` for recent migrations (new tables/columns)
- Review `requirements.txt` for new dependencies
- Identify new scheduled tasks, WebSocket handlers, or middleware
- Look for new patterns or architectural changes

### 1.3 Frontend Review
- Scan `frontend/app/` for new routes and route groups
- Check `package.json` for new dependencies
- Review `components/` for new UI patterns
- Identify new hooks in `lib/hooks/`
- Check for new API integrations

### 1.4 Data Collector Review
- Check for new endpoints or data sources
- Review any API changes

### 1.5 DevOps & Config
- Review `docker-compose.yml` for new services or ports
- Check scripts in `scripts/` directory
- Look for new GitHub Actions or CI/CD changes
- Verify documented commands still work

## Phase 2: CLAUDE.md Comparison

Compare current CLAUDE.md against your findings:

### Check for OUTDATED information:
- [ ] Commands that no longer work or have new syntax
- [ ] Removed services, endpoints, or features
- [ ] Deprecated patterns or approaches
- [ ] Wrong file paths or directory structures
- [ ] Missing environment variables

### Check for MISSING information:
- [ ] New features not documented
- [ ] New development commands
- [ ] New services or infrastructure
- [ ] New architectural patterns
- [ ] New testing strategies
- [ ] New pitfalls or gotchas discovered

## Phase 3: Update CLAUDE.md

Apply updates following these rules:

1. **PRESERVE existing structure** - Keep section order and formatting
2. **MINIMAL CHANGES** - Only update what needs updating
3. **BE CONCISE** - CLAUDE.md should remain scannable
4. **ADD VALUE** - Every line should help future developers
5. **UPDATE, DON'T APPEND** - Modify existing sections rather than adding duplicates

### Update Checklist:
- [ ] Project Overview (if core features changed)
- [ ] Development Commands (new or changed commands)
- [ ] Architecture (new services, patterns, directory changes)
- [ ] Data Flow (new integrations or data paths)
- [ ] Environment Variables (new required/optional vars)
- [ ] Implementation Details (new gotchas, patterns)
- [ ] Common Pitfalls (new lessons learned)

## Phase 4: Report

After updating, provide a summary:

```
## init.md Sync Report (.agent/rules/init.md)

### Added:
- [list of new sections/info added]

### Updated:
- [list of sections modified and why]

### Removed:
- [list of outdated info removed]

### No Changes Needed:
- [list of sections that were already accurate]
```

## Execution Rules

- **BE THOROUGH**: Leave no directory unexplored
- **PARALLEL EXPLORATION**: Use multiple search agents simultaneously
- **VERIFY CHANGES**: Cross-reference findings with actual files
- **PRESERVE INTENT**: Maintain the spirit and style of original CLAUDE.md
- **ATOMIC UPDATES**: Make precise, targeted changes only

## Priority

Accuracy > Completeness > Brevity. The goal is a init.md that perfectly reflects the current codebase.
