import 'package:shared_preferences/shared_preferences.dart';

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

  double get countdownDuration => _prefs.getDouble(_keyCountdown) ?? 0.8;
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
