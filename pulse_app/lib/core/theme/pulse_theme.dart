import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';

abstract final class PulseTheme {
  static ThemeData dark() {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: PulseColors.graphite,
      colorScheme: const ColorScheme.dark(
        surface: PulseColors.graphite,
        primary: PulseColors.cyan,
        onPrimary: PulseColors.graphite,
        onSurface: PulseColors.white,
      ),
      textTheme: TextTheme(
        displayLarge: PulseTypography.display(),
        headlineMedium: PulseTypography.heading(),
        bodyLarge: PulseTypography.body(),
        bodyMedium: PulseTypography.body(size: 15),
        labelLarge: PulseTypography.caption(),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: PulseColors.graphiteElevated,
        hintStyle: PulseTypography.body(color: PulseColors.whiteDim),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 24,
          vertical: 20,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(
            color: PulseColors.white.withValues(alpha: 0.08),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(
            color: PulseColors.cyan.withValues(alpha: 0.45),
          ),
        ),
      ),
      useMaterial3: true,
    );
  }

  static void applySystemUI() {
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
        systemNavigationBarColor: PulseColors.graphite,
        systemNavigationBarIconBrightness: Brightness.light,
      ),
    );
  }
}
