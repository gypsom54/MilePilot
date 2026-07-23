import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';
import 'package:pulse_app/widgets/pulse_glow.dart';

/// Premium text field — soft focus glow, pulsing cursor, fading placeholder.
class PulseTextField extends StatefulWidget {
  const PulseTextField({
    super.key,
    required this.controller,
    this.placeholder = '',
    this.onChanged,
    this.onSubmitted,
    this.textInputAction = TextInputAction.done,
  });

  final TextEditingController controller;
  final String placeholder;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final TextInputAction textInputAction;

  @override
  State<PulseTextField> createState() => _PulseTextFieldState();
}

class _PulseTextFieldState extends State<PulseTextField>
    with SingleTickerProviderStateMixin {
  final _focusNode = FocusNode();
  late final AnimationController _cursorPulse;
  late final Animation<double> _cursorBreath;
  late final Animation<double> _focusGlow;

  @override
  void initState() {
    super.initState();
    _cursorPulse = AnimationController(
      vsync: this,
      duration: PulseMotion.glowCycle,
    )..repeat(reverse: true);

    _cursorBreath = Tween<double>(begin: 0.45, end: 1.0).animate(
      CurvedAnimation(parent: _cursorPulse, curve: PulseMotion.breathe),
    );
    _focusGlow = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _cursorPulse, curve: PulseMotion.breathe),
    );

    _focusNode.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _focusNode.dispose();
    _cursorPulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduced = PulseMotion.reducedMotion(context);
    final focused = _focusNode.hasFocus;
    final hasText = widget.controller.text.isNotEmpty;

    return Semantics(
      textField: true,
      label: widget.placeholder,
      child: AnimatedBuilder(
        animation: _cursorPulse,
        builder: (context, child) {
          final glowStrength = focused ? (0.35 + _focusGlow.value * 0.45) : 0.0;

          return PulseGlow(
            intensity: glowStrength,
            spread: 16 + (glowStrength * 8),
            animate: false,
            child: AnimatedContainer(
              duration: PulseMotion.slow,
              curve: PulseMotion.fade,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: focused
                      ? PulseColors.cyan.withValues(alpha: 0.25 + glowStrength * 0.35)
                      : PulseColors.white.withValues(alpha: 0.08),
                ),
                boxShadow: focused
                    ? [
                        BoxShadow(
                          color: PulseColors.cyan.withValues(alpha: 0.08 * glowStrength),
                          blurRadius: 24,
                          spreadRadius: 1,
                        ),
                      ]
                    : null,
              ),
              child: child,
            ),
          );
        },
        child: TextField(
          controller: widget.controller,
          focusNode: _focusNode,
          textAlign: TextAlign.center,
          textCapitalization: TextCapitalization.words,
          autocorrect: false,
          textInputAction: widget.textInputAction,
          style: PulseTypography.body(size: 20, color: PulseColors.white),
          cursorColor: PulseColors.cyan.withValues(
            alpha: reduced ? 1.0 : _cursorBreath.value,
          ),
          cursorWidth: 1.5,
          cursorRadius: const Radius.circular(1),
          decoration: InputDecoration(
            hintText: widget.placeholder,
            hintStyle: PulseTypography.body(
              color: PulseColors.whiteDim.withValues(
                alpha: hasText ? 0.0 : (focused ? 0.45 : 0.65),
              ),
            ),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 24,
              vertical: 22,
            ),
          ),
          onChanged: widget.onChanged,
          onSubmitted: widget.onSubmitted,
        ),
      ),
    );
  }
}
