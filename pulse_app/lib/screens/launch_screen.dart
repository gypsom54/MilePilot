import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/screens/conversation_screen.dart';
import 'package:pulse_app/widgets/pulse_background.dart';
import 'package:pulse_app/widgets/pulse_logo.dart';
import 'package:pulse_app/widgets/pulse_transition.dart';

/// Cinematic opening — black, dot, heartbeat, PULSE, breathe, fade.
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
  late final Animation<double> _heartbeatHold;
  late final Animation<double> _pReveal;
  late final Animation<double> _letters;
  late final Animation<double> _tagline;
  late final Animation<double> _logoBreathe;
  late final Animation<double> _exitFade;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: PulseMotion.launch,
    );

    // ~1s black, then dot
    _dotOpacity = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 19),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(CurveTween(curve: PulseMotion.fade)),
        weight: 6,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 75),
    ]).animate(_controller);

    _dotPulse = CurvedAnimation(
      parent: _controller,
      curve: const Interval(0.19, 1.0, curve: PulseMotion.breathe),
    );

    // Heartbeat draws slowly with sine curve
    _heartbeat = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 19),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(CurveTween(curve: PulseMotion.draw)),
        weight: 28,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 53),
    ]).animate(_controller);

    // +500ms hold after heartbeat completes
    _heartbeatHold = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 47),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 10),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 43),
    ]).animate(_controller);

    _pReveal = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 52),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(CurveTween(curve: PulseMotion.fade)),
        weight: 10,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 38),
    ]).animate(_controller);

    _letters = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 58),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(CurveTween(curve: PulseMotion.fade)),
        weight: 12,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 30),
    ]).animate(_controller);

    _tagline = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 66),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(CurveTween(curve: PulseMotion.fade)),
        weight: 10,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 24),
    ]).animate(_controller);

    // Logo breathes before exit
    _logoBreathe = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(0.0), weight: 72),
      TweenSequenceItem(
        tween: Tween(begin: 0.0, end: 1.0).chain(CurveTween(curve: PulseMotion.breathe)),
        weight: 14,
      ),
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 14),
    ]).animate(_controller);

    // Slower fade out
    _exitFade = TweenSequence<double>([
      TweenSequenceItem(tween: ConstantTween(1.0), weight: 82),
      TweenSequenceItem(
        tween: Tween(begin: 1.0, end: 0.0).chain(CurveTween(curve: PulseMotion.breathe)),
        weight: 18,
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

  double _naturalPulse(double t) {
    return 0.5 + 0.5 * (1 + math.sin(t * 10 * math.pi)) / 2;
  }

  @override
  Widget build(BuildContext context) {
    final reduced = PulseMotion.reducedMotion(context);

    return Scaffold(
      backgroundColor: Colors.black,
      body: PulseBackground(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            final breathe = reduced
                ? 0.0
                : _naturalPulse(_logoBreathe.value) * _logoBreathe.value;

            return Opacity(
              opacity: _exitFade.value,
              child: Center(
                child: PulseLogo(
                  showRemainingLetters: _letters.value > 0.05,
                  heartbeatProgress: _heartbeat.value,
                  heartbeatHold: _heartbeatHold.value,
                  pRevealProgress: _pReveal.value,
                  letterOpacity: _letters.value,
                  taglineOpacity: _tagline.value,
                  dotOpacity: _dotOpacity.value,
                  dotPulse: _naturalPulse(_dotPulse.value),
                  logoBreathe: breathe,
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
