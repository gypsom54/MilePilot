import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:pulse_app/screens/onboarding_name_screen.dart';
import 'package:pulse_app/widgets/pulse_background.dart';
import 'package:pulse_app/widgets/pulse_logo.dart';
import 'package:pulse_app/widgets/pulse_transition.dart';

/// Opening sequence — black screen, cyan dot, heartbeat line, PULSE reveal.
class LaunchScreen extends StatefulWidget {
  const LaunchScreen({super.key});

  @override
  State<LaunchScreen> createState() => _LaunchScreenState();
}

class _LaunchScreenState extends State<LaunchScreen>
    with TickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _dotOpacity;
  late final Animation<double> _dotPulse;
  late final Animation<double> _heartbeat;
  late final Animation<double> _pReveal;
  late final Animation<double> _letters;
  late final Animation<double> _tagline;
  late final Animation<double> _exitFade;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 4200),
    );

    _dotOpacity = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 24),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(
          CurveTween(curve: Curves.easeOut),
        ),
        weight: 8,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 68),
    ]).animate(_controller);

    _dotPulse = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.24, 1.0, curve: Curves.easeInOut),
    );

    _heartbeat = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 24),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(
          CurveTween(curve: Curves.easeInOutCubic),
        ),
        weight: 34,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 42),
    ]).animate(_controller);

    _pReveal = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 52),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(
          CurveTween(curve: Curves.easeOutCubic),
        ),
        weight: 14,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 34),
    ]).animate(_controller);

    _letters = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 62),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(
          CurveTween(curve: Curves.easeOut),
        ),
        weight: 14,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 24),
    ]).animate(_controller);

    _tagline = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 72),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(
          CurveTween(curve: Curves.easeOut),
        ),
        weight: 12,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 16),
    ]).animate(_controller);

    _exitFade = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 86),
      TweenSequenceItem(
        tween: Tween(begin: 1.0, end: 0.0).chain(
          CurveTween(curve: Curves.easeInOut),
        ),
        weight: 14,
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
      PulseTransition.route(const OnboardingNameScreen()),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  double _breathingPulse(double t) {
    return 0.5 + 0.5 * (1 + math.sin(t * 12 * math.pi)) / 2;
  }

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
                  showRemainingLetters: _letters.value > 0.05,
                  heartbeatProgress: _heartbeat.value,
                  pRevealProgress: _pReveal.value,
                  letterOpacity: _letters.value,
                  taglineOpacity: _tagline.value,
                  dotOpacity: _dotOpacity.value,
                  dotPulse: _breathingPulse(_dotPulse.value),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
