import 'package:flutter/material.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';

/// Apple-inspired typography — large bold headings, calm supporting text.
abstract final class PulseTypography {
  static const String _fontFamily = '.AppleSystemUIFont';

  static TextStyle display({
    double size = 42,
    FontWeight weight = FontWeight.w700,
    Color color = PulseColors.white,
    double letterSpacing = 6,
  }) {
    return TextStyle(
      fontFamily: _fontFamily,
      fontSize: size,
      fontWeight: weight,
      color: color,
      letterSpacing: letterSpacing,
      height: 1.1,
    );
  }

  static TextStyle heading({
    double size = 28,
    FontWeight weight = FontWeight.w600,
    Color color = PulseColors.white,
  }) {
    return TextStyle(
      fontFamily: _fontFamily,
      fontSize: size,
      fontWeight: weight,
      color: color,
      letterSpacing: -0.3,
      height: 1.25,
    );
  }

  static TextStyle body({
    double size = 17,
    FontWeight weight = FontWeight.w400,
    Color color = PulseColors.whiteSoft,
  }) {
    return TextStyle(
      fontFamily: _fontFamily,
      fontSize: size,
      fontWeight: weight,
      color: color,
      letterSpacing: 0.1,
      height: 1.55,
    );
  }

  static TextStyle caption({
    double size = 14,
    Color color = PulseColors.whiteMuted,
  }) {
    return TextStyle(
      fontFamily: _fontFamily,
      fontSize: size,
      fontWeight: FontWeight.w400,
      color: color,
      letterSpacing: 0.2,
      height: 1.4,
    );
  }

  static TextStyle tagline({Color color = PulseColors.whiteMuted}) {
    return TextStyle(
      fontFamily: _fontFamily,
      fontSize: 15,
      fontWeight: FontWeight.w400,
      color: color,
      letterSpacing: 0.4,
      height: 1.4,
    );
  }
}
