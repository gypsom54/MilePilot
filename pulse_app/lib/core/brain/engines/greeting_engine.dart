import 'package:pulse_app/core/brain/models/pulse_context.dart';
import 'package:pulse_app/core/brain/models/pulse_memory.dart';
import 'package:pulse_app/core/brain/models/pulse_recommendations.dart';

/// Rule-based greeting decisions — no AI, pure context.
class GreetingEngine {
  const GreetingEngine();

  PulseGreetingDecision decide(PulseMemory memory, DateTime now) {
    final name = memory.displayName;

    if (_isBirthday(memory, now)) {
      return PulseGreetingDecision(
        line: 'Happy birthday $name 🎂',
        welcomeLine: 'Today is yours.',
        subtitleLine: 'Everything is ready whenever you are.',
        reason: PulseRecommendationReason.birthday,
      );
    }

    if (_isAnniversary(memory, now)) {
      final years = now.year - memory.joinedAt!.year;
      return PulseGreetingDecision(
        line: years <= 1
            ? 'Happy Pulse anniversary $name'
            : 'Happy $years years with Pulse $name',
        welcomeLine: 'Welcome home.',
        subtitleLine: 'Thank you for being here.',
        reason: PulseRecommendationReason.anniversary,
      );
    }

    return switch (now.dayPhase) {
      DayPhase.morning => PulseGreetingDecision(
          line: 'Good morning $name ☀️',
          welcomeLine: 'Welcome home.',
          subtitleLine: 'Everything is ready.',
          reason: PulseRecommendationReason.morning,
        ),
      DayPhase.afternoon => PulseGreetingDecision(
          line: 'Good afternoon $name',
          welcomeLine: 'Welcome home.',
          subtitleLine: 'Everything is ready.',
          reason: PulseRecommendationReason.standard,
        ),
      DayPhase.evening => PulseGreetingDecision(
          line: 'Good evening $name',
          welcomeLine: 'Welcome home.',
          subtitleLine: _eveningSubtitle(memory),
          reason: PulseRecommendationReason.evening,
        ),
      DayPhase.night => PulseGreetingDecision(
          line: 'Hello $name',
          welcomeLine: 'Welcome home.',
          subtitleLine: 'Take your time.',
          reason: PulseRecommendationReason.evening,
        ),
    };
  }

  String _eveningSubtitle(PulseMemory memory) {
    if (memory.streaks.currentStreak >= 3) {
      return 'You\'ve been consistent. That matters.';
    }
    return 'A calm evening awaits.';
  }

  bool _isBirthday(PulseMemory memory, DateTime now) {
    final bday = memory.birthday;
    if (bday == null) return false;
    return bday.month == now.month && bday.day == now.day;
  }

  bool _isAnniversary(PulseMemory memory, DateTime now) {
    final joined = memory.joinedAt;
    if (joined == null) return false;
    return joined.month == now.month &&
        joined.day == now.day &&
        joined.year < now.year;
  }
}

class PulseGreetingDecision {
  const PulseGreetingDecision({
    required this.line,
    required this.welcomeLine,
    required this.subtitleLine,
    required this.reason,
  });

  final String line;
  final String welcomeLine;
  final String subtitleLine;
  final PulseRecommendationReason reason;
}
