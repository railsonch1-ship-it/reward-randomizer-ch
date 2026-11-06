import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:reward_randomizer/providers/reward_provider.dart';

class RewardWidget extends ConsumerWidget {
  const RewardWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rewardText = ref.watch(rewardProvider);

    if (rewardText.isEmpty) {
      return const SizedBox.shrink();
    }

    return Positioned.fill(
      child: GestureDetector(
        onTap: () {
          ref.read(rewardProvider.notifier).clear();
        },
        child: Container(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              center: Alignment.center,
              radius: 0.85,
              colors: [
                Theme.of(context).colorScheme.primary.withOpacity(0.45),
                Theme.of(context).scaffoldBackgroundColor.withOpacity(0.96),
              ],
            ),
          ),
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.card_giftcard_rounded, size: 56, color: Color(0xFFB69B00)),
                  const SizedBox(height: 16),
                  AutoSizeText(
                    rewardText,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 64,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.onSurface,
                      shadows: const [
                        Shadow(blurRadius: 10, color: Colors.black26, offset: Offset(0, 4)),
                      ],
                    ),
                    maxLines: 3,
                    minFontSize: 24,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
