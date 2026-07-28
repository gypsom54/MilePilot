import {
  WebsiteIntelligenceEntityType,
  WebsiteIntelligenceRelationshipType,
  websiteChildEntityId,
  websiteEntityId,
  type InMemoryKnowledgeGraph,
} from "@seo-autopilot/knowledge-graph";
import type { WebsiteProfile } from "../domain/types.js";

async function link(
  graph: InMemoryKnowledgeGraph,
  id: string,
  type: string,
  from: string,
  to: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  await graph.createRelationship({ id, type, from, to, properties });
}

export async function syncWebsiteProfileToKnowledgeGraph(
  graph: InMemoryKnowledgeGraph,
  profile: WebsiteProfile,
): Promise<void> {
  const websiteNodeId = websiteEntityId(profile.id);

  await graph.upsertEntity({
    id: websiteNodeId,
    type: WebsiteIntelligenceEntityType.Website,
    properties: {
      websiteId: profile.id,
      tenantId: profile.tenantId,
      businessId: profile.businessId ?? null,
      version: profile.version,
      name: profile.name,
      provenance: "website-intelligence",
    },
  });

  for (const property of profile.properties) {
    const id = websiteChildEntityId(profile.id, "property", property.id);
    await graph.upsertEntity({
      id,
      type: WebsiteIntelligenceEntityType.WebsiteProperty,
      properties: {
        environment: property.environment,
        baseUrl: property.baseUrl,
        normalisedBaseUrl: property.normalisedBaseUrl,
      },
    });
    await link(
      graph,
      `${websiteNodeId}->property:${property.id}`,
      WebsiteIntelligenceRelationshipType.HAS_PROPERTY,
      websiteNodeId,
      id,
    );
  }

  for (const template of profile.templates) {
    const id = websiteChildEntityId(profile.id, "template", template.id);
    await graph.upsertEntity({
      id,
      type: WebsiteIntelligenceEntityType.PageTemplate,
      properties: { ...template },
    });
    await link(
      graph,
      `${websiteNodeId}->template:${template.id}`,
      WebsiteIntelligenceRelationshipType.HAS_TEMPLATE,
      websiteNodeId,
      id,
    );
  }

  for (const page of profile.pages) {
    const id = websiteChildEntityId(profile.id, "page", page.id);
    await graph.upsertEntity({
      id,
      type: WebsiteIntelligenceEntityType.Page,
      properties: {
        normalisedUrl: page.normalisedUrl,
        publicationState: page.publicationState,
        pageType: page.pageType,
        purpose: page.purpose,
        businessEntityRefs: page.businessEntityRefs,
        marketEntityRefs: page.marketEntityRefs,
        evidence: page.evidence,
        publicationHistory: page.publicationHistory,
      },
    });
    await link(
      graph,
      `property:${page.propertyId}->page:${page.id}`,
      WebsiteIntelligenceRelationshipType.HAS_PAGE,
      websiteChildEntityId(profile.id, "property", page.propertyId),
      id,
    );
    if (page.parentPageId) {
      await link(
        graph,
        `page:${page.parentPageId}->page:${page.id}`,
        WebsiteIntelligenceRelationshipType.PARENT_OF,
        websiteChildEntityId(profile.id, "page", page.parentPageId),
        id,
      );
    }
    if (page.templateId) {
      await link(
        graph,
        `page:${page.id}->template:${page.templateId}`,
        WebsiteIntelligenceRelationshipType.USES_TEMPLATE,
        id,
        websiteChildEntityId(profile.id, "template", page.templateId),
      );
    }
    for (const topicId of page.topicIds) {
      const topicNode = websiteChildEntityId(profile.id, "topic", topicId);
      await graph.upsertEntity({
        id: topicNode,
        type: WebsiteIntelligenceEntityType.TopicRef,
        properties: { topicId },
      });
      await link(
        graph,
        `page:${page.id}->topic:${topicId}`,
        WebsiteIntelligenceRelationshipType.ASSOCIATED_TOPIC,
        id,
        topicNode,
      );
    }
    for (const questionId of page.questionIds) {
      const questionNode = websiteChildEntityId(
        profile.id,
        "question",
        questionId,
      );
      await graph.upsertEntity({
        id: questionNode,
        type: WebsiteIntelligenceEntityType.QuestionRef,
        properties: { questionId },
      });
      await link(
        graph,
        `page:${page.id}->question:${questionId}`,
        WebsiteIntelligenceRelationshipType.ASSOCIATED_QUESTION,
        id,
        questionNode,
      );
    }
  }

  for (const section of profile.sections) {
    const id = websiteChildEntityId(profile.id, "section", section.id);
    await graph.upsertEntity({
      id,
      type: WebsiteIntelligenceEntityType.PageSection,
      properties: { ...section },
    });
    const owner = profile.pages.find((page) =>
      page.sectionIds.includes(section.id),
    );
    if (owner) {
      await link(
        graph,
        `page:${owner.id}->section:${section.id}`,
        WebsiteIntelligenceRelationshipType.HAS_SECTION,
        websiteChildEntityId(profile.id, "page", owner.id),
        id,
      );
    }
  }

  for (const navigation of profile.navigations) {
    const id = websiteChildEntityId(profile.id, "nav", navigation.id);
    await graph.upsertEntity({
      id,
      type: WebsiteIntelligenceEntityType.Navigation,
      properties: {
        name: navigation.name,
        items: navigation.items,
        evidence: navigation.evidence,
      },
    });
    await link(
      graph,
      `${websiteNodeId}->nav:${navigation.id}`,
      WebsiteIntelligenceRelationshipType.HAS_NAVIGATION,
      websiteNodeId,
      id,
    );
    for (const item of navigation.items) {
      if (item.pageId) {
        await link(
          graph,
          `nav:${navigation.id}->page:${item.pageId}`,
          WebsiteIntelligenceRelationshipType.NAV_INCLUDES_PAGE,
          id,
          websiteChildEntityId(profile.id, "page", item.pageId),
        );
      }
    }
  }

  for (const action of profile.conversionActions) {
    const id = websiteChildEntityId(profile.id, "conversion", action.id);
    await graph.upsertEntity({
      id,
      type: WebsiteIntelligenceEntityType.ConversionAction,
      properties: { ...action },
    });
    const owner = profile.pages.find((page) =>
      page.conversionActionIds.includes(action.id),
    );
    if (owner) {
      await link(
        graph,
        `page:${owner.id}->conversion:${action.id}`,
        WebsiteIntelligenceRelationshipType.HAS_CONVERSION_ACTION,
        websiteChildEntityId(profile.id, "page", owner.id),
        id,
      );
    }
  }

  for (const form of profile.forms) {
    const id = websiteChildEntityId(profile.id, "form", form.id);
    await graph.upsertEntity({
      id,
      type: WebsiteIntelligenceEntityType.Form,
      properties: { ...form },
    });
    const owner = profile.pages.find((page) => page.formIds.includes(form.id));
    if (owner) {
      await link(
        graph,
        `page:${owner.id}->form:${form.id}`,
        WebsiteIntelligenceRelationshipType.HAS_FORM,
        websiteChildEntityId(profile.id, "page", owner.id),
        id,
      );
    }
  }

  for (const trust of profile.trustElements) {
    const id = websiteChildEntityId(profile.id, "trust", trust.id);
    await graph.upsertEntity({
      id,
      type: WebsiteIntelligenceEntityType.TrustElement,
      properties: { ...trust },
    });
    const owner = profile.pages.find((page) =>
      page.trustElementIds.includes(trust.id),
    );
    if (owner) {
      await link(
        graph,
        `page:${owner.id}->trust:${trust.id}`,
        WebsiteIntelligenceRelationshipType.HAS_TRUST_ELEMENT,
        websiteChildEntityId(profile.id, "page", owner.id),
        id,
      );
    }
  }

  for (const asset of profile.assets) {
    const id = websiteChildEntityId(profile.id, "asset", asset.id);
    await graph.upsertEntity({
      id,
      type: WebsiteIntelligenceEntityType.WebsiteAsset,
      properties: { ...asset },
    });
    const owner = profile.pages.find((page) => page.assetIds.includes(asset.id));
    if (owner) {
      await link(
        graph,
        `page:${owner.id}->asset:${asset.id}`,
        WebsiteIntelligenceRelationshipType.HAS_ASSET,
        websiteChildEntityId(profile.id, "page", owner.id),
        id,
      );
    }
  }

  for (const snapshot of profile.snapshots) {
    const id = websiteChildEntityId(profile.id, "snapshot", snapshot.id);
    await graph.upsertEntity({
      id,
      type: WebsiteIntelligenceEntityType.WebsiteSnapshot,
      properties: { ...snapshot },
    });
    await link(
      graph,
      `${websiteNodeId}->snapshot:${snapshot.id}`,
      WebsiteIntelligenceRelationshipType.HAS_SNAPSHOT,
      websiteNodeId,
      id,
    );
  }
}
