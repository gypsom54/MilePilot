import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EngineLogCategory,
  StructuredEngineLogger,
} from "../../../packages/shared/dist/index.js";

describe("StructuredEngineLogger", () => {
  it("emits canonical categories", () => {
    /** @type {import("../../../packages/shared/dist/index.js").EngineLogEntry[]} */
    const entries = [];
    const logger = new StructuredEngineLogger("performance", (entry) => {
      entries.push(entry);
    });

    logger.started("begin");
    logger.completed("done");
    logger.failed("boom");
    logger.retry("again");
    logger.learning("note");
    logger.recommendation("try this");
    logger.automation("ran");

    assert.deepEqual(
      entries.map((e) => e.category),
      [
        EngineLogCategory.Started,
        EngineLogCategory.Completed,
        EngineLogCategory.Failed,
        EngineLogCategory.Retry,
        EngineLogCategory.Learning,
        EngineLogCategory.Recommendation,
        EngineLogCategory.Automation,
      ],
    );
  });
});
