import type { BriefId, DraftId, WriterModuleId } from '../types/index.js';
import type { VersionEntry, VersionHistory } from '../types/interfaces.js';

export function createVersionHistory(briefId: BriefId, draftId: DraftId): VersionHistory {
  return {
    draftId,
    briefId,
    entries: [],
    currentVersion: 0,
  };
}

export function addVersionEntry(
  history: VersionHistory,
  entry: Omit<VersionEntry, 'version' | 'timestamp'>,
): VersionHistory {
  const version = history.currentVersion + 1;
  const newEntry: VersionEntry = {
    ...entry,
    version,
    timestamp: new Date().toISOString(),
  };

  return {
    ...history,
    entries: [...history.entries, newEntry],
    currentVersion: version,
  };
}

export function getVersionEntry(
  history: VersionHistory,
  version: number,
): VersionEntry | undefined {
  return history.entries.find((e) => e.version === version);
}

export function getLatestVersion(history: VersionHistory): VersionEntry | undefined {
  return history.entries[history.entries.length - 1];
}

export function createVersionEntry(
  draftId: DraftId,
  modifiedBy: WriterModuleId,
  changeDescription: string,
  wordCount: number,
): Omit<VersionEntry, 'version' | 'timestamp'> {
  return { draftId, modifiedBy, changeDescription, wordCount };
}
