import 'package:flutter/material.dart';
import 'package:pulse_app/core/conversation/conversation_models.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';
import 'package:pulse_app/widgets/pulse_conversation_logo.dart';
import 'package:pulse_app/widgets/pulse_primary_button.dart';
import 'package:pulse_app/widgets/pulse_text_field.dart';
import 'package:pulse_app/widgets/pulse_typewriter.dart';

typedef ConversationActionHandler = void Function(
  String action,
  Map<String, String> variables,
);

/// Reusable conversation engine — steps execute sequentially, in order.
///
/// Milestone 2: onboarding, departure, loading, and co-pilot all flow
/// through this single framework. Copy lives in JSON, not widgets.
class PulseConversation extends StatefulWidget {
  const PulseConversation({
    super.key,
    required this.script,
    this.variables = const {},
    this.onAction,
    this.onComplete,
    this.headingSize = 26,
  });

  final ConversationScript script;
  final Map<String, String> variables;
  final ConversationActionHandler? onAction;
  final VoidCallback? onComplete;
  final double headingSize;

  @override
  State<PulseConversation> createState() => _PulseConversationState();
}

class _PulseConversationState extends State<PulseConversation>
    with SingleTickerProviderStateMixin {
  int _stepIndex = 0;
  bool _stepActive = false;
  bool _stepComplete = false;
  bool _showInteractive = false;
  bool _buttonReady = false;
  bool _fading = false;

  final _controllers = <String, TextEditingController>{};
  final List<String> _historyLines = [];

  late final AnimationController _fadeController;
  late final Animation<double> _fadeAnimation;

  ConversationStep get _step => widget.script.steps[_stepIndex];

  bool get _hasMoreSteps => _stepIndex < widget.script.steps.length;

  /// Name screen: input step often pairs with the next button step.
  ConversationStep? get _companionButtonStep {
    if (!_hasMoreSteps || _step.type != ConversationStepType.input) return null;
    final next = _stepIndex + 1;
    if (next < widget.script.steps.length &&
        widget.script.steps[next].type == ConversationStepType.button) {
      return widget.script.steps[next];
    }
    return null;
  }

  ConversationStep? get _activeButtonStep {
    if (_step.type == ConversationStepType.button) return _step;
    return _companionButtonStep;
  }

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      vsync: this,
      duration: PulseMotion.slow,
    );
    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: PulseMotion.fade,
    );

    for (final step in widget.script.steps) {
      if (step.type == ConversationStepType.input && step.inputKey != null) {
        _controllers.putIfAbsent(step.inputKey!, TextEditingController.new);
      }
    }

    WidgetsBinding.instance.addPostFrameCallback((_) => _beginStep());
  }

  @override
  void dispose() {
    _fadeController.dispose();
    for (final c in _controllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _beginStep() {
    if (!mounted || !_hasMoreSteps) {
      widget.onComplete?.call();
      return;
    }

    setState(() {
      _stepActive = true;
      _stepComplete = false;
      _showInteractive = false;
      _buttonReady = false;
    });

    final step = _step;
    switch (step.type) {
      case ConversationStepType.pause:
        Future<void>.delayed(
          Duration(milliseconds: step.durationMs ?? 600),
          _completeStep,
        );
      case ConversationStepType.logo:
        setState(() {});
      case ConversationStepType.input:
        setState(() => _showInteractive = true);
      case ConversationStepType.button:
        setState(() {
          _showInteractive = true;
          _buttonReady = true;
        });
      case ConversationStepType.fade:
        setState(() => _fading = true);
        _fadeController.duration = Duration(
          milliseconds: step.durationMs ?? PulseMotion.slow.inMilliseconds,
        );
        _fadeController.forward(from: 0).then((_) => _completeStep());
      case ConversationStepType.typing:
        setState(() {});
    }
  }

  void _completeStep() {
    if (!mounted) return;
    if (_stepIndex >= widget.script.steps.length - 1) {
      widget.onComplete?.call();
      return;
    }
    setState(() {
      _stepIndex++;
      _stepActive = false;
      _stepComplete = false;
      _showInteractive = false;
      _buttonReady = false;
    });
    _beginStep();
  }

  void _onTypingComplete(List<String> lines) {
    setState(() {
      _historyLines.addAll(lines);
      _stepComplete = true;
    });
    Future<void>.delayed(PulseMotion.medium, _completeStep);
  }

  void _onLogoComplete() => _completeStep();

  Map<String, String> _allVariables() {
    final vars = Map<String, String>.from(widget.variables);
    for (final entry in _controllers.entries) {
      vars[entry.key] = entry.value.text.trim();
    }
    return vars;
  }

  bool _canProceed() {
    for (final step in widget.script.steps) {
      if (step.type == ConversationStepType.input) {
        final key = step.inputKey;
        if (key == null) return false;
        if ((_controllers[key]?.text.trim().isEmpty ?? true)) return false;
      }
    }
    return true;
  }

  void _onNameChanged() {
    final canProceed = _canProceed();
    setState(() {});

    if (canProceed && !_buttonReady) {
      // Glow first, then breathe — "I'm ready when you are."
      Future<void>.delayed(const Duration(milliseconds: 520), () {
        if (!mounted || !_canProceed()) return;
        setState(() => _buttonReady = true);
      });
    } else if (!canProceed && _buttonReady) {
      setState(() => _buttonReady = false);
    }
  }

  void _handleButton(ConversationStep step) {
    final action = step.action;
    if (action != null) {
      widget.onAction?.call(action, _allVariables());
    }
  }

  List<TypewriterLine> _linesForStep(ConversationStep step) {
    return (step.lines ?? [])
        .map(
          (l) => TypewriterLine(
            text: l.interpolate(widget.variables),
            pauseAfter: Duration(milliseconds: l.pauseAfterMs),
          ),
        )
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final reduced = PulseMotion.reducedMotion(context);
    final step = _hasMoreSteps ? _step : null;

    return FadeTransition(
      opacity: _fading
          ? Tween<double>(begin: 1, end: 0).animate(_fadeAnimation)
          : const AlwaysStoppedAnimation(1),
      child: Column(
        children: [
          const Spacer(flex: 2),
          Expanded(
            flex: 5,
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  for (final line in _historyLines)
                    Padding(
                      padding: const EdgeInsets.only(bottom: PulseMotion.lineGap),
                      child: Text(
                        line,
                        textAlign: TextAlign.center,
                        style: PulseTypography.heading(
                          size: widget.headingSize,
                          color: PulseColors.white,
                        ),
                      ),
                    ),
                  if (step?.type == ConversationStepType.typing &&
                      _stepActive &&
                      !_stepComplete)
                    PulseTypewriter(
                      lines: _linesForStep(step!),
                      style: PulseTypography.heading(
                        size: widget.headingSize,
                        color: PulseColors.white,
                      ),
                      baseCharDelay: Duration(milliseconds: step.charDelayMs),
                      charDelayVariance: step.charDelayVariance,
                      skipAnimation: reduced,
                      onComplete: () => _onTypingComplete(
                        _linesForStep(step).map((l) => l.text).toList(),
                      ),
                    ),
                  if (step?.type == ConversationStepType.logo && _stepActive)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 32),
                      child: PulseConversationLogo(
                        onComplete: _onLogoComplete,
                      ),
                    ),
                ],
              ),
            ),
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
                child: _buildInteractive(step),
              ),
            ),
          ),
          const Spacer(flex: 2),
        ],
      ),
    );
  }

  Widget _buildInteractive(ConversationStep? step) {
    if (step == null) return const SizedBox.shrink();

    final button = _activeButtonStep;
    final showInput = step.type == ConversationStepType.input;

    if (!showInput && button == null) return const SizedBox.shrink();

    return Column(
      children: [
        if (showInput) ...[
          PulseTextField(
            controller: _controllers[step.inputKey!]!,
            placeholder: step.placeholder ?? '',
            onChanged: (_) => _onNameChanged(),
            onSubmitted: _canProceed() && button != null
                ? (_) => _handleButton(button)
                : null,
          ),
          const SizedBox(height: PulseMotion.sectionGap),
        ],
        if (button != null)
          PulsePrimaryButton(
            label: button.label ?? 'Continue',
            enabled: showInput ? _canProceed() : true,
            pulseWhenEnabled: showInput ? _buttonReady : true,
            onPressed: () => _handleButton(button),
          ),
      ],
    );
  }
}
