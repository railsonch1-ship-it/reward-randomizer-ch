import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:reward_randomizer/utils/preferences.dart';

final preferencesProvider = StateProvider<Preferences?>((ref) => null);

final darkThemeProvider = StateProvider<DarkTheme>((ref) {
  final prefs = ref.watch(preferencesProvider);
  return prefs?.darkTheme ?? DarkTheme.system;
});

final localeProvider = StateProvider<Locale?>((ref) {
  final prefs = ref.watch(preferencesProvider);
  if (prefs == null) return null;
  switch (prefs.language) {
    case Language.en:
      return const Locale('en', '');
    case Language.pt:
      return const Locale('pt', '');
    case Language.sv:
      return const Locale('sv', '');
    case Language.system:
    default:
      return null;
  }
});
