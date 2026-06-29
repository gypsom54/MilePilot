import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';

/// A single conversation line with optional per-line pause metadata.
class TypewriterLine {
  const TypewriterLine({required this.text, this.pauseAfter = const Duration(milliseconds: 680)});

  final String text;
  final Duration pauseAfter;
}

/// Calm typing animation — variable speed, natural pauses, never robotic.
class PulseTypewriter extends StatefulWidget {
  const PulseTypewriter({
    super.key,
    required this.lines,
    this.onComplete,
    this.style,
    this.lineGap = PulseMotion.lineGap,
    this.baseCharDelay = const Duration(milliseconds: 42),
    this.charDelayVariance = 0.15,
    this.startDelay = Duration.zero,
    this.align = TextAlign.center,
    this.skipAnimation = false,
  });

  final List<TypewriterLine> lines;
  final VoidCallback? onComplete;
  final TextStyle? style;
  final double lineGap;
  final Duration baseCharDelay;
  final double charDelayVariance;
  final Duration startDelay;
  final TextAlign align;
  final bool skipAnimation;

  /// Convenience constructor from plain strings with default pauses.
  factory PulseTypewriter.fromStrings(
    List<String> lines, {
    VoidCallback? onComplete,
    TextStyle? style,
    Duration baseCharDelay = const Duration(milliseconds: 42),
    Duration defaultPause = const Duration(milliseconds: 680),
    bool skipAnimation = false,
  }) {
    return PulseTypewriter(
      lines: lines.map((t) => TypewriterLine(text: t, pauseAfter: defaultPause)).toList(),
      onComplete: onComplete,
      style: style,
      baseCharDelay: baseCharDelay,
      skipAnimation: skipAnimation,
    );
  }

  @override
  State<PulseTypewriter> createState() => _PulseTypewriterState();
}

class _PulseTypewriterState extends State<PulseTypewriter> {
  final _rng = math.Random();
  final List<String> _visibleLines = [];
  int _lineIndex = 0;
  int _charIndex = 0;
  Timer? _timer;
  bool _complete = false;

  TextStyle get _style =>
      widget.style ?? PulseTypography.body(color: PulseColors.whiteSoft);

  @override
  void initState() {
    super.initState();
    if (widget.lines.isEmpty) {
      _finish();
      return;
    }

    if (widget.skipAnimation) {
      setState(() {
        _visibleLines.addAll(widget.lines.map((l) => l.text));
      });
      _finish();
      return;
    }

    _visibleLines.add('');
    Future<void>.delayed(widget.startDelay, _scheduleNext);
  }

  Duration _charDelay() {
    final variance = widget.charDelayVariance;
    final factor = 1.0 + (_rng.nextDouble() * 2 - 1) * variance;
    return Duration(
      milliseconds: (widget.baseCharDelay.inMilliseconds * factor).round().clamp(24, 90),
    );
  }

  void _scheduleNext() {
    if (!mounted || _complete) return;

    _timer = Timer(_charDelay(), () {
      if (!mounted) return;

      final current = widget.lines[_lineIndex];
      if (_charIndex < current.text.length) {
        _charIndex++;
        setState(() {
          _visibleLines[_lineIndex] = current.text.substring(0, _charIndex);
        });
        _scheduleNext();
        return;
      }

      if (_lineIndex < widget.lines.length - 1) {
        final pause = widget.lines[_lineIndex].pauseAfter;
        _timer = Timer(pause, () {
          if (!mounted) return;
          setState(() {
            _lineIndex++;
            _charIndex = 0;
            _visibleLines.add('');
          });
          _scheduleNext();
        });
        return;
      }

      _finish();
    });
  }

  void _finish() {
    _complete = true;
    widget.onComplete?.call();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: widget.align == TextAlign.center
          ? CrossAxisAlignment.center
          : CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < _visibleLines.length; i++)
          Padding(
            padding: EdgeInsets.only(
              bottom: i < _visibleLines.length - 1 ? widget.lineGap : 0,
            ),
            child: AnimatedOpacity(
              duration: PulseMotion.fast,
              curve: PulseMotion.fade,
              opacity: _visibleLines[i].isEmpty ? 0 : 1,
              child: Text(
                _visibleLines[i],
                textAlign: widget.align,
                style: _style,
              ),
            ),
          ),
      ],
    );
  }
}
