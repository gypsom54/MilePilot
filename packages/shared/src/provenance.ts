/**
 * Field-level provenance required by Volume 4 Business Discovery.
 * Every Business Discovery field carries these attributes.
 */

export type ProvenanceSource =
  | "user"
  | "enrichment_suggestion"
  | "system"
  | "import"
  | "confirmed_enrichment";

export interface ChangeHistoryEntry {
  at: string;
  source: ProvenanceSource;
  previousValue: unknown;
  nextValue: unknown;
  note?: string;
}

export interface ProvenancedValue<T> {
  value: T;
  source: ProvenanceSource;
  confidence: number;
  lastVerified: string;
  changeHistory: ChangeHistoryEntry[];
}

export function createProvenancedValue<T>(
  value: T,
  source: ProvenanceSource = "user",
  confidence = 1,
  at = new Date().toISOString(),
): ProvenancedValue<T> {
  return {
    value,
    source,
    confidence,
    lastVerified: at,
    changeHistory: [
      {
        at,
        source,
        previousValue: null,
        nextValue: value,
        note: "initial",
      },
    ],
  };
}

export function updateProvenancedValue<T>(
  current: ProvenancedValue<T>,
  nextValue: T,
  source: ProvenanceSource,
  confidence = current.confidence,
  at = new Date().toISOString(),
  note?: string,
): ProvenancedValue<T> {
  return {
    value: nextValue,
    source,
    confidence,
    lastVerified: at,
    changeHistory: [
      ...current.changeHistory,
      {
        at,
        source,
        previousValue: current.value,
        nextValue,
        ...(note !== undefined ? { note } : {}),
      },
    ],
  };
}
