import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:reward_randomizer/providers/preferences_providers.dart';

final rewardProvider = StateNotifierProvider<RewardNotifier, String>((ref) {
  final prefs = ref.watch(preferencesProvider);
  final duration = prefs?.countdownDuration ?? 0.8;
  return RewardNotifier(duration);
});

class RewardNotifier extends StateNotifier<String> {
  final double countdownSeconds;
  Timer? _cleanupTimer;

  RewardNotifier(this.countdownSeconds) : super("");

  void setReward(String reward) {
    _cleanupTimer?.cancel();
    state = reward;

    if (reward.isNotEmpty) {
      _cleanupTimer = Timer(Duration(milliseconds: (countdownSeconds * 1000).round()), () {
        state = "";
      });
    }
  }

  void clear() {
    _cleanupTimer?.cancel();
    state = "";
  }

  @override
  void dispose() {
    _cleanupTimer?.cancel();
    super.dispose();
  }
}
