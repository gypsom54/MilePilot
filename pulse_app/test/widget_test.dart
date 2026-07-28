import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulse_app/core/brain/pulse_brain.dart';
import 'package:pulse_app/main.dart';

void main() {
  tearDown(PulseBrain.resetForTest);

  testWidgets('Pulse app launches', (WidgetTester tester) async {
    final brain = await PulseBrain.initializeForTest();
    await tester.pumpWidget(PulseApp(brain: brain));
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
