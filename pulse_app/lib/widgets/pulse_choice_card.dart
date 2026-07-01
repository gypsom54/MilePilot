import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';
import 'package:pulse_app/widgets/pulse_glow.dart';

/// Selectable onboarding card — single choice from a list.
class PulseChoiceCard extends StatelessWidget {
  const PulseChoiceCard({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
    this.staggerIndex = 0,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;
  final int staggerIndex;

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: Duration(milliseconds: 280 + staggerIndex * 60),
      curve: PulseMotion.fade,
      builder: (context, value, child) {
        return Opacity(
          opacity: value,
          child: Transform.translate(
            offset: Offset(0, (1 - value) * 8),
            child: child,
          ),
        );
      },
      child: Semantics(
        button: true,
        selected: selected,
        label: label,
        child: GestureDetector(
          onTap: onTap,
          child: PulseGlow(
            intensity: selected ? 0.55 : 0.08,
            spread: selected ? 16 : 8,
            animate: false,
            child: AnimatedContainer(
              duration: PulseMotion.fast,
              curve: PulseMotion.fade,
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                color: selected
                    ? PulseColors.cyan.withValues(alpha: 0.12)
                    : PulseColors.white.withValues(alpha: 0.05),
                border: Border.all(
                  color: selected
                      ? PulseColors.cyan.withValues(alpha: 0.45)
                      : PulseColors.white.withValues(alpha: 0.1),
                  width: selected ? 1.5 : 1,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      label,
                      style: PulseTypography.body(
                        size: 16,
                        weight: selected ? FontWeight.w600 : FontWeight.w400,
                        color: selected ? PulseColors.white : PulseColors.whiteSoft,
                      ),
                    ),
                  ),
                  AnimatedOpacity(
                    duration: PulseMotion.fast,
                    opacity: selected ? 1 : 0,
                    child: Icon(
                      Icons.check_circle_rounded,
                      color: PulseColors.cyan,
                      size: 22,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
