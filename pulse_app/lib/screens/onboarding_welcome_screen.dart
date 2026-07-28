import 'package:flutter/material.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';
import 'package:pulse_app/widgets/pulse_background.dart';
import 'package:pulse_app/widgets/pulse_logo.dart';
import 'package:pulse_app/widgets/pulse_primary_button.dart';
import 'package:pulse_app/widgets/pulse_typewriter.dart';

/// Personalised welcome after name entry — sets the tone for Pulse.
class OnboardingWelcomeScreen extends StatefulWidget {
  const OnboardingWelcomeScreen({
    super.key,
    required this.firstName,
  });

  final String firstName;

  @override
  State<OnboardingWelcomeScreen> createState() => _OnboardingWelcomeScreenState();
}

class _OnboardingWelcomeScreenState extends State<OnboardingWelcomeScreen> {
  bool _showButton = false;

  String get _greeting => 'Hello ${widget.firstName} 👋';

  void _onTypingComplete() {
    setState(() => _showButton = true);
  }

  void _begin() {
    // Sprint 2 will continue from here.
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Welcome, ${widget.firstName}. Sprint 2 awaits.',
          style: PulseTypography.body(color: PulseColors.graphite),
        ),
        backgroundColor: PulseColors.cyan,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PulseBackground(
        showAmbientGlow: true,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              children: [
                const SizedBox(height: 48),
                const PulseLogo(
                  compact: true,
                  showTagline: false,
                  heartbeatProgress: 0,
                  pRevealProgress: 1,
                  letterOpacity: 1,
                ),
                const Spacer(flex: 2),
                PulseTypewriter(
                  lines: [
                    _greeting,
                    "It's a pleasure to meet you.",
                    "I'm going to help you stay organised...",
                    'discover useful research...',
                    'and keep everything in one place.',
                    "Let's build Pulse around you.",
                  ],
                  style: PulseTypography.heading(
                    size: 24,
                    color: PulseColors.white,
                  ),
                  lineGap: 14,
                  charDelay: const Duration(milliseconds: 36),
                  lineDelay: const Duration(milliseconds: 560),
                  startDelay: const Duration(milliseconds: 500),
                  onComplete: _onTypingComplete,
                ),
                const Spacer(),
                AnimatedOpacity(
                  duration: const Duration(milliseconds: 800),
                  opacity: _showButton ? 1 : 0,
                  child: AnimatedSlide(
                    duration: const Duration(milliseconds: 900),
                    curve: Curves.easeOutCubic,
                    offset: _showButton ? Offset.zero : const Offset(0, 0.05),
                    child: IgnorePointer(
                      ignoring: !_showButton,
                      child: PulsePrimaryButton(
                        label: "Let's Begin",
                        onPressed: _begin,
                      ),
                    ),
                  ),
                ),
                const Spacer(flex: 2),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
