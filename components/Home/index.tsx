"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getTranslation, TranslationKey } from "@/lib/translations";
import { WalletActions } from "./WalletActions";
import { LanguageSwitcher, type Language } from "@/components/LanguageSwitcher";

export function Demo() {
  const [cookies, setCookies] = useState(0);
  const [cookiesPerSecond, setCookiesPerSecond] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en"); // 日本語から英語をデフォルトに変更
  const [isTapped, setIsTapped] = useState(false);

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
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 150); // アニメーション時間
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
      {/* 背景の装飾 - 背景グラデーションの上、他の要素の下に配置 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-pink-300 rounded-full"></div>
        <div className="absolute bottom-40 left-16 w-10 h-10 bg-blue-300 rounded-full"></div>
        <div className="absolute top-64 left-1/3 w-4 h-4 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-purple-300 rounded-full"></div>
        <div className="absolute top-20 right-1/3 w-5 h-5 bg-orange-300 rounded-full"></div>
      </div>

      <div className="relative z-[5] flex flex-col items-center justify-center min-h-screen p-6 space-y-8">
        {/* 言語切り替え */}
        <div className="absolute top-4 right-4">
            <LanguageSwitcher onLanguageChange={setCurrentLanguage} />
        </div>
        
        {/* タイトル - 横幅最大化＆フォントサイズ調整で改行防止 */}
        <h1
          className="w-full font-bold text-center text-purple-800 drop-shadow-lg"
          style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}
        >
          {t('title')}
        </h1>

        <div className="flex flex-col items-center space-y-6">
          {/* クッキー本体 */}
          <button
            onClick={handleCookieClick}
            className="relative group transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <Image
              src={isTapped ? "/images/cookie02.png" : "/images/cookie01.png"}
              width={256}
              height={256}
              alt="Cookie"
              priority
              className={`w-64 h-64 ${isTapped ? 'animate-vibrate' : ''}`}
            />
          </button>

          {/* カウンター */}
          <div className="text-center space-y-2">
            <div
              className="text-3xl font-bold text-purple-800 drop-shadow-md"
              
            >
              🍪 {formatNumber(cookies)} {t('cookies')}
            </div>
            <div className="text-xl text-purple-600 drop-shadow-sm" >
              {formatNumber(cookiesPerSecond)} {t('cookiesPerSecond')}
            </div>
          </div>

          {/* ウォレット連携 */}
          <div className="w-full max-w-sm p-4 bg-white/30 rounded-2xl shadow-lg backdrop-blur-sm border border-white/50">
             <WalletActions cookies={cookies} onLoadSavedScore={setCookies} />
          </div>
        </div>

        {/* アップグレード */}
        <div className="w-full max-w-md grid grid-cols-2 gap-4">
          {Object.keys(upgrades).map((key) => {
            const upgradeKey = key as keyof typeof upgrades;
            const upgrade = upgrades[upgradeKey];
            const canAfford = cookies >= upgrade.cost;
            return (
              <button
                key={upgradeKey}
                onClick={() => buyUpgrade(upgradeKey)}
                disabled={!canAfford}
                className={`relative w-full p-4 rounded-2xl shadow-md transition-transform transform hover:scale-105 disabled:cursor-not-allowed flex flex-col items-center justify-center text-center h-40 z-[2] ${
                  canAfford ? 'bg-pink-400 text-white' : 'bg-gray-200'
                }`}
              >
                <span className="text-4xl mb-2">
                  {upgradeKey === 'cursor' ? '👆' : upgradeKey === 'grandma' ? '👵' : '🚜'}
                </span>
                <div>
                  <span className="block font-bold text-lg">{t(upgrade.id)}</span>
                  <span className="block text-xs">
                    {t('cost')}: {formatNumber(upgrade.cost)}
                  </span>
                  <span className="block text-xs">
                    {t('owned')}: {upgrade.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}