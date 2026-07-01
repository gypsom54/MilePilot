import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';

/// Frosted glass card — rounded, soft shadow, tiny cyan glow.
class PulseGlassCard extends StatefulWidget {
  const PulseGlassCard({
    super.key,
    required this.title,
    required this.subtitle,
    this.onTap,
    this.staggerIndex = 0,
    this.animateIn = true,
  });

  final String title;
  final String subtitle;
  final VoidCallback? onTap;
  final int staggerIndex;
  final bool animateIn;

  @override
  State<PulseGlassCard> createState() => _PulseGlassCardState();
}

class _PulseGlassCardState extends State<PulseGlassCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _enter;
  late final Animation<double> _fade;
  late final Animation<Offset> _slide;
  bool _pressed = false;

  @override
  void initState() {
    super.initState();
    _enter = AnimationController(
      vsync: this,
      duration: PulseMotion.glide,
    );
    _fade = CurvedAnimation(parent: _enter, curve: PulseMotion.fade);
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.025),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _enter, curve: PulseMotion.glideIn));

    if (!widget.animateIn) {
      _enter.value = 1.0;
      return;
    }

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (PulseMotion.reducedMotion(context)) {
        _enter.value = 1.0;
        return;
      }
      Future<void>.delayed(
        Duration(milliseconds: 320 + widget.staggerIndex * 150),
        () {
          if (mounted) _enter.forward();
        },
      );
    });
  }

  @override
  void dispose() {
    _enter.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fade,
      child: SlideTransition(
        position: _slide,
        child: GestureDetector(
          onTapDown: widget.onTap != null ? (_) => setState(() => _pressed = true) : null,
          onTapUp: widget.onTap != null ? (_) => setState(() => _pressed = false) : null,
          onTapCancel: () => setState(() => _pressed = false),
          onTap: widget.onTap,
          child: AnimatedScale(
            scale: _pressed ? 0.992 : 1.0,
            duration: PulseMotion.fast,
            curve: PulseMotion.fade,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(24),
                    color: PulseColors.white.withValues(alpha: 0.06),
                    border: Border.all(
                      color: PulseColors.white.withValues(alpha: 0.1),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.35),
                        blurRadius: 28,
                        offset: const Offset(0, 12),
                      ),
                      BoxShadow(
                        color: PulseColors.cyan.withValues(alpha: 0.06),
                        blurRadius: 24,
                        spreadRadius: -4,
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 26,
                      vertical: 28,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.title,
                          style: PulseTypography.heading(
                            size: 20,
                            weight: FontWeight.w600,
                            color: PulseColors.white,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          widget.subtitle,
                          style: PulseTypography.body(
                            size: 15,
                            color: PulseColors.whiteMuted,
                          ),
                        ),
                      ],
                    ),
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
