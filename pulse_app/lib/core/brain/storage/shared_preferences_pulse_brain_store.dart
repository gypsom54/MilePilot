import 'dart:convert';

import 'package:pulse_app/core/brain/models/pulse_memory.dart';
import 'package:pulse_app/core/brain/storage/pulse_brain_store.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _storageKey = 'pulse_brain_memory_v1';

/// Local persistence via SharedPreferences.
class SharedPreferencesPulseBrainStore implements PulseBrainStore {
  SharedPreferencesPulseBrainStore(this._prefs);

  final SharedPreferences _prefs;

  static Future<SharedPreferencesPulseBrainStore> create() async {
    final prefs = await SharedPreferences.getInstance();
    return SharedPreferencesPulseBrainStore(prefs);
  }

  @override
  Future<PulseMemory?> load() async {
    final raw = _prefs.getString(_storageKey);
    if (raw == null) return null;
    return PulseMemory.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  @override
  Future<void> save(PulseMemory memory) async {
    await _prefs.setString(_storageKey, jsonEncode(memory.toJson()));
  }
}
