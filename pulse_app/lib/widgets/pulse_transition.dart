import 'package:flutter/material.dart';

/// Calm screen transitions — fade and glide, never bounce or spin.
class PulseTransition extends StatelessWidget {
  const PulseTransition({
    super.key,
    required this.child,
    this.type = PulseTransitionType.fade,
  });

  final Widget child;
  final PulseTransitionType type;

  static Route<T> route<T>(Widget page, {PulseTransitionType type = PulseTransitionType.fadeGlide}) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionDuration: const Duration(milliseconds: 900),
      reverseTransitionDuration: const Duration(milliseconds: 700),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        final curved = CurvedAnimation(
          parent: animation,
          curve: Curves.easeOutCubic,
          reverseCurve: Curves.easeInCubic,
        );

        switch (type) {
          case PulseTransitionType.fade:
            return FadeTransition(opacity: curved, child: child);
          case PulseTransitionType.fadeGlide:
            return FadeTransition(
              opacity: curved,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0, 0.04),
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
