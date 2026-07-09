import 'package:flutter/material.dart';
import 'package:pulse_app/core/conversation/conversation_loader.dart';
import 'package:pulse_app/core/conversation/conversation_models.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/brain/pulse_brain.dart';
import 'package:pulse_app/screens/shell/pulse_shell.dart';
import 'package:pulse_app/widgets/pulse_background.dart';
import 'package:pulse_app/widgets/pulse_conversation.dart';
import 'package:pulse_app/widgets/pulse_logo.dart';
import 'package:pulse_app/widgets/pulse_transition.dart';

/// Generic screen driven by conversation JSON — no hardcoded onboarding copy.
class ConversationScreen extends StatefulWidget {
  const ConversationScreen({
    super.key,
    required this.assetPath,
    this.variables = const {},
    this.showLogo = false,
    this.headingSize = 26,
  });

  final String assetPath;
  final Map<String, String> variables;
  final bool showLogo;
  final double headingSize;

  @override
  State<ConversationScreen> createState() => _ConversationScreenState();
}

class _ConversationScreenState extends State<ConversationScreen> {
  late final Future<ConversationScript> _scriptFuture;

  @override
  void initState() {
    super.initState();
    _scriptFuture = ConversationLoader.load(widget.assetPath);
  }

  Future<void> _persistOnboarding(Map<String, String> variables) async {
    final name = variables['firstName'] ?? '';
    if (name.isNotEmpty) {
      await PulseBrain.instance.setFirstName(name);
    }
    for (final entry in variables.entries) {
      if (entry.key != 'firstName') {
        await PulseBrain.instance.recordOnboardingChoice(entry.key, entry.value);
      }
    }
    await PulseBrain.instance.completeOnboarding(
      firstName: name.isNotEmpty ? name : null,
    );
  }

  void _handleAction(String action, Map<String, String> variables) {
    switch (action) {
      case 'navigate:welcome':
        Navigator.of(context).pushReplacement(
          PulseTransition.route(
            ConversationScreen(
              assetPath: 'assets/conversations/onboarding_welcome.json',
              variables: variables,
              showLogo: true,
              headingSize: 24,
            ),
          ),
        );
      case 'navigate:departure':
        _goToDeparture(variables);
      case 'complete:onboarding':
        _finishOnboarding(variables);
    }
  }

  Future<void> _goToDeparture(Map<String, String> variables) async {
    await _persistOnboarding(variables);
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      PulseTransition.route(
        ConversationScreen(
          assetPath: 'assets/conversations/onboarding_departure.json',
          variables: variables,
          headingSize: 24,
        ),
      ),
    );
  }

  Future<void> _finishOnboarding(Map<String, String> variables) async {
    await _persistOnboarding(variables);
    if (!mounted) return;
    Navigator.of(context).pushReplacement(PulseShell.route());
  }

  void _handleScriptComplete() {
    if (widget.assetPath.contains('onboarding_departure')) {
      Navigator.of(context).pushReplacement(PulseShell.route());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PulseBackground(
        showAmbientGlow: true,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: PulseMotion.screenPadding),
            child: FutureBuilder<ConversationScript>(
              future: _scriptFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done ||
                    !snapshot.hasData) {
                  return const SizedBox.shrink();
                }

                return Column(
                  children: [
                    if (widget.showLogo) ...[
                      const SizedBox(height: 48),
                      const PulseLogo(
                        compact: true,
                        showTagline: false,
                        sequenceProgress: 0.55,
                      ),
                    ],
                    Expanded(
                      child: PulseConversation(
                        script: snapshot.data!,
                        variables: widget.variables,
                        headingSize: widget.headingSize,
                        onAction: _handleAction,
                        onComplete: _handleScriptComplete,
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
