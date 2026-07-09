import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:pulse_app/core/conversation/pulse_logo_phases.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';

/// Pulse wordmark — heartbeat morphs into P as one continuous animation.
class PulseLogo extends StatelessWidget {
  const PulseLogo({
    super.key,
    this.showTagline = true,
    this.showRemainingLetters = true,
    this.heartbeatProgress = 1.0,
    this.pRevealProgress = 1.0,
    this.letterOpacity = 1.0,
    this.taglineOpacity = 1.0,
    this.dotOpacity = 0.0,
    this.dotPulse = 0.0,
    this.compact = false,
    this.logoBreathe = 0.0,
    this.heartbeatHold = 1.0,
    this.sequenceProgress,
  });

  final bool showTagline;
  final bool showRemainingLetters;
  final double heartbeatProgress;
  final double pRevealProgress;
  final double letterOpacity;
  final double taglineOpacity;
  final double dotOpacity;
  final double dotPulse;
  final bool compact;
  final double logoBreathe;
  final double heartbeatHold;
  /// When set, drives the unified heartbeat → P → ULSE → glow timeline.
  final double? sequenceProgress;

  @override
  Widget build(BuildContext context) {
    final logoSize = compact ? 36.0 : 48.0;
    final spacing = compact ? 3.0 : 5.0;

    final seq = sequenceProgress;
    final draw = seq != null ? PulseLogoPhases.heartbeatDraw(seq) : heartbeatProgress;
    final morph = seq != null ? PulseLogoPhases.morphToP(seq) : pRevealProgress;
    final letters = seq != null ? PulseLogoPhases.letters(seq) : letterOpacity;
    final breathe = seq != null
        ? PulseLogoPhases.glow(seq) * (0.4 + logoBreathe * 0.6)
        : logoBreathe;
    final tagline = seq != null ? PulseLogoPhases.tagline(seq) : taglineOpacity;
    final lineFade = seq != null ? PulseLogoPhases.lineOpacity(seq) : 1.0;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (dotOpacity > 0)
          Padding(
            padding: const EdgeInsets.only(bottom: 28),
            child: Opacity(
              opacity: dotOpacity,
              child: _PulseDot(pulse: dotPulse),
            ),
          ),
        SizedBox(
          height: logoSize + 8,
          child: Transform.scale(
            scale: 1.0 + (breathe * 0.022),
            child: CustomPaint(
              painter: _PulseLogoPainter(
                heartbeatProgress: draw,
                morphProgress: morph,
                lineOpacity: lineFade,
                letterOpacity: letters,
                showRemainingLetters: showRemainingLetters && letters > 0.04,
                logoSize: logoSize,
                letterSpacing: spacing,
                logoBreathe: breathe,
              ),
              size: Size(
                _PulseLogoPainter.estimatedWidth(
                  logoSize: logoSize,
                  letterSpacing: spacing,
                  showRemainingLetters: showRemainingLetters,
                ),
                logoSize + 8,
              ),
            ),
          ),
        ),
        if (showTagline) ...[
          const SizedBox(height: 22),
          AnimatedOpacity(
            duration: const Duration(milliseconds: 600),
            opacity: tagline,
            child: Text(
              'Keep your finger on the Pulse.',
              textAlign: TextAlign.center,
              style: PulseTypography.tagline(),
            ),
          ),
        ],
      ],
    );
  }
}

class _PulseDot extends StatelessWidget {
  const _PulseDot({required this.pulse});

  final double pulse;

  @override
  Widget build(BuildContext context) {
    final scale = 0.85 + (pulse * 0.3);
    final glow = 0.4 + (pulse * 0.6);

    return Transform.scale(
      scale: scale,
      child: Container(
        width: 6,
        height: 6,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: PulseColors.cyan,
          boxShadow: [
            BoxShadow(
              color: PulseColors.cyan.withValues(alpha: 0.55 * glow),
              blurRadius: 14 + (pulse * 10),
              spreadRadius: 2 + (pulse * 4),
            ),
          ],
        ),
      ),
    );
  }
}

class _PulseLogoPainter extends CustomPainter {
  _PulseLogoPainter({
    required this.heartbeatProgress,
    required this.morphProgress,
    required this.lineOpacity,
    required this.letterOpacity,
    required this.showRemainingLetters,
    required this.logoSize,
    required this.letterSpacing,
    required this.logoBreathe,
  });

  final double heartbeatProgress;
  final double morphProgress;
  final double lineOpacity;
  final double letterOpacity;
  final bool showRemainingLetters;
  final double logoSize;
  final double letterSpacing;
  final double logoBreathe;

  static double estimatedWidth({
    required double logoSize,
    required double letterSpacing,
    required bool showRemainingLetters,
  }) {
    const letters = 5;
    final letterWidth = logoSize * 0.62;
    if (!showRemainingLetters) return logoSize * 1.1;
    return letterWidth * letters + letterSpacing * (letters - 1) + 24;
  }

  @override
  void paint(Canvas canvas, Size size) {
    final centerY = size.height / 2;
    final totalWidth = estimatedWidth(
      logoSize: logoSize,
      letterSpacing: letterSpacing,
      showRemainingLetters: true,
    );
    final startX = (size.width - totalWidth) / 2;
    final pStartX = startX;

    if (heartbeatProgress > 0 && lineOpacity > 0.02) {
      _paintHeartbeat(canvas, centerY, pStartX, totalWidth);
    }

    if (morphProgress > 0) {
      _paintLetterP(canvas, pStartX, centerY);
    }

    if (showRemainingLetters && letterOpacity > 0) {
      _paintRemainingLetters(canvas, startX, centerY);
    }
  }

