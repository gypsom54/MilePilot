import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';
import 'package:pulse_app/widgets/pulse_glow.dart';

/// Primary action button — glow, press, release, focus. Premium throughout.
class PulsePrimaryButton extends StatefulWidget {
  const PulsePrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.enabled = true,
    this.pulseWhenEnabled = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool enabled;
  final bool pulseWhenEnabled;

  @override
  State<PulsePrimaryButton> createState() => _PulsePrimaryButtonState();
}

class _PulsePrimaryButtonState extends State<PulsePrimaryButton>
    with TickerProviderStateMixin {
  bool _pressed = false;
  bool _hovered = false;
  bool _focused = false;
  bool _wasEnabled = false;
  late final AnimationController _readyPulse;
  late final Animation<double> _readyBreath;
  late final AnimationController _arrivalGlow;
  late final Animation<double> _arrivalGlowValue;

  bool get _isEnabled => widget.enabled && widget.onPressed != null;

  @override
  void initState() {
    super.initState();
    _readyPulse = AnimationController(
      vsync: this,
      duration: PulseMotion.glowCycle,
    );
    _readyBreath = Tween<double>(begin: 0.72, end: 1.0).animate(
      CurvedAnimation(parent: _readyPulse, curve: PulseMotion.breathe),
    );
    _arrivalGlow = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 480),
    );
    _arrivalGlowValue = CurvedAnimation(
      parent: _arrivalGlow,
      curve: PulseMotion.fade,
    );
    _syncPulse();
  }

  @override
  void didUpdateWidget(covariant PulsePrimaryButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (_isEnabled && !_wasEnabled) {
      _arrivalGlow.forward(from: 0);
    }
    _wasEnabled = _isEnabled;
    _syncPulse();
  }

  void _syncPulse() {
    if (widget.pulseWhenEnabled && _isEnabled) {
      if (!_readyPulse.isAnimating) _readyPulse.repeat(reverse: true);
    } else {
      _readyPulse
        ..stop()
        ..value = 1.0;
    }
  }

  @override
  void dispose() {
    _readyPulse.dispose();
    _arrivalGlow.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduced = PulseMotion.reducedMotion(context);

    return Semantics(
      button: true,
      enabled: _isEnabled,
      label: widget.label,
      child: FocusableActionDetector(
        onShowFocusHighlight: (v) => setState(() => _focused = v),
        child: MouseRegion(
          onEnter: (_) => setState(() => _hovered = true),
          onExit: (_) => setState(() => _hovered = false),
          child: AnimatedBuilder(
            animation: Listenable.merge([_readyBreath, _arrivalGlowValue]),
            builder: (context, child) {
              final arrivalBoost = _isEnabled ? _arrivalGlowValue.value * 0.22 : 0.0;
              final glowIntensity = _isEnabled
                  ? (0.55 + arrivalBoost + (_hovered ? 0.15 : 0) + (_focused ? 0.1 : 0)) *
                      (widget.pulseWhenEnabled && !reduced ? _readyBreath.value : 1.0)
                  : 0.12;

              return AnimatedOpacity(
                duration: PulseMotion.slow,
                curve: PulseMotion.fade,
                opacity: _isEnabled ? 1.0 : 0.32,
                child: GestureDetector(
                  onTapDown: _isEnabled ? (_) => setState(() => _pressed = true) : null,
                  onTapUp: _isEnabled ? (_) => setState(() => _pressed = false) : null,
                  onTapCancel: () => setState(() => _pressed = false),
                  onTap: _isEnabled ? widget.onPressed : null,
                  child: AnimatedScale(
                    scale: _pressed ? 0.982 : 1.0,
                    duration: PulseMotion.fast,
                    curve: PulseMotion.fade,
                    child: AnimatedSlide(
                      offset: _pressed ? const Offset(0, 0.008) : Offset.zero,
                      duration: PulseMotion.fast,
                      curve: PulseMotion.fade,
                      child: PulseGlow(
                        intensity: glowIntensity,
                        spread: 18 + (_hovered ? 4 : 0),
                        animate: false,
                        child: AnimatedContainer(
                          duration: PulseMotion.slow,
                          curve: PulseMotion.fade,
                          constraints: const BoxConstraints(
                            minHeight: PulseMotion.minTouchTarget,
                          ),
                          width: double.infinity,
                          alignment: Alignment.center,
                          padding: const EdgeInsets.symmetric(vertical: 18),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: _isEnabled
                                  ? [
                                      Color.lerp(
                                        PulseColors.cyan,
                                        PulseColors.cyanSoft,
                                        _hovered ? 0.2 : 0,
                                      )!,
                                      PulseColors.cyanSoft,
                                    ]
                                  : [
                                      PulseColors.cyan.withValues(alpha: 0.35),
                                      PulseColors.cyanSoft.withValues(alpha: 0.25),
                                    ],
                            ),
                          ),
                          child: child,
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
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
    );
  }
}
