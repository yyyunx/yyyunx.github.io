export const locales = ['zh-tw', 'en'] as const;
export type Locale = (typeof locales)[number];
export const pathFor = (lang: Locale, path = '') =>
  `${lang === 'en' ? '/en' : ''}/${path.replace(/^\/+|\/+$/g, '')}${path ? '/' : ''}`;
export const otherLocale = (lang: Locale): Locale =>
  lang === 'en' ? 'zh-tw' : 'en';
export const ui = {
  'zh-tw': {
    home: '首頁',
    projects: '專案',
    notes: '筆記',
    research: '研究興趣',
    about: '關於',
    skip: '跳至主要內容',
    allProjects: '所有專案',
    allNotes: '所有筆記',
    read: '閱讀專案',
    featured: '精選專案',
    other: '其他專案',
    coursework: '課程紀錄',
    contact: '聯絡',
    source: '原始碼',
    evidence: '參考文件',
    contents: '本頁內容',
    backProjects: '返回專案',
    backNotes: '返回筆記',
    roadmap: '接下來的學習方向',
    roadmapDescription:
      '以下是準備逐步探索的主題，尚未完成的實作會在有成果後再加入。',
    theme: '色彩主題',
    system: '系統',
    light: '淺色',
    dark: '深色',
    footer: '專案、實驗，以及持續累積的技術筆記。',
    noNotes: '目前尚無公開筆記。',
  },
  en: {
    home: 'Home',
    projects: 'Projects',
    notes: 'Notes',
    research: 'Research',
    about: 'About',
    skip: 'Skip to content',
    allProjects: 'All projects',
    allNotes: 'All notes',
    read: 'Read project',
    featured: 'Selected projects',
    other: 'Other projects',
    coursework: 'Coursework',
    contact: 'Contact',
    source: 'Source code',
    evidence: 'References',
    contents: 'On this page',
    backProjects: 'Back to projects',
    backNotes: 'Back to notes',
    roadmap: 'What I want to learn next',
    roadmapDescription:
      'These are directions to explore. Implementations will be added when there is work to share.',
    theme: 'Color theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    footer: 'Projects, experiments, and notes along the way.',
    noNotes: 'No public notes yet.',
  },
} as const;
export const categories = {
  'AI & Computer Vision': {
    'zh-tw': 'AI 與電腦視覺',
    en: 'AI & Computer Vision',
  },
  'Developer Tools': { 'zh-tw': '開發工具', en: 'Developer Tools' },
  'Systems & Computer Architecture': {
    'zh-tw': '系統與電腦架構',
    en: 'Systems & Computer Architecture',
  },
  'Web & Applications': { 'zh-tw': '網頁與應用', en: 'Web & Applications' },
  Automation: { 'zh-tw': '自動化', en: 'Automation' },
  Coursework: { 'zh-tw': '課程作業', en: 'Coursework' },
} as const;
export const statuses = {
  Maintained: { 'zh-tw': '持續維護', en: 'Maintained' },
  Experimental: { 'zh-tw': '實驗性專案', en: 'Experimental' },
  'Hackathon Prototype': { 'zh-tw': '黑客松原型', en: 'Hackathon prototype' },
  'Course Project': { 'zh-tw': '課程專案', en: 'Course project' },
  'Learning Project': { 'zh-tw': '學習專案', en: 'Learning project' },
  Completed: { 'zh-tw': '已完成', en: 'Completed' },
  'In Development': { 'zh-tw': '開發中', en: 'In development' },
} as const;
