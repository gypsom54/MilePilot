import 'package:flutter_test/flutter_test.dart';
import 'package:pulse_app/core/brain/models/pulse_memory.dart';
import 'package:pulse_app/core/brain/pulse_brain.dart';

void main() {
  tearDown(PulseBrain.resetForTest);

  test('remembers name and onboarding choices', () async {
    final brain = await PulseBrain.initializeForTest();
    await brain.setFirstName('Jonathan');
    await brain.recordOnboardingChoice('learning_style', 'visual');
    await brain.completeOnboarding();

    expect(brain.memory.firstName, 'Jonathan');
    expect(brain.memory.onboardingComplete, isTrue);
    expect(brain.memory.onboardingChoices['learning_style'], 'visual');
    expect(brain.memory.streaks.currentStreak, 1);
  });

  test('home recommendations use remembered name', () async {
    final brain = await PulseBrain.initializeForTest(
      seed: const PulseMemory(firstName: 'Jonathan', onboardingComplete: true),
    );

    final rec = await brain.homeRecommendations(
      now: DateTime(2026, 6, 29, 9),
    );

    expect(rec.greetingLine, contains('Jonathan'));
    expect(rec.cards, hasLength(4));
    expect(rec.primaryCta.label, 'Add your first research item');
  });

  test('favourite compounds change cabinet copy', () async {
    final brain = await PulseBrain.initializeForTest(
      seed: const PulseMemory(
        firstName: 'Jonathan',
        favouriteCompounds: ['BPC-157'],
      ),
    );

    final rec = await brain.homeRecommendations();
    final cabinet = rec.cards.firstWhere((c) => c.id == 'cabinet');
    expect(cabinet.subtitle, contains('favourites'));
  });
}
