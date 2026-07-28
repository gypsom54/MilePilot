import 'package:flutter/material.dart';
import 'package:pulse_app/core/motion/pulse_motion.dart';
import 'package:pulse_app/core/theme/pulse_colors.dart';
import 'package:pulse_app/core/theme/pulse_typography.dart';

enum PulseNavTab { home, cabinet, learn, journal, pulse }

/// Five-tab bottom navigation — glass bar, cyan glow on active tab.
class PulseBottomNav extends StatelessWidget {
  const PulseBottomNav({
    super.key,
    required this.current,
    required this.onChanged,
  });

  final PulseNavTab current;
  final ValueChanged<PulseNavTab> onChanged;

  static const _items = [
    (PulseNavTab.home, 'Home', Icons.home_outlined, Icons.home_rounded),
    (PulseNavTab.cabinet, 'Cabinet', Icons.inventory_2_outlined, Icons.inventory_2_rounded),
    (PulseNavTab.learn, 'Learn', Icons.auto_stories_outlined, Icons.auto_stories_rounded),
    (PulseNavTab.journal, 'Journal', Icons.book_outlined, Icons.book_rounded),
    (PulseNavTab.pulse, 'Pulse', Icons.bolt_outlined, Icons.bolt_rounded),
  ];

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      label: 'Main navigation',
      child: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: PulseColors.graphiteElevated.withValues(alpha: 0.92),
            border: Border(
              top: BorderSide(color: PulseColors.white.withValues(alpha: 0.08)),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.4),
                blurRadius: 24,
                offset: const Offset(0, -8),
              ),
            ],
          ),
          child: SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  for (final item in _items)
                    _NavItem(
                      label: item.$2,
                      icon: item.$3,
                      activeIcon: item.$4,
                      selected: current == item.$1,
                      onTap: () => onChanged(item.$1),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.label,
    required this.icon,
    required this.activeIcon,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final IconData activeIcon;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      selected: selected,
      label: label,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: ConstrainedBox(
          constraints: const BoxConstraints(
            minWidth: PulseMotion.minTouchTarget,
            minHeight: PulseMotion.minTouchTarget,
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Stack(
                  alignment: Alignment.bottomCenter,
                  clipBehavior: Clip.none,
                  children: [
                    AnimatedSwitcher(
                      duration: PulseMotion.fast,
                      child: Icon(
                        selected ? activeIcon : icon,
                        key: ValueKey(selected),
                        size: 22,
                        color: selected ? PulseColors.cyan : PulseColors.whiteMuted,
                      ),
                    ),
                    Positioned(
                      bottom: -6,
                      child: AnimatedOpacity(
                        duration: PulseMotion.medium,
                        opacity: selected ? 1 : 0,
                        child: Container(
                          width: 18,
                          height: 2,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(999),
                            color: PulseColors.cyan,
                            boxShadow: [
                              BoxShadow(
                                color: PulseColors.cyan.withValues(alpha: 0.5),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                AnimatedDefaultTextStyle(
                  duration: PulseMotion.fast,
                  style: PulseTypography.caption(
                    size: 11,
                    color: selected ? PulseColors.white : PulseColors.whiteDim,
                  ),
                  child: Text(label),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
