import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST,
  createKnowledgeGraphRuntime,
} from "../../../services/knowledge-graph-engine/dist/index.js";

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith(".ts")) out.push(full);
  }
  return out;
}

describe("Knowledge Graph Engine contract", () => {
  it("publishes canonical-memory capability manifest without excluded domains", () => {
    assert.equal(KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST.engine.id, "knowledge-graph");
    const blob = JSON.stringify(KNOWLEDGE_GRAPH_CAPABILITY_MANIFEST);
    for (const banned of [
      "seo_scoring",
      "ranking",
      "content_generation",
      "dashboard",
      "opportunity_scoring",
      "ask_orchestration",
      "crawl_logic",
    ]) {
      assert.equal(blob.includes(banned), false, banned);
    }
  });

  it("recommend() refuses strategy and SEO recommendations", async () => {
    const runtime = createKnowledgeGraphRuntime();
    const result = await runtime.engine.recommend({
      intent: "score opportunities and recommend SEO fixes",
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error.code, "ENGINE_DOES_NOT_RECOMMEND");
    }
  });

  it("health lists excluded automatic merges and domain logics", async () => {
    const runtime = createKnowledgeGraphRuntime();
    const health = await runtime.engine.health();
    const excluded = health.details?.excluded ?? [];
    for (const item of [
      "seo_logic",
      "crawl_logic",
      "recommendations",
      "opportunity_scoring",
      "dashboards",
      "ask_orchestration",
      "automatic_ai_merges",
    ]) {
      assert.ok(excluded.includes(item), item);
    }
  });

  it("source tree contains no automatic AI merge or SEO domain logic", () => {
    const root = join(process.cwd(), "services/knowledge-graph-engine/src");
    const files = walk(root);
    const banned = [
      /autoMerge\s*\(/,
      /automaticMerge/,
      /seoScore/,
      /recommendSeo/,
      /opportunityScore/,
      /from\s+["']playwright["']/,
    ];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const pattern of banned) {
        assert.equal(pattern.test(text), false, `${file} ${pattern}`);
      }
    }
  });
});
