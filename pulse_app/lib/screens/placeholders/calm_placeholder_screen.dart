import 'package:flutter/material.dart';
import 'package:pulse_app/core/brain/models/pulse_recommendations.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';

/// Quiet space — copy supplied by the Brain.
class CalmPlaceholderScreen extends StatelessWidget {
  const CalmPlaceholderScreen({
    super.key,
    required this.recommendations,
  });

  final PulsePlaceholderRecommendations recommendations;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: PulseMotion.screenPadding),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              recommendations.title,
              textAlign: TextAlign.center,
              style: PulseTypography.heading(size: 26, color: PulseColors.white),
            ),
            const SizedBox(height: 20),
            Text(
              recommendations.subtitle,
              textAlign: TextAlign.center,
              style: PulseTypography.body(color: PulseColors.whiteMuted),
            ),
          ],
        ),
      ),
    );
  }
}
