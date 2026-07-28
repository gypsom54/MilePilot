import type {
  CanonicalEntity,
  CanonicalRelationship,
  EvidenceRecord,
} from "./types.js";
import { isValidAt } from "./store.js";

export interface GraphQueryService {
  getEntity(id: string): CanonicalEntity | undefined;
  findByAlias(
    tenantId: string,
    normalisedAlias: string,
  ): CanonicalEntity | undefined;
  findRelated(
    tenantId: string,
    entityId: string,
  ): {
    entity: CanonicalEntity;
    relationships: CanonicalRelationship[];
    related: CanonicalEntity[];
  } | undefined;
  getEvidenceChain(entityId: string): EvidenceRecord[];
  getVersionHistory(entityId: string): CanonicalEntity["versionHistory"] | undefined;
  getProvenanceChain(entityId: string): CanonicalEntity["provenance"] | undefined;
  getConfidenceHistory(
    entityId: string,
  ): CanonicalEntity["confidenceHistory"] | undefined;
  entitiesValidAt(tenantId: string, at: string): CanonicalEntity[];
}

export function createGraphQueryService(deps: {
  getEntity(id: string): CanonicalEntity | undefined;
  findByAlias(
    tenantId: string,
    normalisedAlias: string,
  ): CanonicalEntity | undefined;
  listRelationshipsForEntity(
    tenantId: string,
    entityId: string,
  ): CanonicalRelationship[];
  listEvidenceByIds(ids: string[]): EvidenceRecord[];
  listEntitiesByTenant(tenantId: string): CanonicalEntity[];
}): GraphQueryService {
  return {
    getEntity(id) {
      return deps.getEntity(id);
    },
    findByAlias(tenantId, normalisedAlias) {
      return deps.findByAlias(tenantId, normalisedAlias);
    },
    findRelated(tenantId, entityId) {
      const entity = deps.getEntity(entityId);
      if (!entity || entity.tenantId !== tenantId) return undefined;
      const relationships = deps.listRelationshipsForEntity(tenantId, entityId);
      const relatedIds = new Set<string>();
      for (const rel of relationships) {
        relatedIds.add(rel.from === entityId ? rel.to : rel.from);
      }
      const related = [...relatedIds]
        .map((id) => deps.getEntity(id))
        .filter((item): item is CanonicalEntity => item !== undefined);
      return { entity, relationships, related };
    },
    getEvidenceChain(entityId) {
      const entity = deps.getEntity(entityId);
      if (!entity) return [];
      return deps.listEvidenceByIds(entity.evidenceIds);
    },
    getVersionHistory(entityId) {
      return deps.getEntity(entityId)?.versionHistory;
    },
    getProvenanceChain(entityId) {
      return deps.getEntity(entityId)?.provenance;
    },
    getConfidenceHistory(entityId) {
      return deps.getEntity(entityId)?.confidenceHistory;
    },
    entitiesValidAt(tenantId, at) {
      return deps
        .listEntitiesByTenant(tenantId)
        .filter(
          (item) =>
            (item.status === "canonical" || item.status === "candidate") &&
            isValidAt(item.validFrom, item.validTo, at),
        );
    },
  };
}
