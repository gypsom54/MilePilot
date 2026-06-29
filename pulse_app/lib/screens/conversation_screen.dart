import 'package:flutter/material.dart';
import 'package:pulse_app/core/conversation/conversation_loader.dart';
import 'package:pulse_app/core/conversation/conversation_models.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/session/pulse_session.dart';
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
  late final Future<void> _loadFuture;
  ConversationScript? _script;

  @override
  void initState() {
    super.initState();
    _loadFuture = ConversationLoader.load(widget.assetPath).then((s) {
      _script = s;
    });
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
      case 'complete:onboarding':
        final name = variables['firstName'] ?? 'friend';
        PulseSession.completeOnboarding(name);
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
            child: FutureBuilder<void>(
              future: _loadFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done || _script == null) {
                  return const SizedBox.shrink();
                }

                return Column(
                  children: [
                    if (widget.showLogo) ...[
                      const SizedBox(height: 48),
                      const PulseLogo(
                        compact: true,
                        showTagline: false,
                        heartbeatProgress: 0,
                        pRevealProgress: 1,
                        letterOpacity: 1,
                        logoBreathe: 0.65,
                      ),
                    ],
                    Expanded(
                      child: PulseConversation(
                        script: _script!,
                        variables: widget.variables,
                        headingSize: widget.headingSize,
                        onAction: _handleAction,
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
