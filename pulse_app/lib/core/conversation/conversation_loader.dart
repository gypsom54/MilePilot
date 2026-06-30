import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:pulse_app/core/conversation/conversation_models.dart';

/// Loads conversation scripts from JSON assets.
abstract final class ConversationLoader {
  static Future<ConversationScript> load(String assetPath) async {
    final raw = await rootBundle.loadString(assetPath);
    final json = jsonDecode(raw) as Map<String, dynamic>;
    return ConversationScript.fromJson(json);
  }
}
