import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { FilePromptFramework } from "../../../packages/ai/dist/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

describe("FilePromptFramework", () => {
  it("loads per-engine prompt.md", async () => {
    const framework = new FilePromptFramework();
    framework.registerPromptRoot(
      "business-discovery",
      path.join(repoRoot, "services/business-discovery/prompts"),
    );

    const result = await framework.loadPrompt("business-discovery");
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.match(result.value.content, /Business Discovery/);
      assert.equal(result.value.engine, "business-discovery");
    }
  });
});
