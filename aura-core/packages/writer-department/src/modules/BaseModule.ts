import type { WriterModuleId } from '../types/index.js';
import type { ModuleResponse } from '../types/interfaces.js';

export abstract class BaseModule<TInput = unknown, TOutput = unknown> {
  abstract readonly moduleId: WriterModuleId;

  abstract execute(input: TInput): ModuleResponse<TOutput>;

  protected createResponse(
    operation: string,
    success: boolean,
    payload: TOutput,
    correlationId: string,
    errors?: string[],
  ): ModuleResponse<TOutput> {
    return {
      moduleId: this.moduleId,
      operation,
      success,
      payload,
      errors,
      correlationId,
      timestamp: new Date().toISOString(),
    };
  }

  protected generateCorrelationId(): string {
    return `${this.moduleId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}
