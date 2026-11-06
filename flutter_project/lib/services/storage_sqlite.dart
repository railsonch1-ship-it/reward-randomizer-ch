import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:reward_randomizer/models/activity.dart';

abstract class Storage {
  Future<List<Activity>> loadActivities();
  Future<void> addActivity(Activity activity);
  Future<void> removeActivity(Activity activity);
  Future<void> updateActivity(Activity activity);
}

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
