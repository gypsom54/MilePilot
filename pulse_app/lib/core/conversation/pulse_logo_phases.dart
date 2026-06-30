/// Maps a single 0→1 timeline into logo animation phases.
/// Heartbeat draws → bends into P → ULSE → glow → tagline.
abstract final class PulseLogoPhases {
  static double heartbeatDraw(double t) =>
      (t / 0.36).clamp(0.0, 1.0);

  static double morphToP(double t) =>
      ((t - 0.30) / 0.20).clamp(0.0, 1.0);

  static double letters(double t) =>
      ((t - 0.48) / 0.20).clamp(0.0, 1.0);

  static double glow(double t) =>
      ((t - 0.66) / 0.18).clamp(0.0, 1.0);

  static double tagline(double t) =>
      ((t - 0.76) / 0.14).clamp(0.0, 1.0);

  static double lineOpacity(double t) =>
      (1.0 - morphToP(t)).clamp(0.0, 1.0);

  /// In-conversation heartbeat — draw and bend without full wordmark.
  static double logoProgressAt(double t) =>
      (t * 0.40).clamp(0.0, 0.40);
}
