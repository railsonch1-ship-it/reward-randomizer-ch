import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:reward_randomizer/models/activity.dart';
import 'package:reward_randomizer/pages/add_activity_page.dart';
import 'package:reward_randomizer/pages/preferences_page.dart';
import 'package:reward_randomizer/pages/about_page.dart';
import 'package:reward_randomizer/providers/activities_provider.dart';
import 'package:reward_randomizer/providers/reward_provider.dart';
import 'package:reward_randomizer/providers/preferences_providers.dart';
import 'package:reward_randomizer/utils/preferences.dart';
import 'package:reward_randomizer/widgets/reward_widget.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ActivitiesPage extends ConsumerStatefulWidget {
  const ActivitiesPage({super.key});

  @override
  ConsumerState<ActivitiesPage> createState() => _ActivitiesPageState();
}

class _ActivitiesPageState extends ConsumerState<ActivitiesPage> {
  final Map<String, bool> _waitingStates = {};

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final activities = ref.watch(activitiesProvider);
    final currentOrder = ref.watch(activitiesProvider.notifier).getOrder();
    final prefs = ref.watch(preferencesProvider);
    final countdownSec = prefs?.countdownDuration ?? 0.8;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.activities),
        actions: [
          PopupMenuButton<Order>(
            icon: const Icon(Icons.sort),
            tooltip: l10n.order,
            initialValue: currentOrder,
            onSelected: (order) {
              ref.read(activitiesProvider.notifier).setOrder(order);
            },
            itemBuilder: (context) => [
              PopupMenuItem(value: Order.createdAsc, child: Text(l10n.orderCreatedAsc)),
              PopupMenuItem(value: Order.createdDesc, child: Text(l10n.orderCreatedDesc)),
              PopupMenuItem(value: Order.questionAsc, child: Text(l10n.orderQuestionAsc)),
              PopupMenuItem(value: Order.questionDesc, child: Text(l10n.orderQuestionDesc)),
              PopupMenuItem(value: Order.labelAsc, child: Text(l10n.orderLabelAsc)),
              PopupMenuItem(value: Order.labelDesc, child: Text(l10n.orderLabelDesc)),
              PopupMenuItem(value: Order.userDefined, child: Text(l10n.orderUserDefined)),
              PopupMenuItem(value: Order.random, child: Text(l10n.orderRandom)),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: l10n.addActivity,
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const AddActivityPage()),
              );
            },
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'settings') {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const PreferencesPage()),
                );
              } else if (value == 'about') {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const AboutPage()),
                );
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(value: 'settings', child: Text(l10n.settings)),
              PopupMenuItem(value: 'about', child: Text(l10n.about)),
            ],
          ),
        ],
      ),
      body: Stack(
        children: [
          activities.isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.stars_rounded, size: 72, color: Theme.of(context).colorScheme.primary),
                        const SizedBox(height: 16),
                        Text(
                          l10n.noActivitiesTitle,
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          l10n.noActivitiesSubtitle,
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                        const SizedBox(height: 24),
                        FilledButton.icon(
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const AddActivityPage()),
                            );
                          },
                          icon: const Icon(Icons.add),
                          label: Text(l10n.addFirstActivity),
                        ),
                      ],
                    ),
                  ),
                )
              : ReorderableListView.builder(
                  padding: const EdgeInsets.only(top: 8, bottom: 80),
                  itemCount: activities.length,
                  onReorder: (oldIndex, newIndex) {
                    ref.read(activitiesProvider.notifier).reorderActivity(oldIndex, newIndex);
                  },
                  itemBuilder: (context, index) {
                    final activity = activities[index];
                    final isWaiting = _waitingStates[activity.id] ?? false;

                    return Card(
                      key: ValueKey(activity.id),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 24,
                              backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                              foregroundColor: Theme.of(context).colorScheme.onPrimaryContainer,
                              child: activity.icon,
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    activity.question,
                                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                          fontWeight: FontWeight.w600,
                                        ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    activity.label,
                                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                          fontStyle: FontStyle.italic,
                                          color: Theme.of(context).colorScheme.primary,
                                        ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            // Edit button
                            IconButton(
                              icon: const Icon(Icons.edit_outlined, size: 20),
                              tooltip: l10n.editActivity,
                              onPressed: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => AddActivityPage(activity: activity),
                                  ),
                                );
                              },
                            ),
                            const SizedBox(width: 4),
                            // Activate Button
                            ElevatedButton(
                              onPressed: isWaiting
                                  ? null
                                  : () {
                                      setState(() {
                                        _waitingStates[activity.id] = true;
                                      });

                                      final reward = activity.randomReward;
                                      ref.read(rewardProvider.notifier).setReward(reward);

                                      Timer(Duration(milliseconds: (countdownSec * 1000).round()), () {
                                        if (mounted) {
                                          setState(() {
                                            _waitingStates[activity.id] = false;
                                          });
                                        }
                                      });
                                    },
                              child: isWaiting
                                  ? const SizedBox(
                                      width: 18,
                                      height: 18,
                                      child: CircularProgressIndicator(strokeWidth: 2.2),
                                    )
                                  : Text(l10n.activate),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
          const RewardWidget(),
        ],
      ),
    );
  }
}
