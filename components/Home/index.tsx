"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getTranslation, TranslationKey } from "@/lib/translations";
import { LanguageSwitcher, type Language } from "@/components/LanguageSwitcher";

export function Demo() {
  const [cookies, setCookies] = useState(0);
  const [cookiesPerSecond, setCookiesPerSecond] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en"); // 初期言語を英語に修正

  const [upgrades, setUpgrades] = useState({
    cursor: { id: 'Auto Clicker' as TranslationKey, count: 0, cost: 15, cps: 0.1 },
    grandma: { id: 'Super Clicker' as TranslationKey, count: 0, cost: 100, cps: 1 },
    farm: { id: 'Mega Clicker' as TranslationKey, count: 0, cost: 1100, cps: 8 },
  });

  const t = (key: TranslationKey) => getTranslation(currentLanguage, key);

  // クッキーの自動生成
  useEffect(() => {
    const interval = setInterval(() => {
      setCookies((prev) => prev + cookiesPerSecond / 10);
    }, 100);
    return () => clearInterval(interval);
  }, [cookiesPerSecond]);

  // クッキーをクリックしたときの処理
  const handleCookieClick = () => {
    setCookies((prev) => prev + 1);
  };

  // アップグレードを購入する処理
  const buyUpgrade = (type: keyof typeof upgrades) => {
    const upgrade = upgrades[type];
    if (cookies >= upgrade.cost) {
      setCookies((prev) => prev - upgrade.cost);
      
      const newCps = cookiesPerSecond + upgrade.cps;
      setCookiesPerSecond(newCps);

      setUpgrades((prev) => ({
        ...prev,
        [type]: {
          ...upgrade,
          count: upgrade.count + 1,
          cost: Math.floor(upgrade.cost * 1.15),
        },
      }));
    }
  };

  // 数字をK, M, B形式にフォーマットする関数
  const formatNumber = (num: number) => {
    const roundedNum = Math.floor(num);
    if (roundedNum < 1000) return roundedNum.toString();
    if (roundedNum < 1000000) return (num / 1000).toFixed(1) + "K";
    if (roundedNum < 1000000000) return (num / 1000000).toFixed(1) + "M";
    return (num / 1000000000).toFixed(1) + "B";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 relative overflow-hidden">
      {/* 背景の装飾 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-pink-300 rounded-full"></div>
        <div className="absolute bottom-40 left-16 w-10 h-10 bg-blue-300 rounded-full"></div>
        <div className="absolute top-64 left-1/3 w-4 h-4 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-purple-300 rounded-full"></div>
        <div className="absolute top-20 right-1/3 w-5 h-5 bg-orange-300 rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 space-y-8">
        {/* 言語切り替え */}
        <div className="absolute top-4 right-4">
            <LanguageSwitcher onLanguageChange={setCurrentLanguage} />
        </div>
        
        {/* タイトル */}
        <h1
          className="text-4xl font-bold text-center text-purple-800 drop-shadow-lg"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          🍪 {t('title')} 🍪
        </h1>

        <div className="flex flex-col items-center space-y-6">
          {/* クッキー本体 */}
          <button
            onClick={handleCookieClick}
            className="relative group transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            <div className="w-64 h-64 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full border-8 border-amber-600 shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-4 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full">
                {/* チョコチップ */}
                <div className="absolute top-8 left-12 w-6 h-6 bg-amber-800 rounded-full"></div>
                <div className="absolute top-16 right-8 w-4 h-4 bg-amber-900 rounded-full"></div>
                <div className="absolute bottom-12 left-8 w-5 h-5 bg-amber-800 rounded-full"></div>
                <div className="absolute bottom-8 right-12 w-6 h-6 bg-amber-900 rounded-full"></div>
                <div className="absolute top-20 left-1/2 w-4 h-4 bg-amber-800 rounded-full"></div>
                <div className="absolute bottom-16 right-1/3 w-3 h-3 bg-amber-900 rounded-full"></div>
              </div>
              {/* ホバー時のエフェクト */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-4 right-4 text-yellow-300 text-2xl animate-pulse">✨</div>
                <div className="absolute bottom-4 left-4 text-yellow-300 text-xl animate-pulse delay-150">⭐</div>
                <div className="absolute top-1/2 left-2 text-yellow-300 text-lg animate-pulse delay-300">💫</div>
              </div>
            </div>
          </button>

          {/* カウンター */}
          <div className="text-center space-y-2">
            <div
              className="text-3xl font-bold text-purple-800 drop-shadow-md"
              style={{ fontFamily: "Comic Sans MS, cursive" }}
            >
              🍪 {formatNumber(cookies)} {t('cookies')}
            </div>
            <div className="text-xl text-purple-600 drop-shadow-sm" style={{ fontFamily: "Comic Sans MS, cursive" }}>
              {formatNumber(cookiesPerSecond)} {t('cookiesPerSecond')}
            </div>
          </div>
        </div>

        {/* アップグレード */}
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
          {Object.keys(upgrades).map((key) => {
            const upgradeKey = key as keyof typeof upgrades;
            const upgrade = upgrades[upgradeKey];
            return (
              <Button
                key={upgrade.id}
                onClick={() => buyUpgrade(upgradeKey)}
                disabled={cookies < upgrade.cost}
                className="bg-gradient-to-br from-pink-300 to-pink-500 hover:from-pink-400 hover:to-pink-600 text-purple-800 font-bold py-4 px-6 rounded-3xl border-4 border-pink-600 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                style={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{key === 'cursor' ? '👆' : key === 'grandma' ? '👵' : '🚜'}</div>
                  <div className="text-sm">{t(upgrade.id)}</div>
                  <div className="text-xs">{t('cost')}: {formatNumber(upgrade.cost)}</div>
                  <div className="text-xs">{t('owned')}: {upgrade.count}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}