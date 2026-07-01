import 'package:flutter/material.dart';
import 'package:pulse_app/core/conversation/conversation_loader.dart';
import 'package:pulse_app/core/conversation/conversation_models.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/brain/pulse_brain.dart';
import 'package:pulse_app/screens/shell/pulse_shell.dart';
import 'package:pulse_app/widgets/pulse_background.dart';
import 'package:pulse_app/widgets/pulse_conversation.dart';
import 'package:pulse_app/widgets/pulse_header.dart';
import 'package:pulse_app/widgets/pulse_transition.dart';

/// PS-004 — Generic onboarding screen driven by conversation JSON.
class ConversationScreen extends StatefulWidget {
  const ConversationScreen({
    super.key,
    required this.assetPath,
    this.variables = const {},
    this.headingSize = 26,
  });

  final String assetPath;
  final Map<String, String> variables;
  final double headingSize;

  static const positioning =
      'assets/conversations/onboarding_positioning.json';
  static const name = 'assets/conversations/onboarding_name.json';
  static const personalise =
      'assets/conversations/onboarding_personalise.json';
  static const help = 'assets/conversations/onboarding_help.json';
  static const promise = 'assets/conversations/onboarding_promise.json';
  static const homePreview =
      'assets/conversations/onboarding_home_preview.json';

  @override
  State<ConversationScreen> createState() => _ConversationScreenState();
}

class _ConversationScreenState extends State<ConversationScreen> {
  late final Future<ConversationScript> _scriptFuture;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _scriptFuture = ConversationLoader.load(widget.assetPath);
  }

  Future<void> _persistVariables(Map<String, String> variables) async {
    final name = variables['firstName'] ?? '';
    if (name.isNotEmpty) {
      await PulseBrain.instance.setFirstName(name);
    }

    final help = variables['primaryHelp'];
    if (help != null) {
      await PulseBrain.instance.recordOnboardingChoice('primaryHelp', help);
      final learningMap = {
        'education': 'articles',
        'journal': 'notes',
        'tools': 'mixed',
        'everything': 'mixed',
      };
      if (learningMap.containsKey(help)) {
        await PulseBrain.instance.setFavouriteLearningType(learningMap[help]!);
      }
    }

    for (final entry in variables.entries) {
      if (entry.key != 'firstName' && entry.key != 'primaryHelp') {
        await PulseBrain.instance.recordOnboardingChoice(entry.key, entry.value);
      }
    }
  }

  Future<void> _finishOnboarding(Map<String, String> variables) async {
    setState(() => _loading = true);
    await _persistVariables(variables);
    await PulseBrain.instance.completeOnboarding(
      firstName: variables['firstName'],
    );
    if (!mounted) return;
    Navigator.of(context).pushReplacement(PulseShell.route());
  }

  void _navigateTo(String assetPath, Map<String, String> variables) {
    Navigator.of(context).pushReplacement(
      PulseTransition.route(
        ConversationScreen(
          assetPath: assetPath,
          variables: variables,
          headingSize: widget.headingSize,
        ),
      ),
    );
  }

  Future<void> _handleAction(String action, Map<String, String> variables) async {
    switch (action) {
      case 'navigate:positioning':
        _navigateTo(ConversationScreen.positioning, variables);
      case 'navigate:name':
        _navigateTo(ConversationScreen.name, variables);
      case 'navigate:personalise':
        _navigateTo(ConversationScreen.personalise, variables);
      case 'navigate:help':
        _navigateTo(ConversationScreen.help, variables);
      case 'navigate:promise':
        _navigateTo(ConversationScreen.promise, variables);
      case 'navigate:preview':
        await _persistVariables(variables);
        if (!mounted) return;
        _navigateTo(ConversationScreen.homePreview, variables);
      case 'complete:onboarding':
        await _finishOnboarding(variables);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: PulseBackground(
        showAmbientGlow: true,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: PulseMotion.screenPadding,
            ),
            child: FutureBuilder<ConversationScript>(
              future: _scriptFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done ||
                    !snapshot.hasData) {
                  return const Column(
                    children: [
                      PulseHeader(),
                      Expanded(child: SizedBox.shrink()),
                    ],
                  );
                }

                return Column(
                  children: [
                    const PulseHeader(),
                    Expanded(
                      child: PulseConversation(
                        script: snapshot.data!,
                        variables: widget.variables,
                        headingSize: widget.headingSize,
                        loading: _loading,
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
