import 'package:flutter/material.dart';
import 'package:pulse_app/core/conversation/conversation_models.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';
import 'package:pulse_app/widgets/pulse_primary_button.dart';
import 'package:pulse_app/widgets/pulse_text_field.dart';
import 'package:pulse_app/widgets/pulse_typewriter.dart';

typedef ConversationActionHandler = void Function(
  String action,
  Map<String, String> variables,
);

/// Reusable conversation engine — typing, pause, input, buttons from JSON.
class PulseConversation extends StatefulWidget {
  const PulseConversation({
    super.key,
    required this.script,
    this.variables = const {},
    this.onAction,
    this.headingSize = 26,
  });

  final ConversationScript script;
  final Map<String, String> variables;
  final ConversationActionHandler? onAction;
  final double headingSize;

  @override
  State<PulseConversation> createState() => _PulseConversationState();
}

class _PulseConversationState extends State<PulseConversation> {
  bool _typingComplete = false;
  bool _showInteractive = false;
  final _controllers = <String, TextEditingController>{};

  ConversationStep? get _typingStep {
    for (final s in widget.script.steps) {
      if (s.type == ConversationStepType.typing) return s;
    }
    return null;
  }

  List<ConversationStep> get _interactiveSteps => widget.script.steps
      .where((s) =>
          s.type == ConversationStepType.input ||
          s.type == ConversationStepType.button)
      .toList();

  @override
  void initState() {
    super.initState();
    for (final step in _interactiveSteps) {
      if (step.type == ConversationStepType.input && step.inputKey != null) {
        _controllers.putIfAbsent(step.inputKey!, TextEditingController.new);
      }
    }
    if (_typingStep == null) {
      _typingComplete = true;
      _showInteractive = true;
    }
  }

  @override
  void dispose() {
    for (final c in _controllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _onTypingComplete() {
    setState(() => _typingComplete = true);
    Future<void>.delayed(PulseMotion.medium, () {
      if (mounted) setState(() => _showInteractive = true);
    });
  }

  Map<String, String> _allVariables() {
    final vars = Map<String, String>.from(widget.variables);
    for (final entry in _controllers.entries) {
      vars[entry.key] = entry.value.text.trim();
    }
    return vars;
  }

  bool _canProceed() {
    for (final step in _interactiveSteps) {
      if (step.type == ConversationStepType.input) {
        final key = step.inputKey;
        if (key == null) return false;
        if ((_controllers[key]?.text.trim().isEmpty ?? true)) return false;
      }
    }
    return true;
  }

  ConversationStep? get _buttonStep {
    for (final s in _interactiveSteps) {
      if (s.type == ConversationStepType.button) return s;
    }
    return null;
  }

  void _handleButton(ConversationStep step) {
    final action = step.action;
    if (action != null) {
      widget.onAction?.call(action, _allVariables());
    }
  }

  @override
  Widget build(BuildContext context) {
    final reduced = PulseMotion.reducedMotion(context);
    final typing = _typingStep;

    return Column(
      children: [
        const Spacer(flex: 2),
        if (typing?.lines != null)
          PulseTypewriter(
            lines: typing!.lines!
                .map(
                  (l) => TypewriterLine(
                    text: l.interpolate(widget.variables),
                    pauseAfter: Duration(milliseconds: l.pauseAfterMs),
                  ),
                )
                .toList(),
            style: PulseTypography.heading(
              size: widget.headingSize,
              color: PulseColors.white,
            ),
            baseCharDelay: Duration(milliseconds: typing.charDelayMs),
            charDelayVariance: typing.charDelayVariance,
            startDelay: PulseMotion.medium,
            skipAnimation: reduced,
            onComplete: _onTypingComplete,
          ),
        const Spacer(),
        AnimatedOpacity(
          duration: PulseMotion.glide,
          curve: PulseMotion.fade,
          opacity: _showInteractive ? 1 : 0,
          child: AnimatedSlide(
            duration: PulseMotion.glide,
            curve: PulseMotion.glideIn,
            offset: _showInteractive ? Offset.zero : const Offset(0, 0.035),
            child: IgnorePointer(
              ignoring: !_showInteractive,
              child: Column(
                children: [
                  for (final step in _interactiveSteps) ...[
                    if (step.type == ConversationStepType.input) ...[
                      PulseTextField(
                        controller: _controllers[step.inputKey!]!,
                        placeholder: step.placeholder ?? '',
                        onChanged: (_) => setState(() {}),
                        onSubmitted: _canProceed() && _buttonStep != null
                            ? (_) => _handleButton(_buttonStep!)
                            : null,
                      ),
                      const SizedBox(height: PulseMotion.sectionGap),
                    ],
                    if (step.type == ConversationStepType.button)
                      PulsePrimaryButton(
                        label: step.label ?? 'Continue',
                        enabled: _typingComplete && _canProceed(),
                        pulseWhenEnabled: _canProceed(),
                        onPressed: () => _handleButton(step),
                      ),
                  ],
                ],
              ),
            ),
          ),
        ),
        const Spacer(flex: 2),
      ],
    );
  }
}
