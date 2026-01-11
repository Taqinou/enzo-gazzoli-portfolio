---
description: Run ALL CI/CD checks locally before pushing (lint, type-check, tests, build)
---

**SPEAK TO ME IN FRENCH**

// turbo-all

You are a **CI/CD Guardian**. Your mission is to ensure zero surprises on GitHub by running every check locally first.

**GOAL: If this passes locally, CI/CD WILL pass.**

## Context & Constraints

- **Scope**: Frontend (`frontend/`) and Backend (`backend/`)
- **Tools**: `npm`, `ruff`, `pytest`, `tsc`
- **Forbidden**:
  - ❌ Skipping any check
  - ❌ Ignoring warnings (fix them too!)
  - ❌ Pushing despite failures

## Workflow

Run checks **SEQUENTIALLY** - stop on first failure.

### Phase 1: Frontend Checks

```bash
cd frontend

# 1.1 Install dependencies
npm ci

# 1.2 ESLint
npm run lint

# 1.3 TypeScript
npx tsc --noEmit

# 1.4 Production build
NEXT_PUBLIC_API_URL=https://api.sneakerscope.com/api/v1 npm run build
```

### Phase 2: Backend Checks

```bash
cd backend

# 2.1 Ruff linter
ruff check .

# 2.2 Tests with coverage
pytest --cov=app -v
```

## Quick Fixes

| Error Type | Auto-fix Command |
|------------|------------------|
| ESLint | `npm run lint:fix` |
| Ruff | `ruff check . --fix` |
| Import order | `ruff check . --fix --select I` |

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    PRE-PUSH CHECK RESULTS                    ║
╠══════════════════════════════════════════════════════════════╣
║ ✅ Frontend ESLint          │ PASSED                         ║
║ ✅ Frontend TypeScript      │ PASSED                         ║
║ ✅ Frontend Build           │ PASSED                         ║
║ ✅ Backend Ruff             │ PASSED                         ║
║ ✅ Backend Tests            │ PASSED (42 tests, 89% coverage)║
╠══════════════════════════════════════════════════════════════╣
║ 🚀 ALL CHECKS PASSED - Safe to push!                        ║
╚══════════════════════════════════════════════════════════════╝
```

## On Failure

<thinking>
1. What exact error occurred?
2. What file and line number?
3. Is there an auto-fix available?
4. What's the minimal fix?
</thinking>

Provide:
1. **Exact error message**
2. **File:line** location
3. **Quick fix** suggestion
4. **Auto-fix command** if available

## Few-Shot Examples

### Example 1: Clean Run
**All checks pass** → Display success box, confirm safe to push

### Example 2: TypeScript Error
**Error**: `Property 'onDismiss' does not exist on type 'AlertProps'`
**Fix**: "Add `onDismiss?: () => void` to AlertProps in `types/alert.ts:5`"

### Example 3: Test Failure
**Error**: `test_auth_login FAILED`
**Action**: Show failure output, suggest `pytest tests/test_auth.py -v --tb=short`

## Optional: Full Suite

If asked for `--full` or `--e2e`:
```bash
cd frontend
npx playwright install --with-deps
npm run test:e2e
```

## Priority

Accuracy > Speed. Catch errors now, not on GitHub.
