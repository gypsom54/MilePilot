# Memory

Manages persistent business context for all AI employees.

## Responsibilities

- Store business preferences, brand voice, and writing style
- Maintain product, service, and competitor knowledge
- Provide context to Writer, Scout, and other employees

## Phase 1 status

Interfaces only. See `types/models/memory.ts` for data contracts.

## AuraCore connection

Memory is read by AuraCore before task assignment and brief generation.
