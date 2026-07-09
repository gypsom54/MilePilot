import 'package:flutter/material.dart';
import 'package:pulse_app/widgets/pulse_mini_logo.dart';

/// Consistent onboarding header — fixed height, animated mark, no layout jump.
class PulseHeader extends StatelessWidget {
  const PulseHeader({super.key});

  static const double height = 72;

  @override
  Widget build(BuildContext context) {
    return const SizedBox(
      height: height,
      width: double.infinity,
      child: Center(
        child: PulseMiniLogo(),
      ),
    );
  }
}
