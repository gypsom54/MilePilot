import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulse_app/main.dart';

void main() {
  testWidgets('Pulse app launches', (WidgetTester tester) async {
    await tester.pumpWidget(const PulseApp());
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
