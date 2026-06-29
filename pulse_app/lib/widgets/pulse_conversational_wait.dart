import 'package:flutter/material.dart';
import 'package:pulse_app/core/conversation/conversation_loader.dart';
import 'package:pulse_app/core/conversation/conversation_models.dart';
import 'package:pulse_app/widgets/pulse_background.dart';
import 'package:pulse_app/widgets/pulse_conversation.dart';

/// Pulse never shows "Loading…" — every wait becomes a human conversation.
///
/// Wrap any async work and show conversational copy while it completes.
class PulseConversationalWait extends StatefulWidget {
  const PulseConversationalWait({
    super.key,
    required this.assetPath,
    required this.task,
    required this.child,
    this.variables = const {},
    this.headingSize = 22,
  });

  final String assetPath;
  final Future<void> Function() task;
  final Widget child;
  final Map<String, String> variables;
  final double headingSize;

  /// Ready-to-use paths for common moments.
  static const ready = 'assets/conversations/loading_ready.json';
  static const fetch = 'assets/conversations/loading_fetch.json';
  static const save = 'assets/conversations/loading_save.json';

  @override
  State<PulseConversationalWait> createState() =>
      _PulseConversationalWaitState();
}

class _PulseConversationalWaitState extends State<PulseConversationalWait> {
  late final Future<ConversationScript> _scriptFuture;
  late final Future<void> _workFuture;
  bool _done = false;

  @override
  void initState() {
    super.initState();
    _scriptFuture = ConversationLoader.load(widget.assetPath);
    _workFuture = widget.task();
    _workFuture.whenComplete(() {
      if (mounted) setState(() => _done = true);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_done) return widget.child;

    return Scaffold(
      body: PulseBackground(
        showAmbientGlow: true,
        child: SafeArea(
          child: FutureBuilder<ConversationScript>(
            future: _scriptFuture,
            builder: (context, snapshot) {
              if (!snapshot.hasData) return const SizedBox.shrink();
              return PulseConversation(
                script: snapshot.data!,
                variables: widget.variables,
                headingSize: widget.headingSize,
              );
            },
          ),
        ),
      ),
    );
  }
}
