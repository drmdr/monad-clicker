'use client';

import { useChangeLocale, useCurrentLocale } from '@/internationalization/client';

export default function LocaleSwitcher() {
  const changeLocale = useChangeLocale();
  const currentLocale = useCurrentLocale();

  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100 }}>
      <button
        onClick={() => changeLocale('en')}
        style={{ fontWeight: currentLocale === 'en' ? 'bold' : 'normal', marginRight: '0.5rem' }}
      >
        EN
      </button>
      |
      <button
        onClick={() => changeLocale('ja')}
        style={{ fontWeight: currentLocale === 'ja' ? 'bold' : 'normal', marginLeft: '0.5rem' }}
      >
        JP
      </button>
    </div>
  );
}
