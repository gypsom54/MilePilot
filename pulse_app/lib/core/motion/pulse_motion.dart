import 'package:flutter/material.dart';

/// Central motion system — fade, glide, breathe. Never bounce, snap, or spin.
///
/// Pulse development principles:
/// Optimise for delight, not speed.
/// Choose the calmer, simpler, more elegant solution.
/// Technology should disappear. The experience should feel human.
abstract final class PulseMotion {
  // Durations
  static const Duration instant = Duration(milliseconds: 120);
  static const Duration fast = Duration(milliseconds: 280);
  static const Duration medium = Duration(milliseconds: 500);
  static const Duration slow = Duration(milliseconds: 800);
  static const Duration glide = Duration(milliseconds: 1100);
  static const Duration cinematic = Duration(milliseconds: 1400);
  static const Duration launch = Duration(milliseconds: 5200);
  static const Duration glowCycle = Duration(milliseconds: 3080);

  // Curves
  static const Curve fade = Curves.easeOutCubic;
  static const Curve glideIn = Curves.easeOutCubic;
  static const Curve breathe = Curves.easeInOutSine;
  static const Curve draw = Curves.easeInOutSine;

  // Spacing
  static const double screenPadding = 32;
  static const double sectionGap = 28;
  static const double lineGap = 16;
  static const double minTouchTarget = 48;

  static bool reducedMotion(BuildContext context) {
    return MediaQuery.disableAnimationsOf(context);
  }

  static Duration adapt(BuildContext context, Duration duration) {
    return reducedMotion(context) ? Duration(milliseconds: duration.inMilliseconds ~/ 4) : duration;
  }

  static double adaptScale(BuildContext context, double value) {
    return reducedMotion(context) ? 1.0 : value;
  }
}
