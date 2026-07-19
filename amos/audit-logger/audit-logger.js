function redact(text) {
  return String(text || "")
    .replace(/(bearer\s+)[a-z0-9\-_.]+/gi, "$1[REDACTED]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]");
}

export class AuditLogger {
  constructor({ logger } = {}) {
    this.logger = logger || console;
    this.records = [];
  }

  write(record) {
    const sanitized = {
      ...record,
      requestText: redact(record.requestText),
    };
    this.records.push(sanitized);
    this.logger.info?.("[AMOS][Audit]", sanitized);
    return sanitized;
  }

  list() {
    return [...this.records];
  }
}