  void _paintHeartbeat(Canvas canvas, double centerY, double startX, double totalWidth) {
    final path = _heartbeatPath(
      startX: startX - 8,
      endX: startX + logoSize * 0.58,
      centerY: centerY,
      amplitude: logoSize * 0.20,
    );

    final metrics = path.computeMetrics().first;
    final eased = Curves.easeInOutSine.transform(heartbeatProgress.clamp(0.0, 1.0));
    final drawLength = metrics.length * eased;
    final drawn = metrics.extractPath(0, drawLength);

    final alpha = lineOpacity.clamp(0.0, 1.0);
    final glowAlpha = (0.35 + logoBreathe * 0.25) * alpha;

    final stroke = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0 + morphProgress * 0.5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..shader = ui.Gradient.linear(
        Offset(startX, centerY),
        Offset(startX + totalWidth * 0.5, centerY),
        [
          PulseColors.cyan.withValues(alpha: 0.1 * alpha),
          PulseColors.cyan.withValues(alpha: 0.9 * alpha),
        ],
      );

    canvas.drawPath(
      drawn,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.2
        ..strokeCap = StrokeCap.round
        ..color = PulseColors.cyan.withValues(alpha: glowAlpha)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2.5),
    );
    canvas.drawPath(drawn, stroke);
  }

  Path _heartbeatPath({
    required double startX,
    required double endX,
    required double centerY,
    required double amplitude,
  }) {
    final width = endX - startX;
    final path = Path()..moveTo(startX, centerY);

    void smooth(double t1, double y1, double t2, double y2, double t3, double y3) {
      path.cubicTo(
        startX + width * t1, centerY - y1,
        startX + width * t2, centerY - y2,
        startX + width * t3, centerY - y3,
      );
    }

    path.lineTo(startX + width * 0.10, centerY);
    smooth(0.11, amplitude * 0.25, 0.13, amplitude * 0.45, 0.15, amplitude * 0.05);
    path.lineTo(startX + width * 0.18, centerY);
    smooth(0.19, amplitude * 0.35, 0.21, amplitude * 1.0, 0.23, -amplitude * 0.45);
    smooth(0.24, amplitude * 0.85, 0.26, amplitude * 0.65, 0.32, amplitude * 0.08);
    path.lineTo(startX + width * 0.40, centerY);
    smooth(0.42, amplitude * 0.3, 0.46, amplitude * 0.9, 0.50, -amplitude * 0.35);
    // Final bend upward into P bowl
    smooth(0.52, amplitude * 0.7, 0.58, amplitude * 1.1, 0.62, -amplitude * 1.4);
    path.lineTo(startX + width * 0.68, centerY - amplitude * 1.35);

    return path;
  }

  void _paintLetterP(Canvas canvas, double startX, double centerY) {
    final letterHeight = logoSize;
    final stemWidth = logoSize * 0.11;
    final bowlRadius = logoSize * 0.28;
    final top = centerY - letterHeight / 2;
    final opacity = morphProgress.clamp(0.0, 1.0);

    final glowPaint = Paint()
      ..color = PulseColors.cyan.withValues(alpha: (0.4 + logoBreathe * 0.2) * opacity)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);

    final fillPaint = Paint()
      ..shader = ui.Gradient.linear(
        Offset(startX, top),
        Offset(startX + logoSize * 0.5, top + letterHeight),
        [
          PulseColors.cyan.withValues(alpha: opacity),
          PulseColors.cyanSoft.withValues(alpha: opacity * 0.88),
        ],
      );

    final pPath = Path()
      ..moveTo(startX, top)
      ..lineTo(startX, top + letterHeight)
      ..lineTo(startX + stemWidth, top + letterHeight)
      ..lineTo(startX + stemWidth, centerY)
      ..arcToPoint(
        Offset(startX + stemWidth + bowlRadius * 2, centerY),
        radius: Radius.circular(bowlRadius),
        clockwise: false,
      )
      ..arcToPoint(
        Offset(startX + stemWidth, centerY - bowlRadius * 1.6),
        radius: Radius.circular(bowlRadius),
        clockwise: false,
      )
      ..lineTo(startX + stemWidth, top)
      ..close();

    canvas.drawPath(pPath, glowPaint);
    canvas.drawPath(pPath, fillPaint);
  }

  void _paintRemainingLetters(Canvas canvas, double startX, double centerY) {
    const letters = 'ULSE';
    final letterWidth = logoSize * 0.62;
    final pWidth = logoSize * 0.62;
    var x = startX + pWidth + letterSpacing;

    for (var i = 0; i < letters.length; i++) {
      final stagger = (i + 1) * 0.16;
      final opacity = (letterOpacity - stagger).clamp(0.0, 1.0);
      if (opacity <= 0) continue;

      final textPainter = TextPainter(
        text: TextSpan(
          text: letters[i],
          style: PulseTypography.display(
            size: logoSize,
            letterSpacing: 0,
            color: PulseColors.white.withValues(alpha: opacity),
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();

      textPainter.paint(canvas, Offset(x, centerY - logoSize / 2 - 2));
      x += letterWidth + letterSpacing;
    }
  }

  @override
  bool shouldRepaint(covariant _PulseLogoPainter oldDelegate) {
    return oldDelegate.heartbeatProgress != heartbeatProgress ||
        oldDelegate.morphProgress != morphProgress ||
        oldDelegate.lineOpacity != lineOpacity ||
        oldDelegate.letterOpacity != letterOpacity ||
        oldDelegate.logoBreathe != logoBreathe ||
        oldDelegate.showRemainingLetters != showRemainingLetters;
  }
}
