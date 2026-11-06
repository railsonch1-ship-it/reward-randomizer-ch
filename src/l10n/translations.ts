export interface AppStrings {
  appTitle: string;
  activities: string;
  addActivity: string;
  editActivity: string;
  activate: string;
  activating: string;
  order: string;
  settings: string;
  about: string;
  history: string;
  exportCode: string;
  questionLabel: string;
  questionHint: string;
  labelField: string;
  labelHint: string;
  answerField: string;
  answerHint: string;
  reciprocalField: string;
  reciprocalHint: string;
  probabilityText: (reciprocal: number, pct: string) => string;
  rewardsField: string;
  rewardsHint: string;
  addReward: string;
  noRewardsYet: string;
  save: string;
  delete: string;
  cancel: string;
  confirmDeleteTitle: string;
  confirmDeleteMessage: string;
  selectIcon: string;
  searchIcons: string;
  allCategories: string;
  countdownDuration: string;
  theme: string;
  themeSystem: string;
  themeLight: string;
  themeDark: string;
  language: string;
  soundEffects: string;
  hapticFeedback: string;
  seconds: string;
  orderCreatedAsc: string;
  orderCreatedDesc: string;
  orderQuestionAsc: string;
  orderQuestionDesc: string;
  orderLabelAsc: string;
  orderLabelDesc: string;
  orderUserDefined: string;
  orderRandom: string;
  noActivitiesTitle: string;
  noActivitiesSubtitle: string;
  addFirstActivity: string;
  rewardCongratulations: string;
  noRewardTitle: string;
  noRewardSubtitle: string;
  defaultRewards: string[];
  aboutDesc: string;
  reinforcementExplanation: string;
  reinforcementPoint1: string;
  reinforcementPoint2: string;
  reinforcementPoint3: string;
  githubRepo: string;
  thirdPartyLicenses: string;
  historyTitle: string;
  historyEmpty: string;
  totalActivations: string;
  rewardRate: string;
  clearHistory: string;
}

