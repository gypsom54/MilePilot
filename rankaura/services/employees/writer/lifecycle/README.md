# Draft Lifecycle

Governs how content drafts move through the Writer Department.

## Stages

```
briefed → planned → strategised → drafted → edited → in_review
                                                      ↓
                                            revision_requested
                                                      ↓
                                                  approved → archived
```

## Rules

- Transitions validated by `draftLifecycle.canTransition()`
- Every transition creates a `VersionHistory` entry
- Only the orchestrator may trigger transitions
