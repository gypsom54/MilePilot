import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';

/// Soft electric cyan glow — buttons, accents, and ambient light.
class PulseGlow extends StatelessWidget {
  const PulseGlow({
    super.key,
    required this.child,
    this.intensity = 1.0,
    this.spread = 24,
    this.color,
    this.animate = false,
  });

  final Widget child;
  final double intensity;
  final double spread;
  final Color? color;
  final bool animate;

  @override
  Widget build(BuildContext context) {
    final glowColor = color ?? PulseColors.cyan;

    if (!animate) {
      return _GlowBox(
        color: glowColor,
        intensity: intensity,
        spread: spread,
        child: child,
      );
    }

    return _AnimatedGlow(
      color: glowColor,
      intensity: intensity,
      spread: spread,
      child: child,
    );
  }
}

class _GlowBox extends StatelessWidget {
  const _GlowBox({
    required this.child,
    required this.color,
    required this.intensity,
    required this.spread,
  });

  final Widget child;
  final Color color;
  final double intensity;
  final double spread;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.35 * intensity),
            blurRadius: spread,
            spreadRadius: spread * 0.08,
          ),
          BoxShadow(
            color: color.withValues(alpha: 0.15 * intensity),
            blurRadius: spread * 1.8,
          ),
        ],
      ),
      child: child,
    );
  }
}

class _AnimatedGlow extends StatefulWidget {
  const _AnimatedGlow({
    required this.child,
    required this.color,
    required this.intensity,
    required this.spread,
  });

  final Widget child;
  final Color color;
  final double intensity;
  final double spread;

  @override
  State<_AnimatedGlow> createState() => _AnimatedGlowState();
}

class _AnimatedGlowState extends State<_AnimatedGlow>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _breath;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: PulseMotion.glowCycle,
    )..repeat(reverse: true);
    _breath = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: PulseMotion.breathe),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _breath,
      builder: (context, child) {
        return _GlowBox(
          color: widget.color,
          intensity: widget.intensity * _breath.value,
          spread: widget.spread,
          child: child!,
        );
      },
      child: widget.child,
    );
  }
}
