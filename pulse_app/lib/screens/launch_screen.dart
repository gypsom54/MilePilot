import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/screens/conversation_screen.dart';
import 'package:pulse_app/widgets/pulse_background.dart';
import 'package:pulse_app/widgets/pulse_logo.dart';
import 'package:pulse_app/widgets/pulse_transition.dart';

/// Cinematic opening — one continuous heartbeat → PULSE → glow → tagline.
class LaunchScreen extends StatefulWidget {
  const LaunchScreen({super.key});

  @override
  State<LaunchScreen> createState() => _LaunchScreenState();
}

class _LaunchScreenState extends State<LaunchScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _dotOpacity;
  late final Animation<double> _dotPulse;
  late final Animation<double> _sequence;
  late final Animation<double> _exitFade;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: PulseMotion.launch,
    );

    _dotOpacity = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 14),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(CurveTween(curve: PulseMotion.fade)),
        weight: 6,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 80),
    ]).animate(_controller);

    _dotPulse = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.14, 1.0, curve: PulseMotion.breathe),
    );

    // Unified sequence: heartbeat → morph → ULSE → glow → tagline
    _sequence = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 14),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(CurveTween(curve: PulseMotion.draw)),
        weight: 72,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 14),
    ]).animate(_controller);

    _exitFade = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 84),
      TweenSequenceItem(
        tween: Tween(begin: 1.0, end: 0.0).chain(CurveTween(curve: PulseMotion.breathe)),
        weight: 16,
      ),
    ]).animate(_controller);

    _controller.forward();
    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed && mounted) {
        _goToOnboarding();
      }
    });
  }

  void _goToOnboarding() {
    Navigator.of(context).pushReplacement(
      PulseTransition.route(
        const ConversationScreen(
          assetPath: 'assets/conversations/onboarding_name.json',
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  double _naturalPulse(double t) =>
      0.5 + 0.5 * (1 + math.sin(t * 10 * math.pi)) / 2;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: PulseBackground(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Opacity(
              opacity: _exitFade.value,
              child: Center(
                child: PulseLogo(
                  sequenceProgress: _sequence.value,
                  dotOpacity: _dotOpacity.value,
                  dotPulse: _naturalPulse(_dotPulse.value),
                  logoBreathe: _naturalPulse(_sequence.value),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
