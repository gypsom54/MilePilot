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

enum ConversationStepType {
  typing,
  pause,
  fade,
  input,
  button,
  logo,
  choice,
  preview,
}

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
    this.choiceKey,
    this.options,
    this.charDelayMs = 42,
    this.charDelayVariance = 0.15,
    this.headingSize,
  });

  final ConversationStepType type;
  final List<ConversationLine>? lines;
  final int? durationMs;
  final String? inputKey;
  final String? placeholder;
  final String? label;
  final String? action;
  final Map<String, String>? branch;
  final String? choiceKey;
  final List<ConversationOption>? options;
  final int charDelayMs;
  final double charDelayVariance;
  final double? headingSize;

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
      choiceKey: json['choiceKey'] as String?,
      options: (json['options'] as List<dynamic>?)
          ?.map((e) => ConversationOption.fromJson(e as Map<String, dynamic>))
          .toList(),
      charDelayMs: json['charDelayMs'] as int? ?? 42,
      charDelayVariance: (json['charDelayVariance'] as num?)?.toDouble() ?? 0.15,
      headingSize: (json['headingSize'] as num?)?.toDouble(),
    );
  }
}

class ConversationOption {
  const ConversationOption({
    required this.id,
    required this.label,
  });

  final String id;
  final String label;

  factory ConversationOption.fromJson(Map<String, dynamic> json) {
    return ConversationOption(
      id: json['id'] as String,
      label: json['label'] as String,
    );
  }
}

class ConversationLine {
  const ConversationLine({
    required this.text,
    this.pauseAfterMs = 680,
    this.style,
  });

  final String text;
  final int pauseAfterMs;
  final String? style;

  factory ConversationLine.fromJson(Map<String, dynamic> json) {
    return ConversationLine(
      text: json['text'] as String,
      pauseAfterMs: json['pauseAfterMs'] as int? ?? 680,
      style: json['style'] as String?,
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
