const ALLOWED_PERMISSIONS = new Set(["read", "prepare", "communicate", "modify"]);

export function validateEngineContract(engine) {
  const missing = [];
  if (!engine || typeof engine !== "object") missing.push("engine");
  if (!engine?.id) missing.push("id");
  if (!engine?.name) missing.push("name");
  if (!engine?.version) missing.push("version");
  if (typeof engine?.healthCheck !== "function") missing.push("healthCheck()");
  if (typeof engine?.getTools !== "function") missing.push("getTools()");
  if (typeof engine?.executeTool !== "function") missing.push("executeTool()");

  if (missing.length) {
    throw new Error(`Invalid engine contract: missing ${missing.join(", ")}`);
  }
}

export function validateToolDefinition(tool) {
  const missing = [];
  if (!tool || typeof tool !== "object") missing.push("tool");
  if (!tool?.id) missing.push("id");
  if (!tool?.engineId) missing.push("engineId");
  if (!tool?.name) missing.push("name");
  if (!tool?.description) missing.push("description");
  if (!ALLOWED_PERMISSIONS.has(tool?.permission)) missing.push("permission");
  if (typeof tool?.confirmationRequired !== "boolean") missing.push("confirmationRequired");
  if (!Object.prototype.hasOwnProperty.call(tool || {}, "inputSchema")) missing.push("inputSchema");
  if (!Object.prototype.hasOwnProperty.call(tool || {}, "outputSchema")) missing.push("outputSchema");
  if (!tool?.version) missing.push("version");

  if (missing.length) {
    throw new Error(`Invalid tool definition: missing/invalid ${missing.join(", ")}`);
  }
}

export function ensureResultEnvelope(result, engineId, toolId) {
  if (!result || typeof result !== "object") {
    return {
      success: false,
      error: {
        code: "INVALID_RESULT_ENVELOPE",
        message: "Tool returned an invalid result envelope",
        retryable: false,
      },
      metadata: {
        engineId,
        toolId,
        durationMs: 0,
      },
    };
  }

  if (typeof result.success !== "boolean") {
    return {
      success: false,
      error: {
        code: "INVALID_RESULT_ENVELOPE",
        message: "Tool result is missing success boolean",
        retryable: false,
      },
      metadata: {
        engineId,
        toolId,
        durationMs: Number(result?.metadata?.durationMs) || 0,
      },
    };
  }

  if (!result.metadata || typeof result.metadata !== "object") {
    result.metadata = { engineId, toolId, durationMs: 0 };
  } else {
    result.metadata.engineId = result.metadata.engineId || engineId;
    result.metadata.toolId = result.metadata.toolId || toolId;
    result.metadata.durationMs = Number(result.metadata.durationMs) || 0;
  }

  return result;
}
