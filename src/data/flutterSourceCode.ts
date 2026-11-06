export interface FlutterFile {
  path: string;
  filename: string;
  language: string;
  description: string;
  code: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    filename: 'pubspec.yaml',
    language: 'yaml',
    description: 'Project configuration and dependencies (Riverpod, SQLite, FontAwesome, intl)',
    code: `name: reward_randomizer
description: A habit building app using an intermittent (probabilistic) reward system.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.2 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  flutter_riverpod: ^2.3.6        # State management
  font_awesome_flutter: ^10.4.0   # Icon library
  intl: ^0.18.0                   # Formatting & localization
  shared_preferences: ^2.1.1      # Key-value user preferences
  sqflite: ^2.2.8+4               # SQLite database
  path: ^1.8.3                    # Path helper for SQLite
  url_launcher: ^6.1.11           # External URL opener
  uuid: ^3.0.7                    # Unique UUID v4 generator
  auto_size_text: ^3.0.0          # Responsive dynamic text sizing

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
  generate: true
`
  },
  {
    path: 'lib/main.dart',
    filename: 'main.dart',
    language: 'dart',
    description: 'Application entry point with Material 3, custom seed palette, and Riverpod ProviderScope',
    code: `import 'package:flutter/material.dart';
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

  // Base theme colors from specification:
  // _beige: Color.fromRGBO(246, 243, 223, 1.0) (light background)
  // _lightGold: Color.fromRGBO(182, 155, 0, 1.0) (seed color)
  // _bronzeYellow: Color.fromRGBO(114, 97, 0, 1.0) (dark background)
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
      useInheritedMediaQuery: true,
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
        appBarTheme: const AppBarTheme(
          backgroundColor: _beige,
          foregroundColor: Colors.black87,
          elevation: 0,
          centerTitle: false,
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
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF191813),
          foregroundColor: Color(0xFFF6F3DF),
          elevation: 0,
          centerTitle: false,
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
        Locale('sv', ''),
        Locale('pt', ''),
      ],
      home: const ActivitiesPage(),
    );
  }
}
`
  },
  {
    path: 'lib/models/activity.dart',
    filename: 'activity.dart',
    language: 'dart',
    description: 'Activity data model with probabilistic variable-ratio intermittent reward engine',
    code: `import 'dart:math';
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
`
  },
  {
    path: 'lib/services/storage.dart',
    filename: 'storage.dart',
    language: 'dart',
    description: 'Storage abstract interface for activity and rewards persistence',
    code: `import 'package:reward_randomizer/models/activity.dart';

abstract class Storage {
  Future<List<Activity>> loadActivities();
  Future<void> addActivity(Activity activity);
  Future<void> removeActivity(Activity activity);
  Future<void> updateActivity(Activity activity);
}
`
  },
  {
    path: 'lib/services/storage_sqlite.dart',
    filename: 'storage_sqlite.dart',
    language: 'dart',
    description: 'Concrete SQLite persistence with activities table and rewards cascade table',
    code: `import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:reward_randomizer/models/activity.dart';
import 'package:reward_randomizer/services/storage.dart';

class StorageSqlite implements Storage {
  static const String _dbName = 'activities.db';
  static const int _dbVersion = 1;

  Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, _dbName);

    return await openDatabase(
      path,
      version: _dbVersion,
      onConfigure: (db) async {
        await db.execute('PRAGMA foreign_keys = ON');
      },
      onCreate: (db, version) async {
        // Table: activities
        await db.execute('''
          CREATE TABLE activities (
            id TEXT PRIMARY KEY,
            icon_code_point INTEGER NOT NULL,
            icon_font_family TEXT,
            icon_font_package TEXT,
            label TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            reciprocal INTEGER NOT NULL
          )
        ''');

        // Table: rewards (with ON DELETE CASCADE)
        await db.execute('''
          CREATE TABLE rewards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            activity_id TEXT NOT NULL,
            reward TEXT NOT NULL,
            FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE
          )
        ''');
      },
    );
  }

  @override
  Future<List<Activity>> loadActivities() async {
    final db = await database;
    final List<Map<String, dynamic>> activityMaps = await db.query('activities');

    final List<Activity> activities = [];
    for (final actMap in activityMaps) {
      final actId = actMap['id'] as String;
      final rewardMaps = await db.query(
        'rewards',
        columns: ['reward'],
        where: 'activity_id = ?',
        whereArgs: [actId],
      );
      final rewards = rewardMaps.map((r) => r['reward'] as String).toList();
      activities.add(Activity.fromMap(actMap, rewards));
    }
    return activities;
  }

  @override
  Future<void> addActivity(Activity activity) async {
    final db = await database;
    await db.transaction((txn) async {
      await txn.insert(
        'activities',
        activity.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
      for (final reward in activity.rewards) {
        await txn.insert('rewards', {
          'activity_id': activity.id,
          'reward': reward,
        });
      }
    });
  }

  @override
  Future<void> removeActivity(Activity activity) async {
    final db = await database;
    await db.delete(
      'activities',
      where: 'id = ?',
      whereArgs: [activity.id],
    );
  }

  @override
  Future<void> updateActivity(Activity activity) async {
    final db = await database;
    await db.transaction((txn) async {
      await txn.update(
        'activities',
        activity.toMap(),
        where: 'id = ?',
        whereArgs: [activity.id],
      );
      // Replace all rewards
      await txn.delete(
        'rewards',
        where: 'activity_id = ?',
        whereArgs: [activity.id],
      );
      for (final reward in activity.rewards) {
        await txn.insert('rewards', {
          'activity_id': activity.id,
          'reward': reward,
        });
      }
    });
  }
}
`
  },
  {
    path: 'lib/utils/preferences.dart',
    filename: 'preferences.dart',
    language: 'dart',
    description: 'SharedPreferences wrapper managing countdown, theme, language, and sorting order',
    code: `import 'package:shared_preferences/shared_preferences.dart';

enum DarkTheme { system, light, dark }
enum Language { system, en, sv, pt }

enum Order {
  createdAsc,
  createdDesc,
  questionAsc,
  questionDesc,
  labelAsc,
  labelDesc,
  userDefined,
  random,
}

class Preferences {
  static const String _keyCountdown = 'countdownDuration';
  static const String _keyDarkTheme = 'darkTheme';
  static const String _keyLanguage = 'language';
  static const String _keyOrder = 'order';
  static const String _keyUserDefinedOrder = 'userDefinedOrder';

  final SharedPreferences _prefs;
  Preferences(this._prefs);

  static Future<Preferences> getInstance() async {
    final sp = await SharedPreferences.getInstance();
    return Preferences(sp);
  }

  double get countdownDuration => _prefs.getDouble(_keyCountdown) ?? 3.0;
  Future<bool> setCountdownDuration(double val) => _prefs.setDouble(_keyCountdown, val);

  DarkTheme get darkTheme {
    final idx = _prefs.getInt(_keyDarkTheme) ?? 0;
    return DarkTheme.values[idx.clamp(0, DarkTheme.values.length - 1)];
  }
  Future<bool> setDarkTheme(DarkTheme val) => _prefs.setInt(_keyDarkTheme, val.index);

  Language get language {
    final idx = _prefs.getInt(_keyLanguage) ?? 0;
    return Language.values[idx.clamp(0, Language.values.length - 1)];
  }
  Future<bool> setLanguage(Language val) => _prefs.setInt(_keyLanguage, val.index);

  Order get order {
    final idx = _prefs.getInt(_keyOrder) ?? 0;
    return Order.values[idx.clamp(0, Order.values.length - 1)];
  }
  Future<bool> setOrder(Order val) => _prefs.setInt(_keyOrder, val.index);

  List<String> get userDefinedOrder => _prefs.getStringList(_keyUserDefinedOrder) ?? [];
  Future<bool> setUserDefinedOrder(List<String> ids) => _prefs.setStringList(_keyUserDefinedOrder, ids);
}
`
  },
  {
    path: 'lib/providers/activities_provider.dart',
    filename: 'activities_provider.dart',
    language: 'dart',
    description: 'Riverpod ActivitiesNotifier with 8 sorting modes and SQLite synchronization',
    code: `import 'dart:math';
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
        // Already preserved by insertion order in DB
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
`
  },
  {
    path: 'lib/providers/reward_provider.dart',
    filename: 'reward_provider.dart',
    language: 'dart',
    description: 'RewardNotifier handling ephemeral reward display and auto-clear countdown timer',
    code: `import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:reward_randomizer/providers/preferences_providers.dart';

final rewardProvider = StateNotifierProvider<RewardNotifier, String>((ref) {
  final prefs = ref.watch(preferencesProvider);
  final duration = prefs?.countdownDuration ?? 3.0;
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
`
  },
  {
    path: 'lib/providers/preferences_providers.dart',
    filename: 'preferences_providers.dart',
    language: 'dart',
    description: 'Riverpod providers for theme, locale, and shared preferences',
    code: `import 'package:flutter/material.dart';
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
    case Language.sv:
      return const Locale('sv', '');
    case Language.pt:
      return const Locale('pt', '');
    case Language.system:
    default:
      return null;
  }
});
`
  },
  {
    path: 'lib/pages/activities_page.dart',
    filename: 'activities_page.dart',
    language: 'dart',
    description: 'Main screen displaying reorderable habit cards, Activate button, and radial reward widget',
    code: `import 'dart:async';
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
    final countdownSec = prefs?.countdownDuration ?? 3.0;

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
                      child: InkWell(
                        borderRadius: const BorderRadius.all(Radius.circular(16)),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => AddActivityPage(activity: activity),
                            ),
                          );
                        },
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
                              const SizedBox(width: 12),
                              ElevatedButton(
                                onPressed: isWaiting
                                    ? null
                                    : () {
                                        setState(() {
                                          _waitingStates[activity.id] = true;
                                        });

                                        // 1. Draw reward probabilistically:
                                        final reward = activity.randomReward;

                                        // 2. Set in rewardProvider:
                                        ref.read(rewardProvider.notifier).setReward(reward);

                                        // 3. Keep waiting state for countdownDuration:
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
                      ),
                    );
                  },
                ),

          // Intermittent reward reveal banner:
          const RewardWidget(),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/reward_widget.dart',
    filename: 'reward_widget.dart',
    language: 'dart',
    description: 'Auto-sizing 64pt radial gradient celebratory reward reveal widget',
    code: `import 'package:flutter/material.dart';
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
      child: IgnorePointer(
        ignoring: false,
        child: Container(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              center: Alignment.center,
              radius: 0.85,
              colors: [
                Theme.of(context).colorScheme.primary.withOpacity(0.35),
                Theme.of(context).scaffoldBackgroundColor.withOpacity(0.95),
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
`
  },
  {
    path: 'lib/pages/add_activity_page.dart',
    filename: 'add_activity_page.dart',
    language: 'dart',
    description: 'Add and edit activity form with icon selector, reciprocal odds helper, and rewards pool',
    code: `import 'package:flutter/material.dart';
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
              Navigator.of(ctx).pop(); // close dialog
              Navigator.of(context).pop(); // close edit page
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
            // Icon Picker trigger:
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

            // Question
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

            // Label
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

            // Answer
            TextFormField(
              controller: _answerController,
              decoration: InputDecoration(
                labelText: l10n.answerField,
                hintText: l10n.answerHint,
                border: const OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),

            // Reciprocal Slider & Chance Calculation:
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

            // Rewards Pool
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
`
  },
  {
    path: 'lib/pages/preferences_page.dart',
    filename: 'preferences_page.dart',
    language: 'dart',
    description: 'Preferences page for countdown timer, dark theme mode, and language selection',
    code: `import 'package:flutter/material.dart';
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
          // Countdown duration
          ListTile(
            title: Text(l10n.countdownDuration),
            subtitle: Text('\${prefs?.countdownDuration.toStringAsFixed(1) ?? "3.0"} \${l10n.seconds}'),
          ),
          Slider(
            value: prefs?.countdownDuration ?? 3.0,
            min: 1.0,
            max: 10.0,
            divisions: 18,
            label: '\${prefs?.countdownDuration.toStringAsFixed(1)}s',
            onChanged: (v) {
              prefs?.setCountdownDuration(v);
              ref.invalidate(preferencesProvider);
            },
          ),
          const Divider(),

          // Dark Theme mode
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

          // Language selection
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
            title: const Text('Svenska (Swedish)'),
            value: Language.sv,
            groupValue: prefs?.language,
            onChanged: (val) {
              if (val != null) {
                prefs?.setLanguage(val);
                ref.invalidate(localeProvider);
              }
            },
          ),
          RadioListTile<Language>(
            title: const Text('Português (Portuguese)'),
            value: Language.pt,
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
`
  },
  {
    path: 'lib/pages/about_page.dart',
    filename: 'about_page.dart',
    language: 'dart',
    description: 'About screen explaining intermittent variable-ratio conditioning, GitHub link, and licenses',
    code: `import 'package:flutter/material.dart';
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
          const SizedBox(height: 12),
          TextButton(
            onPressed: () {
              showLicensePage(
                context: context,
                applicationName: 'Reward Randomizer',
                applicationVersion: '1.0.0',
              );
            },
            child: Text(l10n.thirdPartyLicenses),
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    path: 'lib/l10n/app_en.arb',
    filename: 'app_en.arb',
    language: 'json',
    description: 'English localization ARB dictionary',
    code: `{
  "@@locale": "en",
  "activities": "Activities",
  "addActivity": "Add Activity",
  "editActivity": "Edit Activity",
  "activate": "Activate",
  "order": "Order",
  "settings": "Preferences",
  "about": "About",
  "questionLabel": "Question",
  "questionHint": "e.g. Did you drink a glass of water?",
  "labelField": "Label",
  "labelHint": "e.g. Hydration",
  "answerField": "Answer",
  "answerHint": "e.g. Yes",
  "reciprocalField": "Reciprocal",
  "probabilityText": "1 in {reciprocal} chance (~{pct}%)",
  "@probabilityText": {
    "placeholders": {
      "reciprocal": {"type": "int"},
      "pct": {"type": "String"}
    }
  },
  "rewardsField": "Rewards",
  "rewardsHint": "Type a reward",
  "addReward": "Add",
  "noRewardsYet": "No rewards added yet.",
  "save": "Save",
  "delete": "Delete",
  "cancel": "Cancel",
  "confirmDeleteTitle": "Delete Activity?",
  "confirmDeleteMessage": "Are you sure you want to delete this activity?",
  "selectIcon": "Select Icon",
  "countdownDuration": "Countdown Duration",
  "theme": "Dark Theme",
  "themeSystem": "System default",
  "themeLight": "Light theme",
  "themeDark": "Dark theme",
  "language": "Language",
  "seconds": "seconds",
  "orderCreatedAsc": "Oldest first",
  "orderCreatedDesc": "Newest first",
  "orderQuestionAsc": "Question (A to Z)",
  "orderQuestionDesc": "Question (Z to A)",
  "orderLabelAsc": "Label (A to Z)",
  "orderLabelDesc": "Label (Z to A)",
  "orderUserDefined": "User defined",
  "orderRandom": "Random",
  "noActivitiesTitle": "No activities yet",
  "noActivitiesSubtitle": "Create daily habits and attach probabilistic rewards to reinforce them!",
  "addFirstActivity": "Create Activity",
  "defaultRewards": "Take a 10-minute break|Enjoy your favorite snack|Watch an episode of your show|Buy a special coffee",
  "aboutDesc": "Reward Randomizer helps you build habits using an intermittent (probabilistic) reinforcement schedule.",
  "reinforcementExplanation": "Why Intermittent Rewards Work:",
  "reinforcementPoint1": "Fixed rewards quickly cause dopamine habituation.",
  "reinforcementPoint2": "Variable-ratio schedules produce the highest response rate and extinction resistance.",
  "reinforcementPoint3": "Unpredictability keeps each habit completion exciting!",
  "githubRepo": "GitHub Repository",
  "thirdPartyLicenses": "Third Party Licenses"
}
`
  },
  {
    path: 'lib/l10n/app_pt.arb',
    filename: 'app_pt.arb',
    language: 'json',
    description: 'Portuguese localization ARB dictionary',
    code: `{
  "@@locale": "pt",
  "activities": "Atividades",
  "addActivity": "Adicionar Atividade",
  "editActivity": "Editar Atividade",
  "activate": "Ativar",
  "order": "Ordenar",
  "settings": "Preferências",
  "about": "Sobre",
  "questionLabel": "Pergunta",
  "questionHint": "ex: Bebeu um copo de água?",
  "labelField": "Rótulo",
  "labelHint": "ex: Hidratação",
  "answerField": "Resposta",
  "answerHint": "ex: Sim",
  "reciprocalField": "Recíproco",
  "probabilityText": "1 em {reciprocal} chances (~{pct}%)",
  "@probabilityText": {
    "placeholders": {
      "reciprocal": {"type": "int"},
      "pct": {"type": "String"}
    }
  },
  "rewardsField": "Recompensas",
  "rewardsHint": "Digite uma recompensa",
  "addReward": "Adicionar",
  "noRewardsYet": "Nenhuma recompensa adicionada.",
  "save": "Salvar",
  "delete": "Excluir",
  "cancel": "Cancelar",
  "confirmDeleteTitle": "Excluir Atividade?",
  "confirmDeleteMessage": "Tem certeza de que deseja excluir esta atividade?",
  "selectIcon": "Selecionar Ícone",
  "countdownDuration": "Duração da Contagem Regressiva",
  "theme": "Tema Escuro",
  "themeSystem": "Padrão do Sistema",
  "themeLight": "Tema Claro",
  "themeDark": "Tema Escuro",
  "language": "Idioma",
  "seconds": "segundos",
  "orderCreatedAsc": "Mais antigas",
  "orderCreatedDesc": "Mais recentes",
  "orderQuestionAsc": "Pergunta (A a Z)",
  "orderQuestionDesc": "Pergunta (Z a A)",
  "orderLabelAsc": "Rótulo (A a Z)",
  "orderLabelDesc": "Rótulo (Z a A)",
  "orderUserDefined": "Definida pelo Usuário",
  "orderRandom": "Aleatória",
  "noActivitiesTitle": "Nenhuma atividade ainda",
  "noActivitiesSubtitle": "Crie hábitos diários e associe recompensas probabilísticas para reforçá-los!",
  "addFirstActivity": "Criar Atividade",
  "defaultRewards": "Faça uma pausa de 10 minutos|Aproveite um lanche gostoso|Assista a um episódio da sua série|Tome um café especial",
  "aboutDesc": "O Reward Randomizer ajuda você a construir hábitos consistentes usando um sistema de recompensas intermitentes (probabilísticas).",
  "reinforcementExplanation": "Por que o Reforço Intermitente Funciona:",
  "reinforcementPoint1": "Recompensas previsíveis causam habituação rápida da dopamina.",
  "reinforcementPoint2": "Esquemas de razão variável geram a taxa mais alta de resposta e persistência.",
  "reinforcementPoint3": "A imprevisibilidade mantém seu cérebro curioso e motivado!",
  "githubRepo": "Repositório GitHub",
  "thirdPartyLicenses": "Licenças de Terceiros"
}
`
  }
];
