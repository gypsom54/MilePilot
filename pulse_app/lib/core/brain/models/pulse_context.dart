/// Where the Brain is being asked to think — extensible for any surface.
enum PulseSurface {
  home,
  cabinet,
  learn,
  journal,
  pulse,
  onboarding,
  notification,
}

/// Context passed to every decision — time, surface, optional hints.
class PulseContext {
  const PulseContext({
    required this.now,
    required this.surface,
    this.hints = const {},
  });

  final DateTime now;
  final PulseSurface surface;
  final Map<String, String> hints;

  PulseContext copyWith({
    DateTime? now,
    PulseSurface? surface,
    Map<String, String>? hints,
  }) {
    return PulseContext(
      now: now ?? this.now,
      surface: surface ?? this.surface,
      hints: hints ?? this.hints,
    );
  }
}

enum DayPhase { morning, afternoon, evening, night }

extension DayPhaseFromTime on DateTime {
  DayPhase get dayPhase {
    final h = hour;
    if (h >= 5 && h < 12) return DayPhase.morning;
    if (h >= 12 && h < 17) return DayPhase.afternoon;
    if (h >= 17 && h < 22) return DayPhase.evening;
    return DayPhase.night;
  }

  bool isSameDayAs(DateTime other) {
    return year == other.year && month == other.month && day == other.day;
  }
}
