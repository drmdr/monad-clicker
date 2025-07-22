export type Language = 'en' | 'ja';

export const translations = {
  en: {
    title: 'Monad Cookie Clicker',
    cookies: 'Cookies',
    perSecond: 'per second',
    upgrades: 'Upgrades',
    clickPower: 'Click Power',
    buyFor: 'Buy for',
    pieces: 'pieces',
    piece: 'piece',
    upgrades_data: {
      cursor: {
        name: 'Cursor',
        description: 'Automatically clicks cookies'
      },
      grandma: {
        name: 'Grandma',
        description: 'Bakes cookies for you'
      },
      farm: {
        name: 'Cookie Farm',
        description: 'Produces large amounts of cookies'
      }
    },
    clickPowerDescription: 'Increases cookies per click'
  },
  ja: {
    title: 'Monad クッキークリッカー',
    cookies: 'クッキー',
    perSecond: '毎秒',
    upgrades: 'アップグレード',
    clickPower: 'クリックパワー',
    buyFor: '',
    pieces: '枚で購入',
    piece: '枚',
    upgrades_data: {
      cursor: {
        name: 'カーソル',
        description: '自動でクッキーをクリックします'
      },
      grandma: {
        name: 'おばあちゃん',
        description: 'クッキーを焼いてくれます'
      },
      farm: {
        name: 'クッキー農場',
        description: '大量のクッキーを生産します'
      }
    },
    clickPowerDescription: '1クリックあたりのクッキー数を増やします'
  }
} as const;

export function getTranslation(language: Language) {
  return translations[language];
}
