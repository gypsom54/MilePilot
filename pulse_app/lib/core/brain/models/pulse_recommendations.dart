import 'package:pulse_app/core/brain/models/pulse_context.dart';

/// UI-facing recommendations — widgets render these, never invent copy.
class PulseHomeRecommendations {
  const PulseHomeRecommendations({
    required this.greetingLine,
    required this.welcomeLine,
    required this.subtitleLine,
    required this.cards,
    required this.primaryCta,
    this.reason = PulseRecommendationReason.standard,
  });

  final String greetingLine;
  final String welcomeLine;
  final String subtitleLine;
  final List<PulseCardRecommendation> cards;
  final PulseCtaRecommendation primaryCta;
  final PulseRecommendationReason reason;
}

class PulsePlaceholderRecommendations {
  const PulsePlaceholderRecommendations({
    required this.title,
    required this.subtitle,
  });

  final String title;
  final String subtitle;
}

class PulseCardRecommendation {
  const PulseCardRecommendation({
    required this.id,
    required this.title,
    required this.subtitle,
    this.action,
    this.priority = 0,
  });

  final String id;
  final String title;
  final String subtitle;
  final String? action;
  final int priority;
}

class PulseCtaRecommendation {
  const PulseCtaRecommendation({
    required this.label,
    this.action,
    this.enabled = true,
  });

  final String label;
  final String? action;
  final bool enabled;
}

/// Why the Brain chose this recommendation — useful for future AI audit trails.
enum PulseRecommendationReason {
  standard,
  morning,
  evening,
  birthday,
  anniversary,
  streak,
  emptyCabinet,
  learningPreference,
}

/// Future AI layer returns refined recommendations; null keeps rule-based output.
abstract class PulseAdvisoryLayer {
  Future<PulseHomeRecommendations?> refineHome(
    PulseHomeRecommendations base,
    PulseContext context,
  );

  Future<PulsePlaceholderRecommendations?> refinePlaceholder(
    PulsePlaceholderRecommendations base,
    PulseContext context,
  );
}