export const translations: Record<'en' | 'sv' | 'pt', AppStrings> = {
  en: {
    appTitle: 'Reward Randomizer',
    activities: 'Activities',
    addActivity: 'Add Activity',
    editActivity: 'Edit Activity',
    activate: 'Activate',
    activating: 'Drawing...',
    order: 'Order',
    settings: 'Preferences',
    about: 'About',
    history: 'History',
    exportCode: 'Flutter Code',
    questionLabel: 'Question',
    questionHint: 'e.g. Did you drink a glass of water?',
    labelField: 'Label',
    labelHint: 'e.g. Hydration',
    answerField: 'Answer',
    answerHint: 'e.g. Yes',
    reciprocalField: 'Reciprocal (Odds denominator)',
    reciprocalHint: 'Sets the intermittent reward ratio (1 in N)',
    probabilityText: (reciprocal, pct) => `1 in ${reciprocal} chance (~${pct}%)`,
    rewardsField: 'Rewards Pool',
    rewardsHint: 'Enter reward and press Enter or Add',
    addReward: 'Add Reward',
    noRewardsYet: 'No rewards added yet. Default suggestions will be applied.',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
    confirmDeleteTitle: 'Delete Activity?',
    confirmDeleteMessage: 'Are you sure you want to delete this activity and its associated rewards?',
    selectIcon: 'Select Icon',
    searchIcons: 'Search icon names...',
    allCategories: 'All Categories',
    countdownDuration: 'Countdown Duration',
    theme: 'Dark Theme',
    themeSystem: 'System default',
    themeLight: 'Light theme',
    themeDark: 'Dark theme',
    language: 'Language',
    soundEffects: 'Sound Effects',
    hapticFeedback: 'Haptic Feedback',
    seconds: 'seconds',
    orderCreatedAsc: 'Oldest first',
    orderCreatedDesc: 'Newest first',
    orderQuestionAsc: 'Question (A to Z)',
    orderQuestionDesc: 'Question (Z to A)',
    orderLabelAsc: 'Label (A to Z)',
    orderLabelDesc: 'Label (Z to A)',
    orderUserDefined: 'User defined',
    orderRandom: 'Random',
    noActivitiesTitle: 'No activities yet',
    noActivitiesSubtitle: 'Create daily tasks or habits and attach probabilistic rewards to reinforce them!',
    addFirstActivity: 'Create Activity',
    rewardCongratulations: 'Reward Unlocked!',
    noRewardTitle: 'No reward this time',
    noRewardSubtitle: 'Keep up the good habit! Intermittent reinforcement builds lasting discipline.',
    defaultRewards: [
      'Take a 10-minute break',
      'Enjoy your favorite snack',
      'Watch an episode of your show',
      'Play a video game for 20m',
      'Buy a special coffee or tea',
      '15 minutes of guilt-free browsing'
    ],
    aboutDesc: 'Reward Randomizer helps you build enduring habits using an intermittent (probabilistic) reinforcement schedule.',
    reinforcementExplanation: 'Why Intermittent Rewards Work:',
    reinforcementPoint1: 'Fixed rewards quickly cause dopamine habituation and satiation—leading to burnout.',
    reinforcementPoint2: 'Variable-ratio schedules (like those discovered by B.F. Skinner) produce the highest response rate and maximum resistance to extinction.',
    reinforcementPoint3: 'Uncertainty keeps the brain engaged. When you perform the habit, you might win, making each completion an exciting event!',
    githubRepo: 'GitHub Repository',
    thirdPartyLicenses: 'Third Party Licenses',
    historyTitle: 'Habit Activation Log',
    historyEmpty: 'No habit activations logged yet. Tap "Activate" on any activity card!',
    totalActivations: 'Total Activations',
    rewardRate: 'Reward Strike Rate',
    clearHistory: 'Clear History'
  },
  sv: {
    appTitle: 'Reward Randomizer',
    activities: 'Aktiviteter',
    addActivity: 'Lägg till aktivitet',
    editActivity: 'Redigera aktivitet',
    activate: 'Aktivera',
    activating: 'Drar lott...',
    order: 'Sortering',
    settings: 'Inställningar',
    about: 'Om',
    history: 'Historik',
    exportCode: 'Flutter-kod',
    questionLabel: 'Fråga',
    questionHint: 't.ex. Drack du ett glas vatten?',
    labelField: 'Etikett',
    labelHint: 't.ex. Återfuktning',
    answerField: 'Svar',
    answerHint: 't.ex. Ja',
    reciprocalField: 'Reciprok (Odds-nämnare)',
    reciprocalHint: 'Ställer in intermittent belöningsfrekvens (1 på N)',
    probabilityText: (reciprocal, pct) => `1 på ${reciprocal} chans (~${pct}%)`,
    rewardsField: 'Belöningspool',
    rewardsHint: 'Skriv in belöning och tryck Enter eller Lägg till',
    addReward: 'Lägg till belöning',
    noRewardsYet: 'Inga belöningar inlagda än. Standardförslag används.',
    save: 'Spara',
    delete: 'Ta bort',
    cancel: 'Avbryt',
    confirmDeleteTitle: 'Ta bort aktivitet?',
    confirmDeleteMessage: 'Är du säker på att du vill ta bort den här aktiviteten och dess belöningar?',
    selectIcon: 'Välj ikon',
    searchIcons: 'Sök ikoner...',
    allCategories: 'Alla kategorier',
    countdownDuration: 'Nedräkningstid',
    theme: 'Mörkt tema',
    themeSystem: 'Systemstandard',
    themeLight: 'Ljust tema',
    themeDark: 'Mörkt tema',
    language: 'Språk',
    soundEffects: 'Ljudeffekter',
    hapticFeedback: 'Haptisk återkoppling',
    seconds: 'sekunder',
    orderCreatedAsc: 'Äldsta först',
    orderCreatedDesc: 'Nyaste först',
    orderQuestionAsc: 'Fråga (A till Ö)',
    orderQuestionDesc: 'Fråga (Ö till A)',
    orderLabelAsc: 'Etikett (A till Ö)',
    orderLabelDesc: 'Etikett (Ö till A)',
    orderUserDefined: 'Användardefinierad',
    orderRandom: 'Slumpmässig',
    noActivitiesTitle: 'Inga aktiviteter än',
    noActivitiesSubtitle: 'Skapa vanor och koppla slumpmässiga belöningar till dem!',
    addFirstActivity: 'Skapa aktivitet',
    rewardCongratulations: 'Belöning upplåst!',
    noRewardTitle: 'Ingen belöning den här gången',
    noRewardSubtitle: 'Fortsätt med den goda vanan! Intermittent förstärkning bygger varaktig disciplin.',
    defaultRewards: [
      'Ta en 10-minuters paus',
      'Njut av ett gott mellanmål',
      'Se ett avsnitt av din favoritserie',
      'Spela ett datorspel i 20 minuter',
      'Köp en god kopp kaffe eller te',
      '15 minuters avslappnad surfning'
    ],
    aboutDesc: 'Reward Randomizer hjälper dig bygga långsiktiga vanor med ett intermittent belöningssystem.',
    reinforcementExplanation: 'Varför intermittenta belöningar fungerar:',
    reinforcementPoint1: 'Fasta belöningar leder snabbt till dopaminmättnad och minskad motivation.',
    reinforcementPoint2: 'Variabel förstärkning (upptäckt av B.F. Skinner) ger maximal uthållighet och motivation.',
    reinforcementPoint3: 'Ovisheten håller hjärnan engagerad och gör varje avklarad vana spännande!',
    githubRepo: 'GitHub-arkiv',
    thirdPartyLicenses: 'Tredjepartslicenser',
    historyTitle: 'Aktivitetshistorik',
    historyEmpty: 'Inga aktiveringar loggade än.',
    totalActivations: 'Totalt antal aktiveringar',
    rewardRate: 'Belöningsfrekvens',
    clearHistory: 'Rensa historik'
  },
  pt: {
    appTitle: 'Reward Randomizer',
    activities: 'Atividades',
    addActivity: 'Adicionar Atividade',
    editActivity: 'Editar Atividade',
    activate: 'Ativar',
    activating: 'Sorteando...',
    order: 'Ordenar',
    settings: 'Preferências',
    about: 'Sobre',
    history: 'Histórico',
    exportCode: 'Código Flutter',
    questionLabel: 'Pergunta',
    questionHint: 'ex: Bebeu um copo de água?',
    labelField: 'Rótulo',
    labelHint: 'ex: Hidratação',
    answerField: 'Resposta',
    answerHint: 'ex: Sim',
    reciprocalField: 'Recíproco (Denominador da chance)',
    reciprocalHint: 'Define a probabilidade intermitente (1 em N)',
    probabilityText: (reciprocal, pct) => `1 em ${reciprocal} chances (~${pct}%)`,
    rewardsField: 'Pool de Recompensas',
    rewardsHint: 'Digite a recompensa e pressione Enter ou Adicionar',
    addReward: 'Adicionar Recompensa',
    noRewardsYet: 'Nenhuma recompensa adicionada. Sugestões padrão serão usadas.',
    save: 'Salvar',
    delete: 'Excluir',
    cancel: 'Cancelar',
    confirmDeleteTitle: 'Excluir Atividade?',
    confirmDeleteMessage: 'Tem certeza de que deseja excluir esta atividade e suas recompensas associadas?',
    selectIcon: 'Selecionar Ícone',
    searchIcons: 'Buscar ícones...',
    allCategories: 'Todas as Categorias',
    countdownDuration: 'Duração da Contagem Regressiva',
    theme: 'Tema Escuro',
    themeSystem: 'Padrão do Sistema',
    themeLight: 'Tema Claro',
    themeDark: 'Tema Escuro',
    language: 'Idioma',
    soundEffects: 'Efeitos Sonoros',
    hapticFeedback: 'Feedback Tátil',
    seconds: 'segundos',
    orderCreatedAsc: 'Mais antigas',
    orderCreatedDesc: 'Mais recentes',
    orderQuestionAsc: 'Pergunta (A a Z)',
    orderQuestionDesc: 'Pergunta (Z a A)',
    orderLabelAsc: 'Rótulo (A a Z)',
    orderLabelDesc: 'Rótulo (Z a A)',
    orderUserDefined: 'Definida pelo Usuário',
    orderRandom: 'Aleatória',
    noActivitiesTitle: 'Nenhuma atividade ainda',
    noActivitiesSubtitle: 'Crie hábitos diários e associe recompensas probabilísticas para reforçá-los!',
    addFirstActivity: 'Criar Atividade',
    rewardCongratulations: 'Recompensa Desbloqueada!',
    noRewardTitle: 'Nenhuma recompensa desta vez',
    noRewardSubtitle: 'Continue firme no hábito! O reforço intermitente constrói disciplina duradoura.',
    defaultRewards: [
      'Faça uma pausa de 10 minutos',
      'Aproveite um lanche gostoso',
      'Assista a um episódio da sua série',
      'Jogue videogame por 20 minutos',
      'Tome um café ou chá especial',
      '15 minutos de navegação livre'
    ],
    aboutDesc: 'O Reward Randomizer ajuda você a construir hábitos consistentes usando um sistema de recompensas intermitentes (probabilísticas).',
    reinforcementExplanation: 'Por que o Reforço Intermitente Funciona:',
    reinforcementPoint1: 'Recompensas previsíveis causam habituação rápida da dopamina, gerando desinteresse.',
    reinforcementPoint2: 'Esquemas de razão variável (descobertos por B.F. Skinner) geram a taxa mais alta de resposta e máxima resistência à extinção.',
    reinforcementPoint3: 'A imprevisibilidade mantém seu cérebro curioso e engajado a cada conclusão de hábito!',
    githubRepo: 'Repositório GitHub',
    thirdPartyLicenses: 'Licenças de Terceiros',
    historyTitle: 'Registro de Ativações',
    historyEmpty: 'Nenhuma ativação registrada ainda. Clique em "Ativar" em qualquer cartão!',
    totalActivations: 'Total de Ativações',
    rewardRate: 'Taxa de Recompensas',
    clearHistory: 'Limpar Histórico'
  }
};
