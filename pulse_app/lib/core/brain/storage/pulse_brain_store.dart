import 'package:pulse_app/core/brain/models/pulse_memory.dart';

/// Persistence contract — swap implementations (local, cloud, test).
abstract class PulseBrainStore {
  Future<PulseMemory?> load();
  Future<void> save(PulseMemory memory);
}

/// In-memory store for tests and previews.
class InMemoryPulseBrainStore implements PulseBrainStore {
  PulseMemory? _memory;

  @override
  Future<PulseMemory?> load() async => _memory;

  @override
  Future<void> save(PulseMemory memory) async {
    _memory = memory;
  }
}
