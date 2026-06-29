import 'dart:async';

import 'package:flutter/material.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';

/// Calm typing animation — characters glide in, never bounce.
class PulseTypewriter extends StatefulWidget {
  const PulseTypewriter({
    super.key,
    required this.lines,
    this.onComplete,
    this.style,
    this.lineGap = 12,
    this.charDelay = const Duration(milliseconds: 38),
    this.lineDelay = const Duration(milliseconds: 520),
    this.startDelay = Duration.zero,
    this.align = TextAlign.center,
  });

  final List<String> lines;
  final VoidCallback? onComplete;
  final TextStyle? style;
  final double lineGap;
  final Duration charDelay;
  final Duration lineDelay;
  final Duration startDelay;
  final TextAlign align;

  @override
  State<PulseTypewriter> createState() => _PulseTypewriterState();
}

class _PulseTypewriterState extends State<PulseTypewriter> {
  int _lineIndex = 0;
  int _charIndex = 0;
  final List<String> _visibleLines = [];
  Timer? _timer;
  bool _complete = false;

  TextStyle get _style =>
      widget.style ?? PulseTypography.body(color: PulseColors.whiteSoft);

  @override
  void initState() {
    super.initState();
    if (widget.lines.isEmpty) {
      _complete = true;
      WidgetsBinding.instance.addPostFrameCallback((_) => widget.onComplete?.call());
      return;
    }
    _visibleLines.add('');
    Future<void>.delayed(widget.startDelay, _scheduleNext);
  }

  void _scheduleNext() {
    if (!mounted || _complete) return;

    _timer = Timer(widget.charDelay, () {
      if (!mounted) return;

      final currentLine = widget.lines[_lineIndex];
      if (_charIndex < currentLine.length) {
        _charIndex++;
        setState(() {
          _visibleLines[_lineIndex] = currentLine.substring(0, _charIndex);
        });
        _scheduleNext();
        return;
      }

      if (_lineIndex < widget.lines.length - 1) {
        _timer = Timer(widget.lineDelay, () {
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

      _complete = true;
      widget.onComplete?.call();
    });
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
            padding: EdgeInsets.only(bottom: i < _visibleLines.length - 1 ? widget.lineGap : 0),
            child: AnimatedOpacity(
              duration: const Duration(milliseconds: 280),
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
