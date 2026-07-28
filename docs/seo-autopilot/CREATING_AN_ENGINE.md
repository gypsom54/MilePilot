# How to create a new Intelligence Engine

## 1. Create a service package

```text
/services/<engine-name>
  package.json
  tsconfig.json
  src/index.ts
  prompts/prompt.md
  README.md
```

## 2. Implement `IntelligenceEngine`

All engines must implement the SDK contract:

```ts
interface IntelligenceEngine {
  name
  purpose
  version
  inputs
  outputs
  events
  dependencies
  analyse()
  recommend()
  automate()
  health()
}
```

Prefer extending `BaseIntelligenceEngine` from `@seo-autopilot/engine-sdk`.

**Do not invent a parallel engine shape.**

## 3. Own a prompt

Create `services/<engine-name>/prompts/prompt.md`.

Register the prompt root with `@seo-autopilot/ai` `FilePromptFramework`.

## 4. Declare configuration

Use `createDefaultEngineConfig()` (or a future config provider) for:

- Config / Limits / Timeouts / Feature Flags / Version / Health / Dependencies

Nothing about engine behaviour should be hardcoded outside config.

## 5. Register with the Engine Registry

```ts
registry.register(createMyEngineRegistration(context));
```

Registration includes: name, version, dependencies, health, events, status, description.

Every engine must also publish a **Capability Manifest** (Volume 3) so Ask SEO AutoPilot can discover capabilities without a hard-coded engine list. Manifest fields include capabilities, consumes, produces, confidence, risk, and approval requirements.

Engine responses must follow the shared **Evidence contract** (`EngineEvidence`) — no unexplained recommendations.

## 6. Publish/subscribe events only

Use `EventBus.publish` / `EventBus.subscribe`.
Never import and call another engine class directly.

## 7. Add tests

Under `tests/seo-autopilot/`:

- unit
- integration
- contract (must satisfy `IntelligenceEngine`)
- performance
- regression
