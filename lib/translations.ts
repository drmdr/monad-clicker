export type Language = 'en' | 'ja';

export const translations = {
  en: {
    title: 'Monad Cookie Clicker',
    cookies: 'Cookies',
    cookiesPerSecond: 'per second',
    cost: 'Cost',
    owned: 'Owned',
    'Auto Clicker': 'Auto Clicker',
    'Super Clicker': 'Super Clicker',
    'Mega Clicker': 'Mega Clicker',
  },
  ja: {
    title: 'Monad クッキークリッカー',
    cookies: 'クッキー',
    cookiesPerSecond: '毎秒',
    cost: 'コスト',
    owned: '所持数',
    'Auto Clicker': 'オートクリッカー',
    'Super Clicker': 'スーパークリッカー',
    'Mega Clicker': 'メガクリッカー',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language][key] ?? translations.en[key];
}
