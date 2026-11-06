import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:reward_randomizer/providers/preferences_providers.dart';
import 'package:reward_randomizer/utils/preferences.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PreferencesPage extends ConsumerWidget {
  const PreferencesPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final prefs = ref.watch(preferencesProvider);
    final darkTheme = ref.watch(darkThemeProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.settings),
      ),
      body: ListView(
        children: [
          ListTile(
            title: Text(l10n.countdownDuration),
            subtitle: Text('${prefs?.countdownDuration.toStringAsFixed(1) ?? "0.8"} ${l10n.seconds}'),
          ),
          Slider(
            value: prefs?.countdownDuration ?? 0.8,
            min: 0.5,
            max: 5.0,
            divisions: 9,
            label: '${prefs?.countdownDuration.toStringAsFixed(1)}s',
            onChanged: (v) {
              prefs?.setCountdownDuration(v);
              ref.invalidate(preferencesProvider);
            },
          ),
          const Divider(),
          ListTile(
            title: Text(l10n.theme),
          ),
          RadioListTile<DarkTheme>(
            title: Text(l10n.themeSystem),
            value: DarkTheme.system,
            groupValue: darkTheme,
            onChanged: (val) {
              if (val != null) {
                prefs?.setDarkTheme(val);
                ref.read(darkThemeProvider.notifier).state = val;
              }
            },
          ),
          RadioListTile<DarkTheme>(
            title: Text(l10n.themeLight),
            value: DarkTheme.light,
            groupValue: darkTheme,
            onChanged: (val) {
              if (val != null) {
                prefs?.setDarkTheme(val);
                ref.read(darkThemeProvider.notifier).state = val;
              }
            },
          ),
          RadioListTile<DarkTheme>(
            title: Text(l10n.themeDark),
            value: DarkTheme.dark,
            groupValue: darkTheme,
            onChanged: (val) {
              if (val != null) {
                prefs?.setDarkTheme(val);
                ref.read(darkThemeProvider.notifier).state = val;
              }
            },
          ),
          const Divider(),
          ListTile(
            title: Text(l10n.language),
          ),
          RadioListTile<Language>(
            title: const Text('System default'),
            value: Language.system,
            groupValue: prefs?.language ?? Language.system,
            onChanged: (val) {
              if (val != null) {
                prefs?.setLanguage(val);
                ref.invalidate(localeProvider);
              }
            },
          ),
          RadioListTile<Language>(
            title: const Text('Português'),
            value: Language.pt,
            groupValue: prefs?.language,
            onChanged: (val) {
              if (val != null) {
                prefs?.setLanguage(val);
                ref.invalidate(localeProvider);
              }
            },
          ),
          RadioListTile<Language>(
            title: const Text('English'),
            value: Language.en,
            groupValue: prefs?.language,
            onChanged: (val) {
              if (val != null) {
                prefs?.setLanguage(val);
                ref.invalidate(localeProvider);
              }
            },
          ),
          RadioListTile<Language>(
            title: const Text('Svenska'),
            value: Language.sv,
            groupValue: prefs?.language,
            onChanged: (val) {
              if (val != null) {
                prefs?.setLanguage(val);
                ref.invalidate(localeProvider);
              }
            },
          ),
        ],
      ),
    );
  }
}
