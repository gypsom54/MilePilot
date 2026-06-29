/// Data models for the reusable Pulse conversation engine.
library;

class ConversationScript {
  const ConversationScript({
    required this.id,
    required this.steps,
  });

  final String id;
  final List<ConversationStep> steps;

  factory ConversationScript.fromJson(Map<String, dynamic> json) {
    return ConversationScript(
      id: json['id'] as String,
      steps: (json['steps'] as List<dynamic>)
          .map((e) => ConversationStep.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

enum ConversationStepType { typing, pause, fade, input, button, logo }

class ConversationStep {
  const ConversationStep({
    required this.type,
    this.lines,
    this.durationMs,
    this.inputKey,
    this.placeholder,
    this.label,
    this.action,
    this.branch,
    this.charDelayMs = 42,
    this.charDelayVariance = 0.15,
  });

  final ConversationStepType type;
  final List<ConversationLine>? lines;
  final int? durationMs;
  final String? inputKey;
  final String? placeholder;
  final String? label;
  final String? action;
  final Map<String, String>? branch;
  final int charDelayMs;
  final double charDelayVariance;

  factory ConversationStep.fromJson(Map<String, dynamic> json) {
    final typeName = json['type'] as String;
    return ConversationStep(
      type: ConversationStepType.values.firstWhere(
        (t) => t.name == typeName,
        orElse: () => ConversationStepType.typing,
      ),
      lines: (json['lines'] as List<dynamic>?)
          ?.map((e) => ConversationLine.fromJson(e as Map<String, dynamic>))
          .toList(),
      durationMs: json['durationMs'] as int?,
      inputKey: json['inputKey'] as String?,
      placeholder: json['placeholder'] as String?,
      label: json['label'] as String?,
      action: json['action'] as String?,
      branch: (json['branch'] as Map<String, dynamic>?)?.map(
        (k, v) => MapEntry(k, v as String),
      ),
      charDelayMs: json['charDelayMs'] as int? ?? 42,
      charDelayVariance: (json['charDelayVariance'] as num?)?.toDouble() ?? 0.15,
    );
  }
}

class ConversationLine {
  const ConversationLine({
    required this.text,
    this.pauseAfterMs = 680,
  });

  final String text;
  final int pauseAfterMs;

  factory ConversationLine.fromJson(Map<String, dynamic> json) {
    return ConversationLine(
      text: json['text'] as String,
      pauseAfterMs: json['pauseAfterMs'] as int? ?? 680,
    );
  }

  String interpolate(Map<String, String> variables) {
    var result = text;
    for (final entry in variables.entries) {
      result = result.replaceAll('{{${entry.key}}}', entry.value);
    }
    return result;
  }
}
