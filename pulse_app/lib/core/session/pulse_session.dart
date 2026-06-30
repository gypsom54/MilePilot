/// Lightweight session state — name and onboarding completion.
abstract final class PulseSession {
  static String? firstName;
  static bool onboardingComplete = false;

  static void completeOnboarding(String name) {
    firstName = name.trim();
    onboardingComplete = true;
  }

  static String get displayName => firstName?.isNotEmpty == true ? firstName! : 'friend';

  static String timeGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  /// Human greeting line — emoji only in the morning, calm otherwise.
  static String greetingLine(String name) {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning $name ☀️';
    if (hour < 17) return 'Good afternoon $name';
    return 'Good evening $name';
  }
}
