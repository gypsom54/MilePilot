/// Everything Pulse remembers about a person.
class PulseMemory {
  const PulseMemory({
    this.firstName,
    this.onboardingComplete = false,
    this.onboardingChoices = const {},
    this.favouriteLearningType,
    this.reminderPreferences = const ReminderPreferences(),
    this.milestones = const [],
    this.streaks = const StreakState(),
    this.favouriteCompounds = const [],
    this.birthday,
    this.joinedAt,
  });

  final String? firstName;
  final bool onboardingComplete;
  final Map<String, String> onboardingChoices;
  final String? favouriteLearningType;
  final ReminderPreferences reminderPreferences;
  final List<Milestone> milestones;
  final StreakState streaks;
  final List<String> favouriteCompounds;
  final DateTime? birthday;
  final DateTime? joinedAt;

  String get displayName =>
      firstName?.trim().isNotEmpty == true ? firstName!.trim() : 'friend';

  factory PulseMemory.empty() => PulseMemory(joinedAt: DateTime.now());

  PulseMemory copyWith({
    String? firstName,
    bool? onboardingComplete,
    Map<String, String>? onboardingChoices,
    String? favouriteLearningType,
    ReminderPreferences? reminderPreferences,
    List<Milestone>? milestones,
    StreakState? streaks,
    List<String>? favouriteCompounds,
    DateTime? birthday,
    DateTime? joinedAt,
  }) {
    return PulseMemory(
      firstName: firstName ?? this.firstName,
      onboardingComplete: onboardingComplete ?? this.onboardingComplete,
      onboardingChoices: onboardingChoices ?? this.onboardingChoices,
      favouriteLearningType: favouriteLearningType ?? this.favouriteLearningType,
      reminderPreferences: reminderPreferences ?? this.reminderPreferences,
      milestones: milestones ?? this.milestones,
      streaks: streaks ?? this.streaks,
      favouriteCompounds: favouriteCompounds ?? this.favouriteCompounds,
      birthday: birthday ?? this.birthday,
      joinedAt: joinedAt ?? this.joinedAt,
    );
  }

  Map<String, dynamic> toJson() => {
        'firstName': firstName,
        'onboardingComplete': onboardingComplete,
        'onboardingChoices': onboardingChoices,
        'favouriteLearningType': favouriteLearningType,
        'reminderPreferences': reminderPreferences.toJson(),
        'milestones': milestones.map((m) => m.toJson()).toList(),
        'streaks': streaks.toJson(),
        'favouriteCompounds': favouriteCompounds,
        'birthday': birthday?.toIso8601String(),
        'joinedAt': joinedAt?.toIso8601String(),
      };

  factory PulseMemory.fromJson(Map<String, dynamic> json) {
    return PulseMemory(
      firstName: json['firstName'] as String?,
      onboardingComplete: json['onboardingComplete'] as bool? ?? false,
      onboardingChoices: (json['onboardingChoices'] as Map<String, dynamic>?)
              ?.map((k, v) => MapEntry(k, v as String)) ??
          {},
      favouriteLearningType: json['favouriteLearningType'] as String?,
      reminderPreferences: json['reminderPreferences'] != null
          ? ReminderPreferences.fromJson(
              json['reminderPreferences'] as Map<String, dynamic>,
            )
          : const ReminderPreferences(),
      milestones: (json['milestones'] as List<dynamic>?)
              ?.map((e) => Milestone.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      streaks: json['streaks'] != null
          ? StreakState.fromJson(json['streaks'] as Map<String, dynamic>)
          : const StreakState(),
      favouriteCompounds: (json['favouriteCompounds'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      birthday: json['birthday'] != null
          ? DateTime.parse(json['birthday'] as String)
          : null,
      joinedAt: json['joinedAt'] != null
          ? DateTime.parse(json['joinedAt'] as String)
          : null,
    );
  }
}

class ReminderPreferences {
  const ReminderPreferences({
    this.enabled = false,
    this.morningHour = 8,
    this.morningMinute = 0,
    this.eveningHour = 20,
    this.eveningMinute = 0,
  });

  final bool enabled;
  final int morningHour;
  final int morningMinute;
  final int eveningHour;
  final int eveningMinute;

  Map<String, dynamic> toJson() => {
        'enabled': enabled,
        'morningHour': morningHour,
        'morningMinute': morningMinute,
        'eveningHour': eveningHour,
        'eveningMinute': eveningMinute,
      };

  factory ReminderPreferences.fromJson(Map<String, dynamic> json) {
    return ReminderPreferences(
      enabled: json['enabled'] as bool? ?? false,
      morningHour: json['morningHour'] as int? ?? 8,
      morningMinute: json['morningMinute'] as int? ?? 0,
      eveningHour: json['eveningHour'] as int? ?? 20,
      eveningMinute: json['eveningMinute'] as int? ?? 0,
    );
  }

  ReminderPreferences copyWith({
    bool? enabled,
    int? morningHour,
    int? morningMinute,
    int? eveningHour,
    int? eveningMinute,
  }) {
    return ReminderPreferences(
      enabled: enabled ?? this.enabled,
      morningHour: morningHour ?? this.morningHour,
      morningMinute: morningMinute ?? this.morningMinute,
      eveningHour: eveningHour ?? this.eveningHour,
      eveningMinute: eveningMinute ?? this.eveningMinute,
    );
  }
}

class Milestone {
  const Milestone({
    required this.id,
    required this.label,
    required this.achievedAt,
  });

  final String id;
  final String label;
  final DateTime achievedAt;

  Map<String, dynamic> toJson() => {
        'id': id,
        'label': label,
        'achievedAt': achievedAt.toIso8601String(),
      };

  factory Milestone.fromJson(Map<String, dynamic> json) {
    return Milestone(
      id: json['id'] as String,
      label: json['label'] as String,
      achievedAt: DateTime.parse(json['achievedAt'] as String),
    );
  }
}

class StreakState {
  const StreakState({
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.lastActiveDate,
  });

  final int currentStreak;
  final int longestStreak;
  final DateTime? lastActiveDate;

  Map<String, dynamic> toJson() => {
        'currentStreak': currentStreak,
        'longestStreak': longestStreak,
        'lastActiveDate': lastActiveDate?.toIso8601String(),
      };

  factory StreakState.fromJson(Map<String, dynamic> json) {
    return StreakState(
      currentStreak: json['currentStreak'] as int? ?? 0,
      longestStreak: json['longestStreak'] as int? ?? 0,
      lastActiveDate: json['lastActiveDate'] != null
          ? DateTime.parse(json['lastActiveDate'] as String)
          : null,
    );
  }

  StreakState copyWith({
    int? currentStreak,
    int? longestStreak,
    DateTime? lastActiveDate,
  }) {
    return StreakState(
      currentStreak: currentStreak ?? this.currentStreak,
      longestStreak: longestStreak ?? this.longestStreak,
      lastActiveDate: lastActiveDate ?? this.lastActiveDate,
    );
  }
}
