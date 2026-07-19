export interface MilePilotEngine {
  id: string;
  name: string;
  version: string;
  healthCheck(): Promise<{ ok: boolean; details?: string }>;
  getTools(): MilePilotToolDefinition[];
  executeTool<T = unknown>(
    toolId: string,
    input: unknown,
    context: ToolExecutionContext
  ): Promise<ToolExecutionResult<T>>;
}

export interface MilePilotToolDefinition {
  id: string;
  engineId: string;
  name: string;
  description: string;
  permission: "read" | "prepare" | "communicate" | "modify";
  confirmationRequired: boolean;
  inputSchema: unknown;
  outputSchema: unknown;
  version: string;
}

export interface ToolExecutionContext {
  workflowId: string;
  requestText: string;
  timestamp: string;
}

export interface ToolExecutionError {
  code: string;
  message: string;
  retryable: boolean;
}

export interface ToolExecutionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: ToolExecutionError;
  metadata: {
    engineId: string;
    toolId: string;
    durationMs: number;
  };
}

export interface RoutedIntent {
  intentId: string;
  confidence: number;
  toolId?: string;
  parameters: Record<string, unknown>;
  requiresClarification: boolean;
}

export interface AmosResponse {
  success: boolean;
  message: string;
  data?: unknown;
  suggestedActions?: string[];
  workflowId: string;
}

export interface AmosAuditRecord {
  workflowId: string;
  timestamp: string;
  requestText: string;
  routedIntent?: string;
  selectedTool?: string;
  engineId?: string;
  status: "success" | "unsupported" | "failed";
  durationMs: number;
  errorCode?: string;
}
