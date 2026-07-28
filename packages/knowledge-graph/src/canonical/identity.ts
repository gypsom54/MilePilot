import type { EntityAlias } from "./types.js";

/** Normalise alias/identity strings for stable identity keys. */
export function normaliseAliasValue(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function buildIdentityKey(type: string, normalisedValue: string): string {
  return `${type.toLowerCase()}::${normalisedValue}`;
}

export function collectIdentityKeys(input: {
  type: string;
  aliases?: EntityAlias[];
  identityFields?: string[];
}): string[] {
  const keys = new Set<string>();
  for (const field of input.identityFields ?? []) {
    const normalised = normaliseAliasValue(field);
    if (normalised) keys.add(buildIdentityKey(input.type, normalised));
  }
  for (const alias of input.aliases ?? []) {
    keys.add(buildIdentityKey(input.type, alias.normalisedValue));
  }
  return [...keys].sort();
}

export function aliasesOverlap(
  left: EntityAlias[],
  right: EntityAlias[],
): string[] {
  const rightSet = new Set(right.map((item) => item.normalisedValue));
  return left
    .map((item) => item.normalisedValue)
    .filter((value) => rightSet.has(value));
}
