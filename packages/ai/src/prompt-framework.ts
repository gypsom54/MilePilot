import { readFile } from "node:fs/promises";
import path from "node:path";
import type { EngineResult } from "@seo-autopilot/shared";
import { err, ok } from "@seo-autopilot/shared";

/**
 * AI Prompt Framework — every engine owns its own prompt.
 * Not one giant AI prompt.
 *
 * Layout:
 *   services/<engine>/prompts/prompt.md
 */

export interface EnginePrompt {
  engine: string;
  version: string;
  content: string;
  path: string;
}

export interface PromptFramework {
  /**
   * Load an engine's prompt.md (versioned & replaceable).
   */
  loadPrompt(engine: string, version?: string): Promise<EngineResult<EnginePrompt>>;

  /**
   * Register a prompt root for an engine (absolute or relative directory
   * that contains prompt.md).
   */
  registerPromptRoot(engine: string, directory: string): void;
}

export class FilePromptFramework implements PromptFramework {
  private readonly roots = new Map<string, string>();

  registerPromptRoot(engine: string, directory: string): void {
    this.roots.set(engine, directory);
  }

  async loadPrompt(
    engine: string,
    version = "0.1.0",
  ): Promise<EngineResult<EnginePrompt>> {
    const root = this.roots.get(engine);
    if (!root) {
      return err({
        code: "PROMPT_ROOT_NOT_REGISTERED",
        message: `No prompt root registered for engine: ${engine}`,
        retryable: false,
      });
    }

    const promptPath = path.join(root, "prompt.md");
    try {
      const content = await readFile(promptPath, "utf8");
      return ok({
        engine,
        version,
        content,
        path: promptPath,
      });
    } catch (cause) {
      return err({
        code: "PROMPT_LOAD_FAILED",
        message: `Failed to load prompt for ${engine} at ${promptPath}`,
        retryable: false,
        details: {
          cause: cause instanceof Error ? cause.message : String(cause),
        },
      });
    }
  }
}
