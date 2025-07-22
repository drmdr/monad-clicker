'use client';

import { useState, useEffect } from 'react';
import { FarcasterActions } from '@/components/Home/FarcasterActions'
import { User } from '@/components/Home/User'
import { WalletActions } from '@/components/Home/WalletActions'
import { NotificationActions } from './NotificationActions'
import Image from 'next/image'


interface Upgrade {
  id: string
  name: string
  description: string
  baseCost: number
  currentCost: number
  count: number
  cookiesPerSecond: number
  multiplier: number
}

export function Demo() {
  const [cookies, setCookies] = useState<number>(0)
  const [cookiesPerClick, setCookiesPerClick] = useState<number>(1)
  const [cookiesPerSecond, setCookiesPerSecond] = useState<number>(0)
  const [clickEffect, setClickEffect] = useState<{x: number, y: number, show: boolean, value: number}>({
    x: 0, y: 0, show: false, value: 0
  })
  const [savedScoreLoaded, setSavedScoreLoaded] = useState<boolean>(false)
  
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 'cursor',
      name: 'カーソル',
      description: '自動でクッキーをクリックします',
      baseCost: 15,
      currentCost: 15,
      count: 0,
      cookiesPerSecond: 0.1,
      multiplier: 1.15,
    },
    {
      id: 'grandma',
      name: 'おばあちゃん',
      description: 'クッキーを焼いてくれます',
      baseCost: 100,
      currentCost: 100,
      count: 0,
      cookiesPerSecond: 1,
      multiplier: 1.15,
    },
    {
      id: 'farm',
      name: 'クッキー農場',
      description: '大量のクッキーを生産します',
      baseCost: 1100,
      currentCost: 1100,
      count: 0,
      cookiesPerSecond: 8,
      multiplier: 1.15,
    },
  ])
  
  // クッキー自動生成の効果
  useEffect(() => {
    const interval = setInterval(() => {
      if (cookiesPerSecond > 0) {
        setCookies(prev => prev + cookiesPerSecond / 10)
      }
    }, 100)
    
    return () => clearInterval(interval)
  }, [cookiesPerSecond])
  
  // クッキーをクリック
  const handleCookieClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setCookies(prev => prev + cookiesPerClick)
    
    // クリック効果を表示
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setClickEffect({
      x,
      y,
      show: true,
      value: cookiesPerClick
    })
    
    setTimeout(() => {
      setClickEffect(prev => ({ ...prev, show: false }))
    }, 1000)
  }
  
  // アップグレードを購入
  const buyUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id)
    if (!upgrade || cookies < upgrade.currentCost) return
    
    setCookies(prev => prev - upgrade.currentCost)
    
    setUpgrades(prev => prev.map(u => {
      if (u.id === id) {
        const newCount = u.count + 1
        const newCost = Math.floor(u.baseCost * Math.pow(u.multiplier, newCount))
        return { ...u, count: newCount, currentCost: newCost }
      }
      return u
    }))
    
    // クッキー/秒の更新
    const newCookiesPerSecond = upgrades.reduce((total, u) => {
      if (u.id === id) {
        return total + (u.count + 1) * u.cookiesPerSecond
      }
      return total + u.count * u.cookiesPerSecond
    }, 0)
    
    setCookiesPerSecond(newCookiesPerSecond)
  }
  
  // クリックアップグレードを購入
  const buyClickUpgrade = () => {
    const cost = cookiesPerClick * 100
    if (cookies < cost) return
    
    setCookies(prev => prev - cost)
    setCookiesPerClick(prev => prev + 1)
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Monad クッキークリッカー</h1>
      
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-2xl font-bold">クッキー: {Math.floor(cookies)}枚</div>
          <div className="text-sm text-gray-400">毎秒 {cookiesPerSecond.toFixed(1)} 枚</div>
          
          <div className="relative cursor-pointer" onClick={handleCookieClick}>
            <div className="w-40 h-40 bg-yellow-800 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
              <div className="w-36 h-36 bg-yellow-600 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center text-4xl">
                  🍪
                </div>
              </div>
            </div>
            
            {clickEffect.show && (
              <div 
                className="absolute text-white font-bold animate-float-up pointer-events-none"
                style={{ left: clickEffect.x, top: clickEffect.y }}
              >
                +{clickEffect.value}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#333] rounded-md p-4">
            <h2 className="text-xl font-bold mb-4">アップグレード</h2>
            <div className="space-y-2">
              {upgrades.map(upgrade => (
                <div key={upgrade.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{upgrade.name} ({upgrade.count})</div>
                    <div className="text-sm text-gray-400">{upgrade.description}</div>
                    <div className="text-xs">毎秒 {upgrade.cookiesPerSecond} 枚</div>
                  </div>
                  <button
                    className={`px-3 py-1 rounded-md ${cookies >= upgrade.currentCost ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-gray-600 cursor-not-allowed'}`}
                    onClick={() => buyUpgrade(upgrade.id)}
                    disabled={cookies < upgrade.currentCost}
                  >
                    {Math.floor(upgrade.currentCost)}枚で購入
                  </button>
                </div>
              ))}
              
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">クリックパワー ({cookiesPerClick})</div>
                    <div className="text-sm text-gray-400">1クリックあたりのクッキー数を増やします</div>
                  </div>
                  <button
                    className={`px-3 py-1 rounded-md ${cookies >= cookiesPerClick * 100 ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-gray-600 cursor-not-allowed'}`}
                    onClick={buyClickUpgrade}
                    disabled={cookies < cookiesPerClick * 100}
                  >
                    {cookiesPerClick * 100}枚で購入
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <User />
            <FarcasterActions />
            <WalletActions 
              cookies={cookies} 
              onLoadSavedScore={(score) => {
                if (!savedScoreLoaded && score > cookies) {
                  setCookies(score);
                  setSavedScoreLoaded(true);
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
