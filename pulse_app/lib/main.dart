import 'package:flutter/material.dart';
import 'package:pulse_app/core/brain/pulse_brain.dart';
import 'package:pulse_app/core/brain/pulse_brain_scope.dart';
import 'package:pulse_app/core/theme/pulse_theme.dart';
import 'package:pulse_app/screens/launch_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  PulseTheme.applySystemUI();
  final brain = await PulseBrain.initialize();
  runApp(PulseApp(brain: brain));
}

/// Pulse — premium, calm, deeply personal.
class PulseApp extends StatelessWidget {
  const PulseApp({super.key, required this.brain});

  final PulseBrain brain;

  @override
  Widget build(BuildContext context) {
    return PulseBrainScope(
      brain: brain,
      child: MaterialApp(
        title: 'Pulse',
        debugShowCheckedModeBanner: false,
        theme: PulseTheme.dark(),
        home: const LaunchScreen(),
      ),
    );
  }
}
