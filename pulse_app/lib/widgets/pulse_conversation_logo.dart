import 'package:flutter/material.dart';
import 'package:pulse_app/core/conversation/pulse_logo_phases.dart';
import 'package:pulse_app/widgets/pulse_logo.dart';

/// Compact logo for in-conversation moments (departure heartbeat, etc.).
class PulseConversationLogo extends StatefulWidget {
  const PulseConversationLogo({
    super.key,
    this.onComplete,
  });

  final VoidCallback? onComplete;

  @override
  State<PulseConversationLogo> createState() => _PulseConversationLogoState();
}

class _PulseConversationLogoState extends State<PulseConversationLogo>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2400),
    )..forward().then((_) => widget.onComplete?.call());
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, _) {
        final progress = PulseLogoPhases.logoProgressAt(_controller.value);
        return PulseLogo(
          compact: true,
          showTagline: false,
          sequenceProgress: progress,
        );
      },
    );
  }
}
