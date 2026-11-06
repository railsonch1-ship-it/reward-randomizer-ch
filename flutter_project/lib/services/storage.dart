import 'package:reward_randomizer/models/activity.dart';

abstract class Storage {
  Future<List<Activity>> loadActivities();
  Future<void> addActivity(Activity activity);
  Future<void> removeActivity(Activity activity);
  Future<void> updateActivity(Activity activity);
}
