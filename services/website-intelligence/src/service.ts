import { createHash, randomUUID } from "node:crypto";
import type { EventBus } from "@seo-autopilot/shared";
import { err, ok, type EngineResult } from "@seo-autopilot/shared";
import type {
  ObservationMeta,
  PageEntity,
  PropertyEnvironment,
  WebsiteProfile,
} from "./domain/types.js";
import { PlatformEventName, publishWebsiteEvent } from "./events/publish.js";
import type { WebsiteProfileRepository } from "./repository/website-profile-repository.js";
import {
  validateAndNormaliseUrl,
  validateCreateWebsiteInput,
  validateNonEmpty,
  validateObservation,
  validatePropertyEnvironment,
  validatePublicationState,
  wouldCreateHierarchyLoop,
} from "./validation/validate.js";

type ObsInput = {
  sourceId: string;
  observedAt: string;
  confidence: number;
  provenance?: string;
  limitations?: string[];
};

function observation(
  validated: { sourceId: string; observedAt: string; confidence: number },
  input: Pick<ObsInput, "provenance" | "limitations">,
  defaultProvenance: string,
): ObservationMeta {
  return {
    sourceId: validated.sourceId,
    observedAt: validated.observedAt,
    confidence: validated.confidence,
    provenance: input.provenance ?? defaultProvenance,
    limitations: input.limitations ?? [],
  };
}

