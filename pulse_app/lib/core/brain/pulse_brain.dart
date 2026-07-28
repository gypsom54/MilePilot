import 'package:flutter/foundation.dart';
import 'package:pulse_app/core/brain/engines/home_recommendation_engine.dart';
import 'package:pulse_app/core/brain/models/pulse_context.dart';
import 'package:pulse_app/core/brain/models/pulse_memory.dart';
import 'package:pulse_app/core/brain/models/pulse_recommendations.dart';
import 'package:pulse_app/core/brain/storage/pulse_brain_store.dart';
import 'package:pulse_app/core/brain/storage/shared_preferences_pulse_brain_store.dart';
import 'package:pulse_app/widgets/pulse_bottom_nav.dart';

/// Pulse Brain — decision engine, not AI.
///
/// Remembers. Decides. Recommends.
///
/// Future AI integrates via [PulseAdvisoryLayer] without replacing memory
/// or rule-based fallbacks.
class PulseBrain extends ChangeNotifier {
  PulseBrain._(this._store);

  static PulseBrain? _instance;

  static PulseBrain get instance {
    assert(_instance != null, 'Call PulseBrain.initialize() first');
    return _instance!;
  }

  static bool get isInitialized => _instance != null;

  static Future<PulseBrain> initialize({
    PulseBrainStore? store,
    PulseAdvisoryLayer? advisoryLayer,
  }) async {
    final resolvedStore = store ?? await SharedPreferencesPulseBrainStore.create();
    final brain = PulseBrain._(resolvedStore);
    brain.advisoryLayer = advisoryLayer;
    await brain._load();
    _instance = brain;
    return brain;
  }

  @visibleForTesting
  static Future<PulseBrain> initializeForTest({PulseMemory? seed}) async {
    final store = InMemoryPulseBrainStore();
    if (seed != null) await store.save(seed);
    return initialize(store: store);
  }

  @visibleForTesting
  static void resetForTest() {
    _instance = null;
  }

  final PulseBrainStore _store;
  final HomeRecommendationEngine _homeEngine = const HomeRecommendationEngine();
  final PlaceholderRecommendationEngine _placeholderEngine =
      const PlaceholderRecommendationEngine();

  PulseAdvisoryLayer? advisoryLayer;
  PulseMemory _memory = PulseMemory.empty();

  PulseMemory get memory => _memory;

  Future<void> _load() async {
    _memory = await _store.load() ?? PulseMemory.empty();
    if (_memory.joinedAt == null) {
      _memory = _memory.copyWith(joinedAt: DateTime.now());
      await _persist();
    }
    notifyListeners();
  }

  Future<void> _persist() async {
    await _store.save(_memory);
    notifyListeners();
  }

  // ——— Remember ———

  Future<void> setFirstName(String name) async {
    _memory = _memory.copyWith(firstName: name.trim());
    await _persist();
  }

  Future<void> completeOnboarding({String? firstName}) async {
    _memory = _memory.copyWith(
      firstName: firstName ?? _memory.firstName,
      onboardingComplete: true,
      joinedAt: _memory.joinedAt ?? DateTime.now(),
    );
    await recordActivity();
    await recordMilestone('onboarding_complete', 'Joined Pulse');
    await _persist();
  }

  Future<void> recordOnboardingChoice(String key, String value) async {
    final choices = Map<String, String>.from(_memory.onboardingChoices);
    choices[key] = value;
    _memory = _memory.copyWith(onboardingChoices: choices);
    await _persist();
  }

  Future<void> setFavouriteLearningType(String type) async {
    _memory = _memory.copyWith(favouriteLearningType: type.trim());
    await _persist();
  }

  Future<void> setReminderPreferences(ReminderPreferences preferences) async {
    _memory = _memory.copyWith(reminderPreferences: preferences);
    await _persist();
  }

  Future<void> recordMilestone(String id, String label) async {
    if (_memory.milestones.any((m) => m.id == id)) return;
    final updated = [
      ..._memory.milestones,
      Milestone(id: id, label: label, achievedAt: DateTime.now()),
    ];
    _memory = _memory.copyWith(milestones: updated);
    await _persist();
  }

  Future<void> recordActivity({DateTime? when}) async {
    final now = when ?? DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final last = _memory.streaks.lastActiveDate;

    if (last != null && last.isSameDayAs(today)) return;

    var current = _memory.streaks.currentStreak;
    if (last != null) {
      final yesterday = today.subtract(const Duration(days: 1));
      final lastDay = DateTime(last.year, last.month, last.day);
      current = lastDay == yesterday ? current + 1 : 1;
    } else {
      current = 1;
    }

    final longest = current > _memory.streaks.longestStreak
        ? current
        : _memory.streaks.longestStreak;

    _memory = _memory.copyWith(
      streaks: _memory.streaks.copyWith(
        currentStreak: current,
        longestStreak: longest,
        lastActiveDate: today,
      ),
    );
    await _persist();
  }

  Future<void> addFavouriteCompound(String compound) async {
    final trimmed = compound.trim();
    if (trimmed.isEmpty || _memory.favouriteCompounds.contains(trimmed)) return;
    _memory = _memory.copyWith(
      favouriteCompounds: [..._memory.favouriteCompounds, trimmed],
    );
    await _persist();
  }

  Future<void> removeFavouriteCompound(String compound) async {
    _memory = _memory.copyWith(
      favouriteCompounds:
          _memory.favouriteCompounds.where((c) => c != compound).toList(),
    );
    await _persist();
  }

  Future<void> setBirthday(DateTime date) async {
    _memory = _memory.copyWith(birthday: date);
    await _persist();
  }

  // ——— Recommend ———

  Future<PulseHomeRecommendations> homeRecommendations({
    DateTime? now,
  }) async {
    final context = PulseContext(
      now: now ?? DateTime.now(),
      surface: PulseSurface.home,
    );
    final base = _homeEngine.build(_memory, context);
    final refined = await advisoryLayer?.refineHome(base, context);
    return refined ?? base;
  }

  Future<PulsePlaceholderRecommendations> placeholderRecommendations(
    PulseNavTab tab, {
    DateTime? now,
  }) async {
    final surface = _surfaceForTab(tab);
    final context = PulseContext(now: now ?? DateTime.now(), surface: surface);
    final base = _placeholderEngine.build(surface, _memory);
    final refined = await advisoryLayer?.refinePlaceholder(base, context);
    return refined ?? base;
  }

  PulseSurface _surfaceForTab(PulseNavTab tab) {
    return switch (tab) {
      PulseNavTab.home => PulseSurface.home,
      PulseNavTab.cabinet => PulseSurface.cabinet,
      PulseNavTab.learn => PulseSurface.learn,
      PulseNavTab.journal => PulseSurface.journal,
      PulseNavTab.pulse => PulseSurface.pulse,
    };
  }

  // ——— Future hooks (stubs for upcoming engines) ———

  /// When to nudge the user — rule-based until notification engine ships.
  DateTime? suggestedNextNotificationTime({DateTime? now}) {
    final prefs = _memory.reminderPreferences;
    if (!prefs.enabled) return null;
    final current = now ?? DateTime.now();
    if (current.dayPhase == DayPhase.morning) {
      return DateTime(
        current.year,
        current.month,
        current.day,
        prefs.eveningHour,
        prefs.eveningMinute,
      );
    }
    return DateTime(
      current.year,
      current.month,
      current.day + 1,
      prefs.morningHour,
      prefs.morningMinute,
    );
  }
}
