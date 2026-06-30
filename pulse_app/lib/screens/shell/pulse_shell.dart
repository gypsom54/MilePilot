import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/screens/home/home_screen.dart';
import 'package:pulse_app/screens/placeholders/calm_placeholder_screen.dart';
import 'package:pulse_app/widgets/pulse_background.dart';
import 'package:pulse_app/widgets/pulse_bottom_nav.dart';
import 'package:pulse_app/widgets/pulse_transition.dart';

/// Main app shell — home and bottom navigation after onboarding.
class PulseShell extends StatefulWidget {
  const PulseShell({super.key, this.initialTab = PulseNavTab.home});

  final PulseNavTab initialTab;

  static Route<void> route({PulseNavTab initialTab = PulseNavTab.home}) {
    return PulseTransition.route(PulseShell(initialTab: initialTab));
  }

  @override
  State<PulseShell> createState() => _PulseShellState();
}

class _PulseShellState extends State<PulseShell> {
  late PulseNavTab _tab;

  @override
  void initState() {
    super.initState();
    _tab = widget.initialTab;
  }

  Widget _bodyFor(PulseNavTab tab) {
    return switch (tab) {
      PulseNavTab.home => const HomeScreen(),
      PulseNavTab.cabinet => const CalmPlaceholderScreen(
          title: 'Research Cabinet',
          subtitle: 'Ready whenever you are.',
        ),
      PulseNavTab.learn => const CalmPlaceholderScreen(
          title: "Today's Discovery",
          subtitle: "I've found something interesting for you.",
        ),
      PulseNavTab.journal => const CalmPlaceholderScreen(
          title: 'Research Journal',
          subtitle: 'Continue your journey.',
        ),
      PulseNavTab.pulse => const CalmPlaceholderScreen(
          title: 'Pulse',
          subtitle: 'How can I help today?',
        ),
    };
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: PulseBackground(
        showAmbientGlow: true,
        child: SafeArea(
          bottom: false,
          child: AnimatedSwitcher(
            duration: PulseMotion.slow,
            switchInCurve: PulseMotion.fade,
            switchOutCurve: PulseMotion.fade,
            transitionBuilder: (child, animation) {
              return FadeTransition(
                opacity: animation,
                child: SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0, 0.015),
                    end: Offset.zero,
                  ).animate(animation),
                  child: child,
                ),
              );
            },
            child: KeyedSubtree(
              key: ValueKey(_tab),
              child: _bodyFor(_tab),
            ),
          ),
        ),
      ),
      bottomNavigationBar: PulseBottomNav(
        current: _tab,
        onChanged: (tab) => setState(() => _tab = tab),
      ),
    );
  }
}
