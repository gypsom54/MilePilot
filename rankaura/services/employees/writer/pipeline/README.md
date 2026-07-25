# Review Pipeline

Sequential review chain for content drafts. All communication routes through the orchestrator.

## Review order

1. **Editor** — structure and clarity
2. **SEO Reviewer** — discoverability structure (internal module name)
3. **Brand Reviewer** — brand voice alignment
4. **Readability Reviewer** — plain English and reading level
5. **QA Reviewer** — final quality gate

## Rules

- Reviewers never talk to each other directly
- Orchestrator passes draft to each reviewer in sequence
- Pipeline stops early if a reviewer requests revision
