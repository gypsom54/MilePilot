import 'package:flutter/material.dart';
import 'package:pulse_app/core/brain/models/pulse_recommendations.dart';
import 'package:pulse_app/core/brain/pulse_brain.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';
import 'package:pulse_app/widgets/pulse_glass_card.dart';
import 'package:pulse_app/widgets/pulse_primary_button.dart';

/// PS-004 — Welcome Home. All copy from the Brain.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _headline;
  late final Animation<double> _headlineFade;
  late final Animation<Offset> _headlineSlide;
  late Future<PulseHomeRecommendations> _recommendations;

  @override
  void initState() {
    super.initState();
    _headline = AnimationController(
      vsync: this,
      duration: PulseMotion.cinematic,
    );
    _headlineFade = CurvedAnimation(parent: _headline, curve: PulseMotion.fade);
    _headlineSlide = Tween<Offset>(
      begin: const Offset(0, 0.025),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _headline, curve: PulseMotion.glideIn));

    _loadRecommendations();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (PulseMotion.reducedMotion(context)) {
        _headline.value = 1.0;
      } else {
        _headline.forward();
      }
    });
  }

  void _loadRecommendations() {
    _recommendations = PulseBrain.instance.homeRecommendations();
  }

  @override
  void dispose() {
    _headline.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<PulseHomeRecommendations>(
      future: _recommendations,
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const SizedBox.shrink();
        final rec = snapshot.data!;

        return CustomScrollView(
          physics: const BouncingScrollPhysics(
            parent: AlwaysScrollableScrollPhysics(),
          ),
          slivers: [
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(
                PulseMotion.screenPadding,
                28,
                PulseMotion.screenPadding,
                0,
              ),
              sliver: SliverToBoxAdapter(
                child: FadeTransition(
                  opacity: _headlineFade,
                  child: SlideTransition(
                    position: _headlineSlide,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          rec.greetingLine,
                          style: PulseTypography.heading(
                            size: 32,
                            weight: FontWeight.w700,
                            color: PulseColors.white,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          rec.welcomeLine,
                          style: PulseTypography.heading(
                            size: 22,
                            weight: FontWeight.w500,
                            color: PulseColors.whiteSoft,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          rec.subtitleLine,
                          style: PulseTypography.body(
                            size: 16,
                            color: PulseColors.whiteMuted,
                          ),
                        ),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.symmetric(
                horizontal: PulseMotion.screenPadding,
              ),
              sliver: SliverList.separated(
                itemCount: rec.cards.length,
                separatorBuilder: (_, __) => const SizedBox(height: 20),
                itemBuilder: (context, index) {
                  final card = rec.cards[index];
                  return PulseGlassCard(
                    title: card.title,
                    subtitle: card.subtitle,
                    staggerIndex: index + 1,
                  );
                },
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(
                PulseMotion.screenPadding,
                40,
                PulseMotion.screenPadding,
                128,
              ),
              sliver: SliverToBoxAdapter(
                child: PulsePrimaryButton(
                  label: rec.primaryCta.label,
                  enabled: rec.primaryCta.enabled,
                  onPressed: rec.primaryCta.enabled ? () {} : null,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
