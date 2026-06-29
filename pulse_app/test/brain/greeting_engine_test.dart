import 'package:flutter_test/flutter_test.dart';
import 'package:pulse_app/core/brain/engines/greeting_engine.dart';
import 'package:pulse_app/core/brain/models/pulse_memory.dart';
import 'package:pulse_app/core/brain/models/pulse_recommendations.dart';

void main() {
  const engine = GreetingEngine();

  test('morning greeting includes sun emoji', () {
    final decision = engine.decide(
      const PulseMemory(firstName: 'Jonathan'),
      DateTime(2026, 6, 29, 9),
    );
    expect(decision.line, 'Good morning Jonathan ☀️');
    expect(decision.reason, PulseRecommendationReason.morning);
  });

  test('evening greeting is calm without emoji', () {
    final decision = engine.decide(
      const PulseMemory(firstName: 'Jonathan'),
      DateTime(2026, 6, 29, 19),
    );
    expect(decision.line, 'Good evening Jonathan');
    expect(decision.reason, PulseRecommendationReason.evening);
  });

  test('birthday takes priority', () {
    final decision = engine.decide(
      PulseMemory(
        firstName: 'Jonathan',
        birthday: DateTime(1990, 6, 29),
      ),
      DateTime(2026, 6, 29, 9),
    );
    expect(decision.line, contains('birthday'));
    expect(decision.reason, PulseRecommendationReason.birthday);
  });

  test('anniversary on join date', () {
    final decision = engine.decide(
      PulseMemory(
        firstName: 'Jonathan',
        joinedAt: DateTime(2025, 6, 29),
      ),
      DateTime(2026, 6, 29, 10),
    );
    expect(decision.reason, PulseRecommendationReason.anniversary);
  });
}
