import type {
  AuraCoreRequest,
  AuraCoreResponse,
  ContentBrief,
  IWriterDepartmentOrchestrator,
} from '../types/interfaces.js';
import { WriterDepartmentOrchestrator } from './WriterDepartmentOrchestrator.js';

/**
 * Bridge between AuraCore and the Writer Department.
 * AuraCore MUST communicate only through this bridge.
 */
export class AuraCoreBridge {
  private readonly orchestrator: IWriterDepartmentOrchestrator;

  constructor(orchestrator?: IWriterDepartmentOrchestrator) {
    this.orchestrator = orchestrator ?? new WriterDepartmentOrchestrator();
  }

  handleRequest(request: AuraCoreRequest): AuraCoreResponse {
    try {
      switch (request.type) {
        case 'submit_brief': {
          const brief = request.payload as ContentBrief;
          const report = this.orchestrator.submitBrief(brief);
          return this.respond(request, 'acknowledged', { reportId: report.id, briefId: brief.id });
        }
        case 'get_status': {
          const { briefId } = request.payload as { briefId: string };
          const lifecycle = this.orchestrator.getLifecycle(briefId);
          return this.respond(request, 'status', { lifecycle });
        }
        case 'get_report': {
          const { briefId } = request.payload as { briefId: string };
          const report = this.orchestrator.getReport(briefId);
          return this.respond(request, 'report', { report });
        }
        case 'cancel':
          return this.respond(request, 'acknowledged', { cancelled: true });
        default:
          return this.error(request, `Unknown request type: ${request.type}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return this.error(request, message);
    }
  }

  private respond(
    request: AuraCoreRequest,
    type: AuraCoreResponse['type'],
    payload: unknown,
  ): AuraCoreResponse {
    return {
      type,
      requestId: request.requestId,
      payload,
      timestamp: new Date().toISOString(),
    };
  }

  private error(request: AuraCoreRequest, message: string): AuraCoreResponse {
    return {
      type: 'error',
      requestId: request.requestId,
      payload: { message },
      timestamp: new Date().toISOString(),
    };
  }
}
