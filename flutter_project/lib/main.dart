import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:reward_randomizer/pages/activities_page.dart';
import 'package:reward_randomizer/providers/preferences_providers.dart';
import 'package:reward_randomizer/utils/preferences.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: RewardRandomizerApp(),
    ),
  );
}

class RewardRandomizerApp extends ConsumerWidget {
  const RewardRandomizerApp({super.key});

  static const Color _beige = Color.fromRGBO(246, 243, 223, 1.0);
  static const Color _lightGold = Color.fromRGBO(182, 155, 0, 1.0);
  static const Color _bronzeYellow = Color.fromRGBO(114, 97, 0, 1.0);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeOption = ref.watch(darkThemeProvider);
    final locale = ref.watch(localeProvider);

    ThemeMode themeMode;
    switch (themeOption) {
      case DarkTheme.light:
        themeMode = ThemeMode.light;
        break;
      case DarkTheme.dark:
        themeMode = ThemeMode.dark;
        break;
      case DarkTheme.system:
      default:
        themeMode = ThemeMode.system;
    }

    return MaterialApp(
      title: 'Reward Randomizer',
      debugShowCheckedModeBanner: false,
      themeMode: themeMode,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: _lightGold,
          brightness: Brightness.light,
          surface: _beige,
        ),
        scaffoldBackgroundColor: _beige,
        cardTheme: const CardTheme(
          elevation: 1,
          margin: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(16)),
          ),
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: _lightGold,
          brightness: Brightness.dark,
          surface: const Color(0xFF222019),
        ),
        scaffoldBackgroundColor: const Color(0xFF191813),
        cardTheme: const CardTheme(
          elevation: 1,
          color: Color(0xFF2A2820),
          margin: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(16)),
          ),
        ),
      ),
      locale: locale,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', ''),
        Locale('pt', ''),
        Locale('sv', ''),
      ],
      home: const ActivitiesPage(),
    );
  }
}
