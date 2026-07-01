import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';

/// Calm screen transitions — shared fade, subtle glide. The app should flow.
class PulseTransition extends StatelessWidget {
  const PulseTransition({
    super.key,
    required this.child,
    this.type = PulseTransitionType.fadeGlide,
  });

  final Widget child;
  final PulseTransitionType type;

  static Route<T> route<T>(
    Widget page, {
    PulseTransitionType type = PulseTransitionType.fadeGlide,
  }) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: PulseMotion.cinematic,
      reverseTransitionDuration: PulseMotion.glide,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        final reduced = PulseMotion.reducedMotion(context);
        final curved = CurvedAnimation(
          parent: animation,
          curve: PulseMotion.glideIn,
          reverseCurve: PulseMotion.fade,
        );

        if (reduced) {
          return FadeTransition(opacity: curved, child: child);
        }

        switch (type) {
          case PulseTransitionType.fade:
            return FadeTransition(opacity: curved, child: child);
          case PulseTransitionType.fadeGlide:
            return FadeTransition(
              opacity: curved,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0, 0.025),
                  end: Offset.zero,
                ).animate(curved),
                child: child,
              ),
            );
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) => child;
}

enum PulseTransitionType { fade, fadeGlide }
