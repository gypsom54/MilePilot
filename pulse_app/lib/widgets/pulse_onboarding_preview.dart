import 'package:flutter/material.dart';
import 'package:pulse_app/widgets/pulse_glass_card.dart';

/// Screen 7 — static preview of the home dashboard before entering Pulse.
class PulseOnboardingPreview extends StatelessWidget {
  const PulseOnboardingPreview({super.key});

  @override
  Widget build(BuildContext context) {
    const cards = [
      ('Research Cabinet', 'Organise your peptide research in one place.'),
      ('Supply Estimates', 'See when inventory may run low.'),
      ('Trusted Education', 'Papers, videos and podcasts — saved for you.'),
    ];

    return Column(
      children: [
        for (var i = 0; i < cards.length; i++) ...[
          PulseGlassCard(
            title: cards[i].$1,
            subtitle: cards[i].$2,
            staggerIndex: i,
            animateIn: true,
          ),
          if (i < cards.length - 1) const SizedBox(height: 16),
        ],
      ],
    );
  }
}
