import 'package:flutter/material.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';

/// Deep graphite canvas with subtle radial depth — lots of breathing room.
class PulseBackground extends StatelessWidget {
  const PulseBackground({
    super.key,
    this.child,
    this.showAmbientGlow = false,
  });

  final Widget? child;
  final bool showAmbientGlow;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment(0, -0.15),
          radius: 1.4,
          colors: [
            Color(0xFF101014),
            PulseColors.graphite,
            PulseColors.graphiteDeep,
          ],
          stops: [0.0, 0.55, 1.0],
        ),
      ),
      child: Stack(
        fit: StackFit.expand,
        children: [
          if (showAmbientGlow)
            Positioned(
              top: MediaQuery.sizeOf(context).height * 0.28,
              left: 0,
              right: 0,
              child: Center(
                child: Container(
                  width: 280,
                  height: 280,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        PulseColors.cyan.withValues(alpha: 0.06),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
            ),
          if (child != null) child!,
        ],
      ),
    );
  }
}
