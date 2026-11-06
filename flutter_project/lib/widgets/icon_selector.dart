import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class IconSelectorDialog extends StatelessWidget {
  const IconSelectorDialog({super.key});

  static const List<IconData> _icons = [
    FontAwesomeIcons.glassWater,
    FontAwesomeIcons.dumbbell,
    FontAwesomeIcons.appleWhole,
    FontAwesomeIcons.bed,
    FontAwesomeIcons.heartPulse,
    FontAwesomeIcons.personRunning,
    FontAwesomeIcons.spa,
    FontAwesomeIcons.laptopCode,
    FontAwesomeIcons.briefcase,
    FontAwesomeIcons.checkDouble,
    FontAwesomeIcons.calendarCheck,
    FontAwesomeIcons.clock,
    FontAwesomeIcons.penNib,
    FontAwesomeIcons.lightbulb,
    FontAwesomeIcons.bookOpen,
    FontAwesomeIcons.graduationCap,
    FontAwesomeIcons.language,
    FontAwesomeIcons.brain,
    FontAwesomeIcons.newspaper,
    FontAwesomeIcons.mugHot,
    FontAwesomeIcons.music,
    FontAwesomeIcons.gamepad,
    FontAwesomeIcons.paintbrush,
    FontAwesomeIcons.guitar,
    FontAwesomeIcons.seedling,
    FontAwesomeIcons.camera,
    FontAwesomeIcons.bicycle,
    FontAwesomeIcons.shoePrints,
    FontAwesomeIcons.mountain,
    FontAwesomeIcons.medal,
    FontAwesomeIcons.basketball,
    FontAwesomeIcons.star,
    FontAwesomeIcons.fire,
    FontAwesomeIcons.dice,
  ];

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Selecionar Ícone'),
      content: SizedBox(
        width: double.maxFinite,
        child: GridView.builder(
          shrinkWrap: true,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 5,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
          ),
          itemCount: _icons.length,
          itemBuilder: (context, index) {
            final iconData = _icons[index];
            return InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: () {
                Navigator.of(context).pop(FaIcon(iconData));
              },
              child: Center(
                child: FaIcon(iconData, size: 24),
              ),
            );
          },
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Fechar'),
        ),
      ],
    );
  }
}