function importKey(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

export class WebsiteIntelligenceService {
  constructor(
    private readonly repository: WebsiteProfileRepository,
    private readonly events: EventBus,
  ) {}

  assertExternalFactsUntouched(profile: WebsiteProfile): {
    businessId: string | undefined;
    mutatedBusinessDiscovery: false;
    mutatedMarketIntelligence: false;
  } {
    return {
      businessId: profile.businessId,
      mutatedBusinessDiscovery: false,
      mutatedMarketIntelligence: false,
    };
  }

  async defineWebsite(
    rawInput: unknown,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const validated = validateCreateWebsiteInput(rawInput);
    if (!validated.ok) {
      return validated;
    }
    const now = new Date().toISOString();
    const profile: WebsiteProfile = {
      id: randomUUID(),
      tenantId: validated.value.tenantId,
      ...(validated.value.businessId !== undefined
        ? { businessId: validated.value.businessId }
        : {}),
      name: validated.value.name,
      version: 1,
      createdAt: now,
      updatedAt: now,
      properties: [],
      pages: [],
      sections: [],
      templates: [],
      navigations: [],
      conversionActions: [],
      forms: [],
      trustElements: [],
      assets: [],
      snapshots: [],
      importJobs: [],
      importKeys: [],
    };
    const saved = await this.repository.saveNew(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.WebsiteDefined,
      {
        websiteId: saved.value.id,
        tenantId: saved.value.tenantId,
        businessId: saved.value.businessId ?? null,
      },
      correlationId,
    );
    return saved;
  }

  getWebsite(websiteId: string, tenantId?: string): EngineResult<WebsiteProfile> {
    return this.repository.get(websiteId, tenantId);
  }

  listWebsites(tenantId: string): WebsiteProfile[] {
    return this.repository.listByTenant(tenantId);
  }

  listVersions(
    websiteId: string,
    tenantId?: string,
  ): EngineResult<number[]> {
    const existing = this.repository.get(websiteId, tenantId);
    if (!existing.ok) {
      return existing;
    }
    return ok(this.repository.listVersions(websiteId));
  }

  async addProperty(
    websiteId: string,
    tenantId: string,
    input: { environment: PropertyEnvironment; baseUrl: string },
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const environment = validatePropertyEnvironment(input.environment);
    if (!environment.ok) {
      return environment;
    }
    const url = validateAndNormaliseUrl(input.baseUrl);
    if (!url.ok) {
      return url;
    }
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    if (
      profile.properties.some(
        (property) => property.environment === environment.value,
      )
    ) {
      return err({
        code: "PROPERTY_ENVIRONMENT_EXISTS",
        message: `A ${environment.value} property already exists and must remain distinct`,
        retryable: false,
      });
    }
    const id = randomUUID();
    profile.properties.push({
      id,
      environment: environment.value,
      baseUrl: url.value.rawUrl,
      normalisedBaseUrl: url.value.normalisedUrl,
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.WebsitePropertyAdded,
      {
        websiteId,
        tenantId,
        propertyId: id,
        environment: environment.value,
      },
      correlationId,
    );
    return saved;
  }

  async observePage(
    websiteId: string,
    tenantId: string,
    input: {
      propertyId: string;
      url: string;
      title?: string;
      pageType?: string;
      purpose?: string;
    } & ObsInput,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const url = validateAndNormaliseUrl(input.url);
    if (!url.ok) {
      return url;
    }
    const obs = validateObservation(input);
    if (!obs.ok) {
      return obs;
    }
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const property = profile.properties.find(
      (item) => item.id === input.propertyId,
    );
    if (!property) {
      return err({
        code: "PROPERTY_NOT_FOUND",
        message: `Property not found: ${input.propertyId}`,
        retryable: false,
      });
    }

    const key = importKey([
      tenantId,
      websiteId,
      property.id,
      url.value.normalisedUrl,
      "page",
    ]);
    const existing = profile.pages.find(
      (page) =>
        page.propertyId === property.id &&
        page.normalisedUrl === url.value.normalisedUrl,
    );
    if (existing || profile.importKeys.includes(key)) {
      return ok(profile);
    }

    const evidence = observation(obs.value, input, "import");
    const page: PageEntity = {
      id: randomUUID(),
      propertyId: property.id,
      rawUrl: url.value.rawUrl,
      normalisedUrl: url.value.normalisedUrl,
      ...(input.title !== undefined ? { title: input.title } : {}),
      pageType: {
        value: input.pageType ?? "unknown",
        status: "candidate",
        evidence,
      },
      purpose: {
        value: input.purpose ?? "unknown",
        status: "candidate",
        evidence,
      },
      publicationState: "published",
      publicationHistory: [
        {
          state: "published",
          at: obs.value.observedAt,
          sourceId: obs.value.sourceId,
        },
      ],
      sectionIds: [],
      businessEntityRefs: [],
      marketEntityRefs: [],
      topicIds: [],
      questionIds: [],
      conversionActionIds: [],
      formIds: [],
      trustElementIds: [],
      assetIds: [],
      evidence,
      importKey: key,
    };
    profile.pages.push(page);
    profile.importKeys.push(key);

    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.PageObserved,
      {
        websiteId,
        tenantId,
        pageId: page.id,
        propertyId: property.id,
        normalisedUrl: page.normalisedUrl,
        environment: property.environment,
      },
      correlationId,
    );
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.PageTypeCandidateCreated,
      { websiteId, pageId: page.id, value: page.pageType.value },
      correlationId,
    );
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.PagePurposeCandidateCreated,
      { websiteId, pageId: page.id, value: page.purpose.value },
      correlationId,
    );
    return saved;
  }

  async confirmPageType(
    websiteId: string,
    tenantId: string,
    pageId: string,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    return this.confirmClassification(
      websiteId,
      tenantId,
      pageId,
      "pageType",
      PlatformEventName.PageTypeConfirmed,
      correlationId,
    );
  }

  async confirmPagePurpose(
    websiteId: string,
    tenantId: string,
    pageId: string,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    return this.confirmClassification(
      websiteId,
      tenantId,
      pageId,
      "purpose",
      PlatformEventName.PagePurposeConfirmed,
      correlationId,
    );
  }

  private async confirmClassification(
    websiteId: string,
    tenantId: string,
    pageId: string,
    field: "pageType" | "purpose",
    eventName: string,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const page = profile.pages.find((item) => item.id === pageId);
    if (!page) {
      return err({
        code: "PAGE_NOT_FOUND",
        message: `Page not found: ${pageId}`,
        retryable: false,
      });
    }
    page[field].status = "confirmed";
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      eventName,
      { websiteId, tenantId, pageId, value: page[field].value },
      correlationId,
    );
    return saved;
  }

  async updateHierarchy(
    websiteId: string,
    tenantId: string,
    pageId: string,
    parentPageId: string | null,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const page = profile.pages.find((item) => item.id === pageId);
    if (!page) {
      return err({
        code: "PAGE_NOT_FOUND",
        message: `Page not found: ${pageId}`,
        retryable: false,
      });
    }
    if (parentPageId) {
      const parent = profile.pages.find((item) => item.id === parentPageId);
      if (!parent) {
        return err({
          code: "PAGE_NOT_FOUND",
          message: `Parent page not found: ${parentPageId}`,
          retryable: false,
        });
      }
      if (parent.propertyId !== page.propertyId) {
        return err({
          code: "HIERARCHY_PROPERTY_MISMATCH",
          message: "Parent page must belong to the same website property",
          retryable: false,
        });
      }
      if (wouldCreateHierarchyLoop(profile.pages, pageId, parentPageId)) {
        return err({
          code: "HIERARCHY_LOOP",
          message: "Canonical page relationships must not create loops",
          retryable: false,
        });
      }
      page.parentPageId = parentPageId;
    } else {
      delete page.parentPageId;
    }
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.PageHierarchyUpdated,
      { websiteId, tenantId, pageId, parentPageId },
      correlationId,
    );
    return saved;
  }

  async addNavigation(
    websiteId: string,
    tenantId: string,
    input: {
      name: string;
      items: Array<{ label: string; pageId?: string; href?: string }>;
    } & ObsInput,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const name = validateNonEmpty(input.name, "navigation.name");
    if (!name.ok) {
      return name;
    }
    const obs = validateObservation(input);
    if (!obs.ok) {
      return obs;
    }
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const id = randomUUID();
    profile.navigations.push({
      id,
      name: name.value,
      items: input.items,
      evidence: observation(obs.value, input, "user"),
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.NavigationStructureUpdated,
      { websiteId, tenantId, navigationId: id },
      correlationId,
    );
    return saved;
  }

  async addSection(
    websiteId: string,
    tenantId: string,
    pageId: string,
    input: { heading: string; order?: number } & ObsInput,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const heading = validateNonEmpty(input.heading, "section.heading");
    if (!heading.ok) {
      return heading;
    }
    const obs = validateObservation(input);
    if (!obs.ok) {
      return obs;
    }
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const page = profile.pages.find((item) => item.id === pageId);
    if (!page) {
      return err({
        code: "PAGE_NOT_FOUND",
        message: `Page not found: ${pageId}`,
        retryable: false,
      });
    }
    const id = randomUUID();
    profile.sections.push({
      id,
      heading: heading.value,
      order: input.order ?? page.sectionIds.length,
      evidence: observation(obs.value, input, "import"),
    });
    page.sectionIds.push(id);
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.PageSectionObserved,
      { websiteId, tenantId, pageId, sectionId: id },
      correlationId,
    );
    return saved;
  }

  async addTemplate(
    websiteId: string,
    tenantId: string,
    input: { name: string; description?: string },
  ): Promise<EngineResult<WebsiteProfile>> {
    const name = validateNonEmpty(input.name, "template.name");
    if (!name.ok) {
      return name;
    }
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    profile.templates.push({
      id: randomUUID(),
      name: name.value,
      description: input.description ?? "",
    });
    return this.repository.saveVersioned(profile);
  }

  async associateTemplate(
    websiteId: string,
    tenantId: string,
    pageId: string,
    templateId: string,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const page = profile.pages.find((item) => item.id === pageId);
    const template = profile.templates.find((item) => item.id === templateId);
    if (!page || !template) {
      return err({
        code: "NOT_FOUND",
        message: "Page or template not found",
        retryable: false,
      });
    }
    page.templateId = templateId;
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.PageTemplateAssociated,
      { websiteId, tenantId, pageId, templateId },
      correlationId,
    );
    return saved;
  }

  async mapBusinessEntity(
    websiteId: string,
    tenantId: string,
    pageId: string,
    input: { businessId: string; entityPath: string; refTenantId: string },
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    if (input.refTenantId !== tenantId) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Cross-tenant relationships must be rejected",
        retryable: false,
      });
    }
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    // Never mutate Business Discovery — store read-only refs only.
    if (profile.businessId && profile.businessId !== input.businessId) {
      return err({
        code: "BUSINESS_REF_MISMATCH",
        message:
          "Website Intelligence must not overwrite or replace Business Discovery identity",
        retryable: false,
      });
    }
    const page = profile.pages.find((item) => item.id === pageId);
    if (!page) {
      return err({
        code: "PAGE_NOT_FOUND",
        message: `Page not found: ${pageId}`,
        retryable: false,
      });
    }
    page.businessEntityRefs.push({
      businessId: input.businessId,
      entityPath: input.entityPath,
      tenantId: input.refTenantId,
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.BusinessEntityMapped,
      { websiteId, tenantId, pageId, businessId: input.businessId },
      correlationId,
    );
    return saved;
  }

  async mapMarketEntity(
    websiteId: string,
    tenantId: string,
    pageId: string,
    input: {
      marketId: string;
      entityType: string;
      entityId: string;
      refTenantId: string;
    },
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    if (input.refTenantId !== tenantId) {
      return err({
        code: "TENANT_ISOLATION_VIOLATION",
        message: "Cross-tenant relationships must be rejected",
        retryable: false,
      });
    }
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const page = profile.pages.find((item) => item.id === pageId);
    if (!page) {
      return err({
        code: "PAGE_NOT_FOUND",
        message: `Page not found: ${pageId}`,
        retryable: false,
      });
    }
    page.marketEntityRefs.push({
      marketId: input.marketId,
      entityType: input.entityType,
      entityId: input.entityId,
      tenantId: input.refTenantId,
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.MarketEntityMapped,
      { websiteId, tenantId, pageId, marketId: input.marketId },
      correlationId,
    );
    return saved;
  }

  async associateTopic(
    websiteId: string,
    tenantId: string,
    pageId: string,
    topicId: string,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    return this.pushPageId(
      websiteId,
      tenantId,
      pageId,
      "topicIds",
      topicId,
      PlatformEventName.TopicAssociated,
      correlationId,
    );
  }

  async associateQuestion(
    websiteId: string,
    tenantId: string,
    pageId: string,
    questionId: string,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    return this.pushPageId(
      websiteId,
      tenantId,
      pageId,
      "questionIds",
      questionId,
      PlatformEventName.QuestionAssociated,
      correlationId,
    );
  }

  private async pushPageId(
    websiteId: string,
    tenantId: string,
    pageId: string,
    field: "topicIds" | "questionIds",
    value: string,
    eventName: string,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const page = profile.pages.find((item) => item.id === pageId);
    if (!page) {
      return err({
        code: "PAGE_NOT_FOUND",
        message: `Page not found: ${pageId}`,
        retryable: false,
      });
    }
    if (!page[field].includes(value)) {
      page[field].push(value);
    }
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      eventName,
      { websiteId, tenantId, pageId, value },
      correlationId,
    );
    return saved;
  }

  async addConversionAction(
    websiteId: string,
    tenantId: string,
    pageId: string,
    input: { label: string; kind: string } & ObsInput,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const label = validateNonEmpty(input.label, "conversion.label");
    if (!label.ok) {
      return label;
    }
    return this.addPageChild(
      websiteId,
      tenantId,
      pageId,
      "conversionActions",
      "conversionActionIds",
      {
        id: randomUUID(),
        label: label.value,
        kind: String(input.kind),
      },
      input,
      PlatformEventName.ConversionActionObserved,
      correlationId,
    );
  }

  private async addPageChild(
    websiteId: string,
    tenantId: string,
    pageId: string,
    collection:
      | "conversionActions"
      | "forms"
      | "trustElements"
      | "assets",
    pageField:
      | "conversionActionIds"
      | "formIds"
      | "trustElementIds"
      | "assetIds",
    entity: { id: string } & Record<string, unknown>,
    input: ObsInput,
    eventName: string,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const obs = validateObservation(input);
    if (!obs.ok) {
      return obs;
    }
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const page = profile.pages.find((item) => item.id === pageId);
    if (!page) {
      return err({
        code: "PAGE_NOT_FOUND",
        message: `Page not found: ${pageId}`,
        retryable: false,
      });
    }
    const collectionItems = profile[collection] as unknown as Array<
      Record<string, unknown>
    >;
    collectionItems.push({
      ...entity,
      evidence: observation(obs.value, input, "import"),
    });
    page[pageField].push(String(entity.id));
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      eventName,
      { websiteId, tenantId, pageId, childId: entity.id },
      correlationId,
    );
    return saved;
  }

  async addForm(
    websiteId: string,
    tenantId: string,
    pageId: string,
    input: { name: string; fieldCount?: number } & ObsInput,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const name = validateNonEmpty(input.name, "form.name");
    if (!name.ok) {
      return name;
    }
    return this.addPageChild(
      websiteId,
      tenantId,
      pageId,
      "forms",
      "formIds",
      {
        id: randomUUID(),
        name: name.value,
        ...(input.fieldCount !== undefined
          ? { fieldCount: input.fieldCount }
          : {}),
      },
      input,
      PlatformEventName.FormObserved,
      correlationId,
    );
  }

  async addTrustElement(
    websiteId: string,
    tenantId: string,
    pageId: string,
    input: { kind: string; label: string } & ObsInput,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const label = validateNonEmpty(input.label, "trust.label");
    if (!label.ok) {
      return label;
    }
    return this.addPageChild(
      websiteId,
      tenantId,
      pageId,
      "trustElements",
      "trustElementIds",
      {
        id: randomUUID(),
        kind: String(input.kind),
        label: label.value,
      },
      input,
      PlatformEventName.TrustElementObserved,
      correlationId,
    );
  }

  async addAsset(
    websiteId: string,
    tenantId: string,
    pageId: string,
    input: { kind: string; url: string; label: string } & ObsInput,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const label = validateNonEmpty(input.label, "asset.label");
    if (!label.ok) {
      return label;
    }
    const url = validateAndNormaliseUrl(input.url);
    if (!url.ok) {
      return url;
    }
    return this.addPageChild(
      websiteId,
      tenantId,
      pageId,
      "assets",
      "assetIds",
      {
        id: randomUUID(),
        kind: String(input.kind),
        url: url.value.normalisedUrl,
        label: label.value,
      },
      input,
      PlatformEventName.WebsiteAssetObserved,
      correlationId,
    );
  }

  async changePublicationState(
    websiteId: string,
    tenantId: string,
    pageId: string,
    input: { state: unknown } & ObsInput,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const state = validatePublicationState(input.state);
    if (!state.ok) {
      return state;
    }
    const obs = validateObservation(input);
    if (!obs.ok) {
      return obs;
    }
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const page = profile.pages.find((item) => item.id === pageId);
    if (!page) {
      return err({
        code: "PAGE_NOT_FOUND",
        message: `Page not found: ${pageId}`,
        retryable: false,
      });
    }
    page.publicationState = state.value;
    page.publicationHistory.push({
      state: state.value,
      at: obs.value.observedAt,
      sourceId: obs.value.sourceId,
    });
    // Deleted/redirected/archived pages remain in the profile historically.
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.PagePublicationStateChanged,
      { websiteId, tenantId, pageId, state: state.value },
      correlationId,
    );
    return saved;
  }

  async createSnapshot(
    websiteId: string,
    tenantId: string,
    input: { label: string } & ObsInput,
    correlationId?: string,
  ): Promise<EngineResult<WebsiteProfile>> {
    const label = validateNonEmpty(input.label, "snapshot.label");
    if (!label.ok) {
      return label;
    }
    const obs = validateObservation(input);
    if (!obs.ok) {
      return obs;
    }
    const current = this.repository.get(websiteId, tenantId);
    if (!current.ok) {
      return current;
    }
    const profile = structuredClone(current.value);
    const id = randomUUID();
    profile.snapshots.push({
      id,
      createdAt: new Date().toISOString(),
      label: label.value,
      pageCount: profile.pages.length,
      propertyIds: profile.properties.map((property) => property.id),
      evidence: observation(obs.value, input, "user"),
    });
    const saved = await this.repository.saveVersioned(profile);
    if (!saved.ok) {
      return saved;
    }
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.WebsiteSnapshotCreated,
      { websiteId, tenantId, snapshotId: id },
      correlationId,
    );
    return saved;
  }

  async importPages(
    websiteId: string,
    tenantId: string,
    input: {
      propertyId: string;
      pages: Array<{
        url: string;
        title?: string;
        pageType?: string;
        purpose?: string;
      }>;
    } & ObsInput,
    correlationId?: string,
  ): Promise<
    EngineResult<{ profile: WebsiteProfile; imported: number; skipped: number }>
  > {
    const jobId = randomUUID();
    const startedAt = new Date().toISOString();
    await publishWebsiteEvent(
      this.events,
      PlatformEventName.WebsiteImportStarted,
      { websiteId, tenantId, jobId },
      correlationId,
    );

    let imported = 0;
    let skipped = 0;
    const initial = this.repository.get(websiteId, tenantId);
    if (!initial.ok) {
      await publishWebsiteEvent(
        this.events,
        PlatformEventName.WebsiteImportFailed,
        { websiteId, tenantId, jobId, error: initial.error.message },
        correlationId,
      );
      return initial;
    }
    let profile = initial.value;

    try {
      for (const page of input.pages) {
        const before = profile.pages.length;
        const result = await this.observePage(
          websiteId,
          tenantId,
          {
            propertyId: input.propertyId,
            url: page.url,
            ...(page.title !== undefined ? { title: page.title } : {}),
            ...(page.pageType !== undefined ? { pageType: page.pageType } : {}),
            ...(page.purpose !== undefined ? { purpose: page.purpose } : {}),
            sourceId: input.sourceId,
            observedAt: input.observedAt,
            confidence: input.confidence,
            ...(input.provenance !== undefined
              ? { provenance: input.provenance }
              : {}),
            ...(input.limitations !== undefined
              ? { limitations: input.limitations }
              : {}),
          },
          correlationId,
        );
        if (!result.ok) {
          throw new Error(result.error.message);
        }
        if (result.value.pages.length === before) {
          skipped += 1;
        } else {
          imported += 1;
        }
        profile = result.value;
      }

      profile = structuredClone(profile);
      profile.importJobs.push({
        id: jobId,
        status: "completed",
        startedAt,
        completedAt: new Date().toISOString(),
        imported,
        skipped,
      });
      const saved = await this.repository.saveVersioned(profile);
      if (!saved.ok) {
        return saved;
      }
      await publishWebsiteEvent(
        this.events,
        PlatformEventName.WebsiteImportCompleted,
        { websiteId, tenantId, jobId, imported, skipped },
        correlationId,
      );
      return ok({ profile: saved.value, imported, skipped });
    } catch (cause) {
      const failed = structuredClone(
        this.repository.get(websiteId, tenantId).ok
          ? (this.repository.get(websiteId, tenantId) as { ok: true; value: WebsiteProfile }).value
          : profile,
      );
      failed.importJobs.push({
        id: jobId,
        status: "failed",
        startedAt,
        completedAt: new Date().toISOString(),
        imported,
        skipped,
        errorMessage: cause instanceof Error ? cause.message : String(cause),
      });
      await this.repository.saveVersioned(failed);
      await publishWebsiteEvent(
        this.events,
        PlatformEventName.WebsiteImportFailed,
        {
          websiteId,
          tenantId,
          jobId,
          error: cause instanceof Error ? cause.message : String(cause),
        },
        correlationId,
      );
      return err({
        code: "IMPORT_FAILED",
        message: cause instanceof Error ? cause.message : String(cause),
        retryable: false,
      });
    }
  }
}
