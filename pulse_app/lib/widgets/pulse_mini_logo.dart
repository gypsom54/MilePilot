import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/widgets/pulse_logo.dart';

/// Compact animated Pulse mark — consistent glow and breathe everywhere.
class PulseMiniLogo extends StatefulWidget {
  const PulseMiniLogo({super.key});

  @override
  State<PulseMiniLogo> createState() => _PulseMiniLogoState();
}

class _PulseMiniLogoState extends State<PulseMiniLogo>
    with SingleTickerProviderStateMixin {
  late final AnimationController _breathe;

  @override
  void initState() {
    super.initState();
    _breathe = AnimationController(
      vsync: this,
      duration: PulseMotion.glowCycle,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _breathe.dispose();
    super.dispose();
  }

  double _naturalPulse(double t) =>
      0.5 + 0.5 * (1 + math.sin(t * 10 * math.pi)) / 2;

  @override
  Widget build(BuildContext context) {
    final reduced = PulseMotion.reducedMotion(context);

    if (reduced) {
      return const PulseLogo(
        compact: true,
        showTagline: false,
        sequenceProgress: 0.58,
      );
    }

    return AnimatedBuilder(
      animation: _breathe,
      builder: (context, _) {
        return PulseLogo(
          compact: true,
          showTagline: false,
          sequenceProgress: 0.58,
          logoBreathe: _naturalPulse(_breathe.value),
        );
      },
    );
  }
}
