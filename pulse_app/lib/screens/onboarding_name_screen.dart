import 'package:flutter/material.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';
import 'package:pulse_app/screens/onboarding_welcome_screen.dart';
import 'package:pulse_app/widgets/pulse_background.dart';
import 'package:pulse_app/widgets/pulse_primary_button.dart';
import 'package:pulse_app/widgets/pulse_transition.dart';
import 'package:pulse_app/widgets/pulse_typewriter.dart';

/// Onboarding step one — calm introduction and first name capture.
class OnboardingNameScreen extends StatefulWidget {
  const OnboardingNameScreen({super.key});

  @override
  State<OnboardingNameScreen> createState() => _OnboardingNameScreenState();
}

class _OnboardingNameScreenState extends State<OnboardingNameScreen> {
  final _nameController = TextEditingController();
  bool _showInput = false;
  bool _typingComplete = false;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _onTypingComplete() {
    setState(() {
      _typingComplete = true;
      _showInput = true;
    });
  }

  void _continue() {
    final name = _nameController.text.trim();
    if (name.isEmpty) return;

    Navigator.of(context).pushReplacement(
      PulseTransition.route(OnboardingWelcomeScreen(firstName: name)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final canContinue = _nameController.text.trim().isNotEmpty;

    return Scaffold(
      body: PulseBackground(
        showAmbientGlow: true,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              children: [
                const Spacer(flex: 2),
                PulseTypewriter(
                  lines: const [
                    'Hello...',
                    'Welcome to Pulse.',
                    "It's lovely to meet you.",
                    'Who are we talking to today?',
                  ],
                  style: PulseTypography.heading(
                    size: 26,
                    color: PulseColors.white,
                  ),
                  lineGap: 16,
                  charDelay: const Duration(milliseconds: 42),
                  lineDelay: const Duration(milliseconds: 680),
                  startDelay: const Duration(milliseconds: 400),
                  onComplete: _onTypingComplete,
                ),
                const Spacer(),
                AnimatedOpacity(
                  duration: const Duration(milliseconds: 700),
                  opacity: _showInput ? 1 : 0,
                  child: AnimatedSlide(
                    duration: const Duration(milliseconds: 800),
                    curve: Curves.easeOutCubic,
                    offset: _showInput ? Offset.zero : const Offset(0, 0.06),
                    child: IgnorePointer(
                      ignoring: !_showInput,
                      child: Column(
                        children: [
                          TextField(
                            controller: _nameController,
                            textAlign: TextAlign.center,
                            textCapitalization: TextCapitalization.words,
                            autocorrect: false,
                            style: PulseTypography.body(
                              size: 20,
                              color: PulseColors.white,
                            ),
                            decoration: const InputDecoration(
                              hintText: 'Your first name',
                            ),
                            onChanged: (_) => setState(() {}),
                            onSubmitted: canContinue ? (_) => _continue() : null,
                          ),
                          const SizedBox(height: 28),
                          PulsePrimaryButton(
                            label: 'Continue',
                            enabled: canContinue && _typingComplete,
                            onPressed: _continue,
                          ),
                        ],
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
