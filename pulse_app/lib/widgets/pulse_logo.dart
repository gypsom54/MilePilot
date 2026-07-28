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
    this.logoBreathe = 0.0,
    this.heartbeatHold = 1.0,
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
          child: Transform.scale(
            scale: 1.0 + (logoBreathe * 0.018),
            child: CustomPaint(
              painter: _PulseLogoPainter(
                heartbeatProgress: heartbeatProgress,
                heartbeatHold: heartbeatHold,
                pRevealProgress: pRevealProgress,
                letterOpacity: letterOpacity,
                showRemainingLetters: showRemainingLetters,
                logoSize: logoSize,
                letterSpacing: spacing,
                logoBreathe: logoBreathe,
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
    required this.heartbeatHold,
    required this.pRevealProgress,
    required this.letterOpacity,
    required this.showRemainingLetters,
    required this.logoSize,
    required this.letterSpacing,
    required this.logoBreathe,
  });

  final double heartbeatProgress;
  final double heartbeatHold;
  final double pRevealProgress;
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
    final eased = Curves.easeInOutSine.transform(heartbeatProgress.clamp(0.0, 1.0));
    final drawLength = metrics.length * eased;
    final drawn = metrics.extractPath(0, drawLength);

    final glowAlpha = 0.35 + (logoBreathe * 0.25);

    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..shader = ui.Gradient.linear(
        Offset(startX - 12, centerY),
        Offset(startX + totalWidth, centerY),
        [
          PulseColors.cyan.withValues(alpha: 0.12),
          PulseColors.cyan.withValues(alpha: 0.85 + logoBreathe * 0.15),
          PulseColors.cyanSoft,
        ],
        [0.0, 0.5, 1.0],
      );

    canvas.drawPath(
      drawn,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.0
        ..strokeCap = StrokeCap.round
        ..color = PulseColors.cyan.withValues(alpha: glowAlpha)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2.5),
    );

    canvas.drawPath(drawn, paint);
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
      final x1 = startX + width * t1;
      final x2 = startX + width * t2;
      final x3 = startX + width * t3;
      path.cubicTo(x1, centerY - y1, x2, centerY - y2, x3, centerY - y3);
    }

    path.lineTo(startX + width * 0.08, centerY);
    smooth(0.09, amplitude * 0.2, 0.10, amplitude * 0.4, 0.11, amplitude * 0.05);
    path.lineTo(startX + width * 0.12, centerY);
    smooth(0.13, amplitude * 0.3, 0.14, amplitude * 1.0, 0.155, -amplitude * 0.5);
    smooth(0.16, amplitude * 0.9, 0.17, amplitude * 0.7, 0.20, amplitude * 0.05);
    path.lineTo(startX + width * 0.24, centerY);
    smooth(0.25, amplitude * 0.25, 0.27, amplitude * 0.45, 0.29, amplitude * 0.1);
    path.lineTo(startX + width * 0.38, centerY);
    smooth(0.39, amplitude * 0.2, 0.42, amplitude * 0.95, 0.455, -amplitude * 0.45);
    smooth(0.46, amplitude * 0.85, 0.48, amplitude * 0.65, 0.55, amplitude * 0.05);
    path.lineTo(startX + width * 0.58, centerY);
    smooth(0.59, amplitude * 0.2, 0.62, amplitude * 0.5, 0.65, amplitude * 0.15);
    path.lineTo(startX + width * 0.78, centerY);
    path.lineTo(endX, centerY);

    return path;
  }

  void _paintLetterP(Canvas canvas, double startX, double centerY) {
    final letterHeight = logoSize;
    final stemWidth = logoSize * 0.11;
    final bowlRadius = logoSize * 0.28;
    final top = centerY - letterHeight / 2;
    final opacity = (pRevealProgress * heartbeatHold).clamp(0.0, 1.0);

    final glowPaint = Paint()
      ..color = PulseColors.cyan.withValues(alpha: (0.35 + logoBreathe * 0.2) * opacity)
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
        oldDelegate.heartbeatHold != heartbeatHold ||
        oldDelegate.pRevealProgress != pRevealProgress ||
        oldDelegate.letterOpacity != letterOpacity ||
        oldDelegate.logoBreathe != logoBreathe ||
        oldDelegate.showRemainingLetters != showRemainingLetters;
  }
}
