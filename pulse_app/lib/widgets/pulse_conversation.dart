import 'package:flutter/material.dart';
import 'package:pulse_app/core/conversation/conversation_models.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';
import 'package:pulse_app/widgets/pulse_choice_card.dart';
import 'package:pulse_app/widgets/pulse_conversation_logo.dart';
import 'package:pulse_app/widgets/pulse_onboarding_preview.dart';
import 'package:pulse_app/widgets/pulse_primary_button.dart';
import 'package:pulse_app/widgets/pulse_text_field.dart';
import 'package:pulse_app/widgets/pulse_typewriter.dart';

typedef ConversationActionHandler = void Function(
  String action,
  Map<String, String> variables,
);

/// Reusable conversation engine — steps execute sequentially, in order.
class PulseConversation extends StatefulWidget {
  const PulseConversation({
    super.key,
    required this.script,
    this.variables = const {},
    this.onAction,
    this.onComplete,
    this.headingSize = 26,
    this.loading = false,
  });

  final ConversationScript script;
  final Map<String, String> variables;
  final ConversationActionHandler? onAction;
  final VoidCallback? onComplete;
  final double headingSize;
  final bool loading;

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
  String? _selectedChoice;

  final _controllers = <String, TextEditingController>{};
  final List<_RenderedLine> _historyLines = [];

  late final AnimationController _fadeController;
  late final Animation<double> _fadeAnimation;

  ConversationStep get _step => widget.script.steps[_stepIndex];

  bool get _hasMoreSteps => _stepIndex < widget.script.steps.length;

