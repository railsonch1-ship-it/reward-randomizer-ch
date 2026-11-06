import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  Future<void> _launchGitHub() async {
    final uri = Uri.parse('https://github.com/chiralsymmetry/reward-randomizer');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.about),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const Center(
            child: Icon(Icons.casino_rounded, size: 64, color: Color(0xFFB69B00)),
          ),
          const SizedBox(height: 12),
          Text(
            'Reward Randomizer',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Text(
            l10n.aboutDesc,
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 24),
          Text(
            l10n.reinforcementExplanation,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          ListTile(
            leading: const Icon(Icons.check_circle_outline, color: Color(0xFFB69B00)),
            title: Text(l10n.reinforcementPoint1),
          ),
          ListTile(
            leading: const Icon(Icons.check_circle_outline, color: Color(0xFFB69B00)),
            title: Text(l10n.reinforcementPoint2),
          ),
          ListTile(
            leading: const Icon(Icons.check_circle_outline, color: Color(0xFFB69B00)),
            title: Text(l10n.reinforcementPoint3),
          ),
          const SizedBox(height: 24),
          OutlinedButton.icon(
            onPressed: _launchGitHub,
            icon: const Icon(Icons.open_in_new),
            label: Text(l10n.githubRepo),
          ),
        ],
      ),
    );
  }
}
