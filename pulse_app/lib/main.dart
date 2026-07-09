import 'package:flutter/material.dart';
import 'package:pulse_app/core/theme/pulse_theme.dart';
import 'package:pulse_app/screens/launch_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  PulseTheme.applySystemUI();
  runApp(const PulseApp());
}

/// Pulse — premium, calm, deeply personal.
class PulseApp extends StatelessWidget {
  const PulseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pulse',
      debugShowCheckedModeBanner: false,
      theme: PulseTheme.dark(),
      home: const LaunchScreen(),
    );
  }
}