  ConversationStep? get _companionButtonStep {
    if (!_hasMoreSteps) return null;
    final type = _step.type;
    if (type != ConversationStepType.input &&
        type != ConversationStepType.choice &&
        type != ConversationStepType.preview) {
      return null;
    }
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
      case ConversationStepType.preview:
        setState(() {
          _stepComplete = true;
          _showInteractive = _companionButtonStep != null;
          _buttonReady = _companionButtonStep != null;
        });
      case ConversationStepType.input:
        setState(() => _showInteractive = true);
      case ConversationStepType.choice:
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

  void _onTypingComplete(List<_RenderedLine> lines) {
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
    if (_selectedChoice != null) {
      final key = _step.choiceKey ??
          widget.script.steps
              .where((s) => s.type == ConversationStepType.choice)
              .map((s) => s.choiceKey)
              .firstWhere((k) => k != null, orElse: () => 'primaryHelp');
      if (key != null) vars[key] = _selectedChoice!;
    }
    return vars;
  }

  bool _hasChoiceRequirement() {
    for (final step in widget.script.steps) {
      if (step.type == ConversationStepType.choice) return true;
    }
    return false;
  }

  bool _canProceed() {
    for (final step in widget.script.steps) {
      if (step.type == ConversationStepType.input) {
        final key = step.inputKey;
        if (key == null) return false;
        if ((_controllers[key]?.text.trim().isEmpty ?? true)) return false;
      }
    }
    if (_step.type == ConversationStepType.choice ||
        (_step.type == ConversationStepType.button &&
            _hasChoiceRequirement() &&
            _selectedChoice == null)) {
      if (_selectedChoice == null) return false;
    }
    if (_step.type == ConversationStepType.choice && _selectedChoice == null) {
      return false;
    }
    return true;
  }

  void _onNameChanged() {
    final canProceed = _canProceed();
    setState(() {});

    if (canProceed && !_buttonReady) {
      Future<void>.delayed(const Duration(milliseconds: 520), () {
        if (!mounted || !_canProceed()) return;
        setState(() => _buttonReady = true);
      });
    } else if (!canProceed && _buttonReady) {
      setState(() => _buttonReady = false);
    }
  }

  void _onChoiceSelected(String id) {
    setState(() {
      _selectedChoice = id;
      _buttonReady = true;
    });
  }

  Future<void> _handleButton(ConversationStep step) async {
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

  TextStyle _lineStyle(ConversationLine line, ConversationStep step) {
    final size = step.headingSize ?? widget.headingSize;
    if (line.style == 'display') {
      return PulseTypography.display(
        size: size + 10,
        letterSpacing: 4,
        color: PulseColors.white,
      );
    }
    if (line.style == 'body') {
      return PulseTypography.body(
        size: 17,
        color: PulseColors.whiteSoft,
      );
    }
    if (line.style == 'caption') {
      return PulseTypography.caption(color: PulseColors.whiteMuted);
    }
    return PulseTypography.heading(
      size: size,
      color: PulseColors.white,
    );
  }

  @override
  Widget build(BuildContext context) {
    final reduced = PulseMotion.reducedMotion(context);
    final step = _hasMoreSteps ? _step : null;
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;

    return FadeTransition(
      opacity: _fading
          ? Tween<double>(begin: 1, end: 0).animate(_fadeAnimation)
          : const AlwaysStoppedAnimation(1),
      child: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: EdgeInsets.only(bottom: bottomInset > 0 ? 12 : 0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  for (final line in _historyLines)
                    Padding(
                      padding: const EdgeInsets.only(bottom: PulseMotion.lineGap),
                      child: Text(
                        line.text,
                        textAlign: line.centered ? TextAlign.center : TextAlign.start,
                        style: line.style,
                      ),
                    ),
                  if (step?.type == ConversationStepType.typing &&
                      _stepActive &&
                      !_stepComplete)
                    _TypingBlock(
                      step: step!,
                      lines: _linesForStep(step),
                      lineStyleBuilder: (i) => _lineStyle(
                        step.lines![i],
                        step,
                      ),
                      reduced: reduced,
                      onComplete: () => _onTypingComplete(
                        _linesForStep(step).asMap().entries.map((e) {
                          final line = step.lines![e.key];
                          return _RenderedLine(
                            text: e.value.text,
                            style: _lineStyle(line, step),
                            centered: line.style == 'display',
                          );
                        }).toList(),
                      ),
                    ),
                  if (step?.type == ConversationStepType.logo && _stepActive)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 24),
                      child: Center(
                        child: PulseConversationLogo(onComplete: _onLogoComplete),
                      ),
                    ),
                  if (step?.type == ConversationStepType.preview && _stepActive)
                    const Padding(
                      padding: EdgeInsets.only(top: 8, bottom: 16),
                      child: PulseOnboardingPreview(),
                    ),
                  if (step?.type == ConversationStepType.choice &&
                      _showInteractive &&
                      step?.options != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Column(
                        children: [
                          for (var i = 0; i < step!.options!.length; i++)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: PulseChoiceCard(
                                label: step.options![i].label,
                                selected: _selectedChoice == step.options![i].id,
                                staggerIndex: i,
                                onTap: () => _onChoiceSelected(step.options![i].id),
                              ),
                            ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
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
                child: Padding(
                  padding: EdgeInsets.only(
                    top: 16,
                    bottom: bottomInset > 0 ? bottomInset + 8 : 24,
                  ),
                  child: _buildInteractive(step),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInteractive(ConversationStep? step) {
    if (step == null) return const SizedBox.shrink();

    final button = _activeButtonStep;
    final showInput = step.type == ConversationStepType.input;
    final showChoiceOrPreview = step.type == ConversationStepType.choice ||
        step.type == ConversationStepType.preview;

    if (!showInput && button == null && !showChoiceOrPreview) {
      return const SizedBox.shrink();
    }

    final needsInputReady = showInput;
    final needsChoiceReady = step.type == ConversationStepType.choice;

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
            enabled: _canProceed() && !widget.loading,
            loading: widget.loading,
            pulseWhenEnabled: needsInputReady
                ? _buttonReady
                : needsChoiceReady
                    ? _selectedChoice != null
                    : true,
            onPressed: () => _handleButton(button),
          ),
      ],
    );
  }
}

class _RenderedLine {
  const _RenderedLine({
    required this.text,
    required this.style,
    this.centered = false,
  });

  final String text;
  final TextStyle style;
  final bool centered;
}

class _TypingBlock extends StatelessWidget {
  const _TypingBlock({
    required this.step,
    required this.lines,
    required this.lineStyleBuilder,
    required this.reduced,
    required this.onComplete,
  });

  final ConversationStep step;
  final List<TypewriterLine> lines;
  final TextStyle Function(int index) lineStyleBuilder;
  final bool reduced;
  final VoidCallback onComplete;

  @override
  Widget build(BuildContext context) {
    if (lines.isEmpty) return const SizedBox.shrink();

    final hasMixedStyles = step.lines?.any((l) => l.style != null) ?? false;

    if (!hasMixedStyles) {
      return PulseTypewriter(
        lines: lines,
        style: lineStyleBuilder(0),
        align: step.lines?.first.style == 'display'
            ? TextAlign.center
            : TextAlign.start,
        baseCharDelay: Duration(milliseconds: step.charDelayMs),
        charDelayVariance: step.charDelayVariance,
        skipAnimation: reduced,
        onComplete: onComplete,
      );
    }

    return _SequentialStyledTypewriter(
      step: step,
      lines: lines,
      lineStyleBuilder: lineStyleBuilder,
      reduced: reduced,
      onComplete: onComplete,
    );
  }
}

class _SequentialStyledTypewriter extends StatefulWidget {
  const _SequentialStyledTypewriter({
    required this.step,
    required this.lines,
    required this.lineStyleBuilder,
    required this.reduced,
    required this.onComplete,
  });

  final ConversationStep step;
  final List<TypewriterLine> lines;
  final TextStyle Function(int index) lineStyleBuilder;
  final bool reduced;
  final VoidCallback onComplete;

  @override
  State<_SequentialStyledTypewriter> createState() =>
      _SequentialStyledTypewriterState();
}

class _SequentialStyledTypewriterState extends State<_SequentialStyledTypewriter> {
  int _index = 0;
  final _completed = <Widget>[];

  @override
  void initState() {
    super.initState();
    if (widget.reduced) {
      for (var i = 0; i < widget.lines.length; i++) {
        _completed.add(_text(widget.lines[i].text, i));
      }
      WidgetsBinding.instance.addPostFrameCallback((_) => widget.onComplete());
    }
  }

  Widget _text(String text, int lineIndex) {
    final centered = widget.step.lines?[lineIndex].style == 'display';
    return Padding(
      padding: const EdgeInsets.only(bottom: PulseMotion.lineGap),
      child: Text(
        text,
        textAlign: centered ? TextAlign.center : TextAlign.start,
        style: widget.lineStyleBuilder(lineIndex),
      ),
    );
  }

  void _onLineComplete() {
    setState(() {
      _completed.add(_text(widget.lines[_index].text, _index));
      _index++;
    });
    if (_index >= widget.lines.length) {
      widget.onComplete();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.reduced) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: _completed,
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ..._completed,
        if (_index < widget.lines.length)
          PulseTypewriter(
            key: ValueKey(_index),
            lines: [widget.lines[_index]],
            style: widget.lineStyleBuilder(_index),
            align: widget.step.lines?[_index].style == 'display'
                ? TextAlign.center
                : TextAlign.start,
            baseCharDelay: Duration(milliseconds: widget.step.charDelayMs),
            charDelayVariance: widget.step.charDelayVariance,
            onComplete: _onLineComplete,
          ),
      ],
    );
  }
}
