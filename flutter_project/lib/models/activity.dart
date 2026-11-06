import 'dart:math';
import 'package:flutter/widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:uuid/uuid.dart';

const int kDefaultReciprocal = 6;
const _uuid = Uuid();
final Random rnd = Random();

class Activity {
  final String id;
  final FaIcon icon;
  final String label;
  final String question;
  final String answer;
  final int reciprocal;
  final List<String> rewards;

  Activity({
    String? id,
    required this.icon,
    required this.label,
    required this.question,
    this.answer = "Yes",
    this.reciprocal = kDefaultReciprocal,
    required this.rewards,
  }) : id = id ?? _uuid.v4();

  /// Intermittent reinforcement probability logic:
  /// Probability of receiving a reward is 1 / reciprocal (e.g. 1/6 ≈ 16.67%).
  /// If test succeeds, picks uniformly from available rewards.
  /// If fails, returns empty string "" signaling no reward unlocked.
  String get randomReward {
    String output = "";
    if (rewards.isNotEmpty && rnd.nextDouble() < 1 / reciprocal) {
      output = rewards[rnd.nextInt(rewards.length)];
    }
    return output;
  }

  Activity copyWith({
    String? id,
    FaIcon? icon,
    String? label,
    String? question,
    String? answer,
    int? reciprocal,
    List<String>? rewards,
  }) {
    return Activity(
      id: id ?? this.id,
      icon: icon ?? this.icon,
      label: label ?? this.label,
      question: question ?? this.question,
      answer: answer ?? this.answer,
      reciprocal: reciprocal ?? this.reciprocal,
      rewards: rewards ?? this.rewards,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'icon_code_point': icon.icon?.codePoint ?? 0xf556,
      'icon_font_family': icon.icon?.fontFamily ?? 'FontAwesomeSolid',
      'icon_font_package': icon.icon?.fontPackage ?? 'font_awesome_flutter',
      'label': label,
      'question': question,
      'answer': answer,
      'reciprocal': reciprocal,
    };
  }

  factory Activity.fromMap(Map<String, dynamic> map, List<String> rewardsList) {
    return Activity(
      id: map['id'] as String,
      icon: FaIcon(
        IconData(
          map['icon_code_point'] as int,
          fontFamily: map['icon_font_family'] as String?,
          fontPackage: map['icon_font_package'] as String?,
        ),
      ),
      label: map['label'] as String,
      question: map['question'] as String,
      answer: (map['answer'] as String?) ?? "Yes",
      reciprocal: (map['reciprocal'] as int?) ?? kDefaultReciprocal,
      rewards: rewardsList,
    );
  }
}
