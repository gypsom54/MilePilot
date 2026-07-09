import 'package:flutter/material.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';
import 'package:pulse_app/widgets/pulse_glow.dart';

/// Primary action button — soft glow, gentle lift, no bounce.
class PulsePrimaryButton extends StatefulWidget {
  const PulsePrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.enabled = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool enabled;

  @override
  State<PulsePrimaryButton> createState() => _PulsePrimaryButtonState();
}

class _PulsePrimaryButtonState extends State<PulsePrimaryButton> {
  bool _pressed = false;

  bool get _isEnabled => widget.enabled && widget.onPressed != null;

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      duration: const Duration(milliseconds: 400),
      opacity: _isEnabled ? 1.0 : 0.35,
      child: GestureDetector(
        onTapDown: _isEnabled ? (_) => setState(() => _pressed = true) : null,
        onTapUp: _isEnabled ? (_) => setState(() => _pressed = false) : null,
        onTapCancel: () => setState(() => _pressed = false),
        onTap: _isEnabled ? widget.onPressed : null,
        child: AnimatedScale(
          scale: _pressed ? 0.985 : 1.0,
          duration: const Duration(milliseconds: 180),
          curve: Curves.easeOut,
          child: AnimatedSlide(
            offset: _pressed ? const Offset(0, 0.01) : Offset.zero,
            duration: const Duration(milliseconds: 180),
            curve: Curves.easeOut,
            child: PulseGlow(
              intensity: _isEnabled ? 0.85 : 0.2,
              spread: 18,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeOut,
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 18),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: _isEnabled
                        ? [
                            PulseColors.cyan,
                            PulseColors.cyanSoft,
                          ]
                        : [
                            PulseColors.cyan.withValues(alpha: 0.4),
                            PulseColors.cyanSoft.withValues(alpha: 0.3),
                          ],
                  ),
                ),
                child: Text(
                  widget.label,
                  textAlign: TextAlign.center,
                  style: PulseTypography.body(
                    size: 17,
                    weight: FontWeight.w600,
                    color: PulseColors.graphite,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
