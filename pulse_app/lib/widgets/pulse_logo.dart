import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';

/// Pulse wordmark with integrated heartbeat line forming the letter P.
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

  @override
  Widget build(BuildContext context) {
    final logoSize = compact ? 36.0 : 48.0;
    final spacing = compact ? 3.0 : 5.0;

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
          child: CustomPaint(
            painter: _PulseLogoPainter(
              heartbeatProgress: heartbeatProgress,
              pRevealProgress: pRevealProgress,
              letterOpacity: letterOpacity,
              showRemainingLetters: showRemainingLetters,
              logoSize: logoSize,
              letterSpacing: spacing,
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
        if (showTagline) ...[
          const SizedBox(height: 22),
          AnimatedOpacity(
            duration: const Duration(milliseconds: 600),
            opacity: taglineOpacity,
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
    required this.pRevealProgress,
    required this.letterOpacity,
    required this.showRemainingLetters,
    required this.logoSize,
    required this.letterSpacing,
  });

  final double heartbeatProgress;
  final double pRevealProgress;
  final double letterOpacity;
  final bool showRemainingLetters;
  final double logoSize;
  final double letterSpacing;

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
      showRemainingLetters: showRemainingLetters,
    );
    final startX = (size.width - totalWidth) / 2;

    _paintHeartbeat(canvas, size, centerY, startX, totalWidth);

    if (pRevealProgress > 0) {
      _paintLetterP(canvas, startX, centerY);
    }

    if (showRemainingLetters && letterOpacity > 0) {
      _paintRemainingLetters(canvas, startX, centerY);
    }
  }

  void _paintHeartbeat(Canvas canvas, Size size, double centerY, double startX, double totalWidth) {
    if (heartbeatProgress <= 0) return;

    final path = _heartbeatPath(
      startX: startX - 12,
      endX: startX + totalWidth * 0.72,
      centerY: centerY,
      amplitude: logoSize * 0.22,
    );

    final metrics = path.computeMetrics().first;
    final drawLength = metrics.length * heartbeatProgress.clamp(0.0, 1.0);
    final drawn = metrics.extractPath(0, drawLength);

    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.2
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..shader = ui.Gradient.linear(
        Offset(startX - 12, centerY),
        Offset(startX + totalWidth, centerY),
        [
          PulseColors.cyan.withValues(alpha: 0.15),
          PulseColors.cyan,
          PulseColors.cyanSoft,
        ],
        [0.0, 0.5, 1.0],
      );

    canvas.drawPath(
      drawn,
      paint
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 1.2)
        ..color = PulseColors.cyan.withValues(alpha: 0.85),
    );

    canvas.drawPath(drawn, paint..maskFilter = null);
  }

  Path _heartbeatPath({
    required double startX,
    required double endX,
    required double centerY,
    required double amplitude,
  }) {
    final width = endX - startX;
    final path = Path()..moveTo(startX, centerY);

    void flat(double t) => path.lineTo(startX + width * t, centerY);
    void spike(double t, double h) =>
        path.lineTo(startX + width * t, centerY - h);

    flat(0.08);
    spike(0.10, amplitude * 0.35);
    flat(0.12);
    spike(0.14, amplitude);
    spike(0.155, -amplitude * 0.55);
    spike(0.17, amplitude * 0.75);
    flat(0.24);
    spike(0.26, amplitude * 0.4);
    flat(0.28);
    spike(0.30, amplitude * 0.85);
    flat(0.38);
    spike(0.40, amplitude * 0.3);
    flat(0.42);
    spike(0.44, amplitude * 0.95);
    spike(0.455, -amplitude * 0.5);
    spike(0.47, amplitude * 0.7);
    flat(0.58);
    spike(0.60, amplitude * 0.35);
    flat(0.62);
    spike(0.64, amplitude);
    flat(0.78);
    path.lineTo(endX, centerY);

    return path;
  }

  void _paintLetterP(Canvas canvas, double startX, double centerY) {
    final letterHeight = logoSize;
    final stemWidth = logoSize * 0.11;
    final bowlRadius = logoSize * 0.28;
    final top = centerY - letterHeight / 2;
    final opacity = pRevealProgress.clamp(0.0, 1.0);

    final glowPaint = Paint()
      ..color = PulseColors.cyan.withValues(alpha: 0.35 * opacity)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);

    final fillPaint = Paint()
      ..shader = ui.Gradient.linear(
        Offset(startX, top),
        Offset(startX + logoSize * 0.5, top + letterHeight),
        [
          PulseColors.cyan.withValues(alpha: opacity),
          PulseColors.cyanSoft.withValues(alpha: opacity * 0.85),
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
      final stagger = (i + 1) * 0.18;
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

      textPainter.paint(
        canvas,
        Offset(x, centerY - logoSize / 2 - 2),
      );
      x += letterWidth + letterSpacing;
    }
  }

  @override
  bool shouldRepaint(covariant _PulseLogoPainter oldDelegate) {
    return oldDelegate.heartbeatProgress != heartbeatProgress ||
        oldDelegate.pRevealProgress != pRevealProgress ||
        oldDelegate.letterOpacity != letterOpacity ||
        oldDelegate.showRemainingLetters != showRemainingLetters;
  }
}
