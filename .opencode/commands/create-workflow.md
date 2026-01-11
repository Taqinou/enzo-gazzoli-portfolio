---
description: Generate MASTERPIECE Tier-S agent workflow with Chain of Thought & Few-Shot prompting
---

# Create Command Workflow

Forge **Cognitive Engines**, not just scripts. Quality > Speed.

## Phase 1: Deconstruct the Request

1. **Extract Intent**:
   - Parse `<command_name>` and `<description>` from user input
   - Identify: Domain (Frontend/Backend/DevOps), Risk Level (Read/Destructive), Complexity (Simple/Multi-Phase)

2. **Explore Existing Patterns**:
   ```bash
   # Check existing commands for inspiration
   ls -la .claude/commands/ .agent/workflows/
   ```
   // turbo
   - Note naming conventions and structure patterns used

## Phase 2: Architectural Design

3. **Define Core Elements (think before writing)**:
   - **Persona**: "Senior [Domain] Specialist" - be elite and specific
   - **Thinking Process**: What questions must the command ask itself?
   - **Safety Rails**: What must NEVER happen?
   - **Output Format**: Structured (XML/JSON/Markdown)

4. **Create Few-Shot Examples**:
   - Draft 2-3 realistic input/output pairs
   - Include edge cases and error scenarios
   - Show explicit `<thinking>` reasoning for each

## Phase 3: Generate the Artifact

5. **Write the Command File**:
   - Target: `.claude/commands/<command_name>.md`
   - Use the strict template below

### Required Template Structure

```markdown
---
description: [Action-oriented, one-line description]
argument-hint: <required_arg> [optional_arg]
---

You are a [Elite Persona]. [One-sentence mission statement].

**You MUST use extended thinking for complex decisions.**

## Context & Constraints

- **Scope**: [Files/areas in scope - be specific]
- **Tools**: [Preferred tools: ripgrep, fd, etc.]
- **Forbidden**: [Critical things that must NEVER happen]

## Workflow

### Phase 1: Context Gathering
- [ ] Scan relevant files with `fd` or `find_by_name`
- [ ] Read key files with `view_file` or `grep_search`
- [ ] Understand current patterns in codebase

### Phase 2: Analysis
Wrap analysis in `<thinking>` blocks:
<thinking>
1. What pattern am I looking for?
2. Does this match the criteria?
3. Is this change safe? What could break?
4. Are there edge cases I'm missing?
</thinking>

### Phase 3: Execution
- [ ] Execute changes systematically
- [ ] Verify each step before proceeding
- [ ] Handle errors gracefully

## Few-Shot Examples

### Example 1: [Happy Path]
**Input**: `<typical_user_input>`
**Thinking**: "I see X pattern, so I should Y because Z."
**Action**:
\`\`\`bash
[exact_command]
\`\`\`
**Output**: [Expected result]

### Example 2: [Edge Case]
**Input**: `<edge_case_input>`
**Thinking**: "This is unusual because... I should handle by..."
**Action**: [Adapted approach]

### Example 3: [Error Case]
**Input**: `<problematic_input>`
**Thinking**: "This would fail because... Safe fallback is..."
**Action**: [Error handling]

## Output Format

[Define exact response structure - prefer Markdown/JSON/XML]

## Priority Order

1. **Safety**: Never break existing functionality
2. **Quality**: Follow all codebase conventions
3. **Clarity**: Explain decisions in outputs
4. **Speed**: Last priority
```

## Phase 4: Validation

6. **Review Checklist**:
   - [ ] Does `description` clearly state what the command does?
   - [ ] Is the persona specific and domain-appropriate?
   - [ ] Are `<thinking>` blocks required for decisions?
   - [ ] Do Few-Shot examples cover: happy path, edge case, error?
   - [ ] Are forbidden actions clearly stated?
   - [ ] Is output format explicitly defined?

7. **Self-Test**:
   - Mentally run through the command with sample input
   - Verify each phase produces expected output
   - Check for ambiguity or missing edge cases

## Quality Metrics (Tier-S Checklist)

| Criterion | Required |
|-----------|----------|
| **Context-Aware** | Knows its domain & limitations |
| **Deliberate** | Uses `<thinking>` for all decisions |
| **Teach by Example** | 2-3 Few-Shot examples included |
| **Structured I/O** | Clear input parsing, formatted output |
| **Safe by Default** | Forbidden actions explicitly stated |
| **Best Practices** | Follows Claude prompt engineering guidelines |

## Example: Creating `optimize-images` Command

**User Request**: `/create-command optimize-images "Find large PNGs and convert to WebP"`

**Analysis**:
- Domain: DevOps/Media
- Risk: Medium (modifies files)
- Persona: Media Optimization Specialist

**Key Decisions**:
- Keep originals with `.bak` extension? → Yes, safety first
- Size threshold? → >100KB default, configurable
- Tools: `fd` for finding, `cwebp` for conversion

**Generated Command Structure**:
```markdown
---
description: Convert large PNG images to optimized WebP format
argument-hint: [--threshold=100KB] [--keep-originals]
---

You are the Media Optimization Specialist...
```

## Anti-Patterns to Avoid

❌ Vague personas: "You are an AI assistant"
❌ Missing thinking blocks: Acting without reasoning
❌ No examples: Expecting the model to infer behavior
❌ Unbounded scope: "Look at all files in the project"
❌ No safety rails: Missing forbidden actions
❌ Unstructured output: Free-form responses

## Pro Tips

1. **Start specific, expand later**: Better to be too narrow than too broad
2. **Explicit > Implicit**: State everything, assume nothing
3. **Examples are training**: The model learns from your examples
4. **Safety is non-negotiable**: Always define what can go wrong
5. **Iterate**: First draft → test → refine → repeat