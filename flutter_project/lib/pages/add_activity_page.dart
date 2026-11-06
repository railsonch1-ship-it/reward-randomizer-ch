import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:reward_randomizer/models/activity.dart';
import 'package:reward_randomizer/providers/activities_provider.dart';
import 'package:reward_randomizer/widgets/icon_selector.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class AddActivityPage extends ConsumerStatefulWidget {
  final Activity? activity;
  const AddActivityPage({super.key, this.activity});

  @override
  ConsumerState<AddActivityPage> createState() => _AddActivityPageState();
}

class _AddActivityPageState extends ConsumerState<AddActivityPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _questionController;
  late TextEditingController _labelController;
  late TextEditingController _answerController;
  late TextEditingController _rewardInputController;
  late int _reciprocal;
  late FaIcon _selectedIcon;
  late List<String> _rewards;

  @override
  void initState() {
    super.initState();
    final act = widget.activity;
    _questionController = TextEditingController(text: act?.question ?? "");
    _labelController = TextEditingController(text: act?.label ?? "");
    _answerController = TextEditingController(text: act?.answer ?? "Yes");
    _rewardInputController = TextEditingController();
    _reciprocal = act?.reciprocal ?? kDefaultReciprocal;
    _selectedIcon = act?.icon ?? const FaIcon(FontAwesomeIcons.glassWater);
    _rewards = act?.rewards != null ? List.from(act!.rewards) : [];
  }

  @override
  void dispose() {
    _questionController.dispose();
    _labelController.dispose();
    _answerController.dispose();
    _rewardInputController.dispose();
    super.dispose();
  }

  String _setChanceString(int reciprocal, AppLocalizations l10n) {
    final pct = (100.0 / reciprocal).toStringAsFixed(1);
    return l10n.probabilityText(reciprocal, pct);
  }

  void _addReward() {
    final text = _rewardInputController.text.trim();
    if (text.isNotEmpty) {
      setState(() {
        _rewards.add(text);
        _rewardInputController.clear();
      });
    }
  }

  void _saveActivity(AppLocalizations l10n) {
    if (_formKey.currentState?.validate() ?? false) {
      var rewardsList = List<String>.from(_rewards);
      if (rewardsList.isEmpty) {
        rewardsList = l10n.defaultRewards.split('|');
      }

      final newActivity = Activity(
        id: widget.activity?.id,
        icon: _selectedIcon,
        label: _labelController.text.trim(),
        question: _questionController.text.trim(),
        answer: _answerController.text.trim(),
        reciprocal: _reciprocal,
        rewards: rewardsList,
      );

      if (widget.activity == null) {
        ref.read(activitiesProvider.notifier).addActivity(newActivity);
      } else {
        ref.read(activitiesProvider.notifier).updateActivity(newActivity);
      }

      Navigator.of(context).pop();
    }
  }

  void _deleteActivity(AppLocalizations l10n) {
    if (widget.activity == null) return;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(l10n.confirmDeleteTitle),
        content: Text(l10n.confirmDeleteMessage),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(l10n.cancel),
          ),
          FilledButton(
            onPressed: () {
              ref.read(activitiesProvider.notifier).removeActivity(widget.activity!);
              Navigator.of(ctx).pop();
              Navigator.of(context).pop();
            },
            child: Text(l10n.delete),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final isEditing = widget.activity != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? l10n.editActivity : l10n.addActivity),
        actions: [
          if (isEditing)
            IconButton(
              icon: const Icon(Icons.delete_outline),
              tooltip: l10n.delete,
              onPressed: () => _deleteActivity(l10n),
            ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Center(
              child: InkWell(
                onTap: () async {
                  final picked = await showDialog<FaIcon>(
                    context: context,
                    builder: (_) => const IconSelectorDialog(),
                  );
                  if (picked != null) {
                    setState(() => _selectedIcon = picked);
                  }
                },
                borderRadius: BorderRadius.circular(32),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 36,
                        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                        foregroundColor: Theme.of(context).colorScheme.onPrimaryContainer,
                        child: _selectedIcon,
                      ),
                      const SizedBox(height: 8),
                      Text(l10n.selectIcon, style: Theme.of(context).textTheme.labelMedium),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _questionController,
              decoration: InputDecoration(
                labelText: l10n.questionLabel,
                hintText: l10n.questionHint,
                border: const OutlineInputBorder(),
              ),
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _labelController,
              decoration: InputDecoration(
                labelText: l10n.labelField,
                hintText: l10n.labelHint,
                border: const OutlineInputBorder(),
              ),
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _answerController,
              decoration: InputDecoration(
                labelText: l10n.answerField,
                hintText: l10n.answerHint,
                border: const OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              l10n.reciprocalField,
              style: Theme.of(context).textTheme.titleSmall,
            ),
            Text(
              _setChanceString(_reciprocal, l10n),
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            Slider(
              value: _reciprocal.toDouble(),
              min: 1,
              max: 20,
              divisions: 19,
              label: '1 in $_reciprocal',
              onChanged: (v) => setState(() => _reciprocal = v.round()),
            ),
            const SizedBox(height: 20),
            Text(l10n.rewardsField, style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _rewardInputController,
                    decoration: InputDecoration(
                      hintText: l10n.rewardsHint,
                      border: const OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _addReward(),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton.tonal(
                  onPressed: _addReward,
                  child: Text(l10n.addReward),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (_rewards.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Text(
                  l10n.noRewardsYet,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(fontStyle: FontStyle.italic),
                ),
              )
            else
              Wrap(
                spacing: 8,
                children: _rewards.map((r) {
                  return Chip(
                    label: Text(r),
                    onDeleted: () {
                      setState(() => _rewards.remove(r));
                    },
                  );
                }).toList(),
              ),
            const SizedBox(height: 32),
            FilledButton(
              onPressed: () => _saveActivity(l10n),
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
              child: Text(l10n.save),
            ),
          ],
        ),
      ),
    );
  }
}
