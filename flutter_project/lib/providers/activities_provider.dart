import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:reward_randomizer/models/activity.dart';
import 'package:reward_randomizer/services/storage.dart';
import 'package:reward_randomizer/services/storage_sqlite.dart';
import 'package:reward_randomizer/utils/preferences.dart';
import 'package:reward_randomizer/providers/preferences_providers.dart';

final storageProvider = Provider<Storage>((ref) => StorageSqlite());

final activitiesProvider = StateNotifierProvider<ActivitiesNotifier, List<Activity>>((ref) {
  final storage = ref.watch(storageProvider);
  final prefs = ref.watch(preferencesProvider);
  return ActivitiesNotifier(storage, prefs);
});

class ActivitiesNotifier extends StateNotifier<List<Activity>> {
  final Storage _storage;
  final Preferences? _prefs;
  Order _order = Order.createdAsc;

  ActivitiesNotifier(this._storage, this._prefs) : super([]) {
    loadActivities();
  }

  Future<void> loadActivities() async {
    final list = await _storage.loadActivities();
    if (_prefs != null) {
      _order = _prefs!.order;
    }
    state = _reorder(list);
  }

  Future<void> addActivity(Activity activity) async {
    await _storage.addActivity(activity);
    final updated = [...state, activity];
    state = _reorder(updated);
  }

  Future<void> updateActivity(Activity activity) async {
    await _storage.updateActivity(activity);
    final updated = [
      for (final a in state)
        if (a.id == activity.id) activity else a
    ];
    state = _reorder(updated);
  }

  Future<void> removeActivity(Activity activity) async {
    await _storage.removeActivity(activity);
    final updated = state.where((a) => a.id != activity.id).toList();
    state = _reorder(updated);
  }

  void reorderActivity(int oldIndex, int newIndex) {
    if (newIndex > oldIndex) {
      newIndex -= 1;
    }
    final items = [...state];
    final item = items.removeAt(oldIndex);
    items.insert(newIndex, item);

    _order = Order.userDefined;
    _prefs?.setOrder(Order.userDefined);
    _prefs?.setUserDefinedOrder(items.map((e) => e.id).toList());
    state = items;
  }

  void setOrder(Order order) {
    _order = order;
    _prefs?.setOrder(order);
    state = _reorder([...state]);
  }

  Order getOrder() => _order;

  List<Activity> _reorder(List<Activity> list) {
    final items = [...list];
    switch (_order) {
      case Order.createdAsc:
        break;
      case Order.createdDesc:
        return items.reversed.toList();
      case Order.questionAsc:
        items.sort((a, b) => a.question.toLowerCase().compareTo(b.question.toLowerCase()));
        break;
      case Order.questionDesc:
        items.sort((a, b) => b.question.toLowerCase().compareTo(a.question.toLowerCase()));
        break;
      case Order.labelAsc:
        items.sort((a, b) {
          final comp = a.label.toLowerCase().compareTo(b.label.toLowerCase());
          return comp != 0 ? comp : a.question.compareTo(b.question);
        });
        break;
      case Order.labelDesc:
        items.sort((a, b) {
          final comp = b.label.toLowerCase().compareTo(a.label.toLowerCase());
          return comp != 0 ? comp : b.question.compareTo(a.question);
        });
        break;
      case Order.userDefined:
        final orderIds = _prefs?.userDefinedOrder ?? [];
        if (orderIds.isNotEmpty) {
          final idMap = {for (var i = 0; i < orderIds.length; i++) orderIds[i]: i};
          items.sort((a, b) {
            final idxA = idMap[a.id] ?? 99999;
            final idxB = idMap[b.id] ?? 99999;
            return idxA.compareTo(idxB);
          });
        }
        break;
      case Order.random:
        items.shuffle(Random());
        break;
    }
    return items;
  }
}
