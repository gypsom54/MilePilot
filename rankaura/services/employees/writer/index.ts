export { WRITER_CONFIG } from "@/services/employees/writer/config";
export { writerService } from "@/services/employees/writer/writerService";
export type { WriterService } from "@/services/employees/writer/types";

export { writerDepartmentOrchestrator } from "@/services/employees/writer/orchestrator";
export type {
  IWriterDepartmentOrchestrator,
  WriterBriefInput,
  WriterDepartmentResult,
} from "@/services/employees/writer/orchestrator";

export type * from "@/services/employees/writer/models";
export { draftLifecycle } from "@/services/employees/writer/lifecycle";
export { reviewPipeline } from "@/services/employees/writer/pipeline";
