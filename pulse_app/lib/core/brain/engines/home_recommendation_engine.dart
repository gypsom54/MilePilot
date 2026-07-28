import 'package:pulse_app/core/brain/engines/greeting_engine.dart';
import 'package:pulse_app/core/brain/models/pulse_context.dart';
import 'package:pulse_app/core/brain/models/pulse_memory.dart';
import 'package:pulse_app/core/brain/models/pulse_recommendations.dart';

/// Home screen recommendations — cards, CTA, copy.
class HomeRecommendationEngine {
  const HomeRecommendationEngine({GreetingEngine? greetingEngine})
      : _greetingEngine = greetingEngine ?? const GreetingEngine();

  final GreetingEngine _greetingEngine;

  PulseHomeRecommendations build(PulseMemory memory, PulseContext context) {
    final greeting = _greetingEngine.decide(memory, context.now);
    final cards = _cards(memory, context);
    final cta = _primaryCta(memory);

    return PulseHomeRecommendations(
      greetingLine: greeting.line,
      welcomeLine: greeting.welcomeLine,
      subtitleLine: greeting.subtitleLine,
      cards: cards,
      primaryCta: cta,
      reason: greeting.reason,
    );
  }

  List<PulseCardRecommendation> _cards(PulseMemory memory, PulseContext context) {
    final learning = memory.favouriteLearningType;
    final hasCompounds = memory.favouriteCompounds.isNotEmpty;

    final discoverySubtitle = learning != null
        ? 'Something new in $learning, picked for you.'
        : "I've found something interesting for you.";

    final cabinetSubtitle = hasCompounds
        ? 'Your favourites are close at hand.'
        : 'Ready whenever you are.';

    final journalSubtitle = memory.streaks.currentStreak >= 2
        ? '${memory.streaks.currentStreak} days of momentum.'
        : 'Continue your journey.';

    return [
      PulseCardRecommendation(
        id: 'cabinet',
        title: 'Research Cabinet',
        subtitle: cabinetSubtitle,
        action: 'navigate:cabinet',
        priority: hasCompounds ? 1 : 2,
      ),
      PulseCardRecommendation(
        id: 'discovery',
        title: "Today's Discovery",
        subtitle: discoverySubtitle,
        action: 'navigate:learn',
        priority: learning != null ? 2 : 1,
      ),
      PulseCardRecommendation(
        id: 'journal',
        title: 'Research Journal',
        subtitle: journalSubtitle,
        action: 'navigate:journal',
        priority: 3,
      ),
      const PulseCardRecommendation(
        id: 'pulse',
        title: 'Pulse',
        subtitle: 'How can I help today?',
        action: 'navigate:pulse',
        priority: 4,
      ),
    ]..sort((a, b) => a.priority.compareTo(b.priority));
  }

  PulseCtaRecommendation _primaryCta(PulseMemory memory) {
    if (memory.favouriteCompounds.isEmpty) {
      return const PulseCtaRecommendation(
        label: 'Add your first research item',
        action: 'action:add_research_item',
        enabled: true,
      );
    }
    return const PulseCtaRecommendation(
      label: 'Add to your cabinet',
      action: 'action:add_research_item',
      enabled: true,
    );
  }
}

/// Placeholder surfaces — calm copy per tab, context-aware where possible.
class PlaceholderRecommendationEngine {
  const PlaceholderRecommendationEngine();

  PulsePlaceholderRecommendations build(
    PulseSurface surface,
    PulseMemory memory,
  ) {
    return switch (surface) {
      PulseSurface.cabinet => PulsePlaceholderRecommendations(
          title: 'Research Cabinet',
          subtitle: memory.favouriteCompounds.isEmpty
              ? 'Ready whenever you are.'
              : '${memory.favouriteCompounds.length} items you care about.',
        ),
      PulseSurface.learn => PulsePlaceholderRecommendations(
          title: "Today's Discovery",
          subtitle: memory.favouriteLearningType != null
              ? 'Exploring ${memory.favouriteLearningType}.'
              : "I've found something interesting for you.",
        ),
      PulseSurface.journal => const PulsePlaceholderRecommendations(
          title: 'Research Journal',
          subtitle: 'Continue your journey.',
        ),
      PulseSurface.pulse => const PulsePlaceholderRecommendations(
          title: 'Pulse',
          subtitle: 'How can I help today?',
        ),
      _ => const PulsePlaceholderRecommendations(
          title: 'Pulse',
          subtitle: 'Everything is ready.',
        ),
    };
  }
}
