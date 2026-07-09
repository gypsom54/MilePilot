import 'package:flutter/material.dart';
import 'package:pulse_app/core/brain/pulse_brain.dart';

/// Exposes [PulseBrain] to the widget tree.
class PulseBrainScope extends InheritedNotifier<PulseBrain> {
  const PulseBrainScope({
    super.key,
    required PulseBrain brain,
    required super.child,
  }) : super(notifier: brain);

  static PulseBrain of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<PulseBrainScope>();
    assert(scope != null, 'PulseBrainScope not found in widget tree');
    return scope!.notifier!;
  }
}
