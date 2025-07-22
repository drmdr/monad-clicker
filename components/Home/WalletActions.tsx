import { useFrame } from '@/components/farcaster-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { parseEther, encodeFunctionData } from 'viem'
import { monadTestnet } from 'viem/chains'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { useState, useEffect } from 'react'

// クッキークリッカーのスマートコントラクトABI（簡易版）
const cookieClickerABI = [
  {
    inputs: [{ name: 'player', type: 'address' }],
    name: 'getScore',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'score', type: 'uint256' }],
    name: 'saveScore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTopScores',
    outputs: [
      {
        components: [
          { name: 'player', type: 'address' },
          { name: 'score', type: 'uint256' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

// スマートコントラクトのアドレス（実際のデプロイ時に置き換える）
const CONTRACT_ADDRESS = '0x7f748f154B6D180D35fA12460C7E4C631e28A9d7'

// 親コンポーネントから受け取るプロップスの型定義
interface WalletActionsProps {
  cookies?: number
  onLoadSavedScore?: (score: number) => void
}

export function WalletActions({ cookies = 0, onLoadSavedScore }: WalletActionsProps) {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()
  const [savedScore, setSavedScore] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // スコアを保存するコントラクト関数
  const { writeContract, isPending, isSuccess, data: saveHash } = useWriteContract()
  
  // 保存されたスコアを読み込むコントラクト関数
  const { data: savedScoreData, refetch: refetchScore } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: cookieClickerABI,
    functionName: 'getScore',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && address !== undefined && chainId === monadTestnet.id
    }
  })
  
  // スコアが読み込まれたら親コンポーネントに通知
  useEffect(() => {
    if (savedScoreData && onLoadSavedScore) {
      const score = Number(savedScoreData)
      setSavedScore(score)
      onLoadSavedScore(score)
    }
  }, [savedScoreData, onLoadSavedScore])
  
  // スコアを保存する関数
  const saveScore = () => {
    if (!isConnected || chainId !== monadTestnet.id || !address) return
    
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: cookieClickerABI,
        functionName: 'saveScore',
        args: [BigInt(Math.floor(cookies))],
      })
    } catch (error) {
      console.error('スコア保存エラー:', error)
      setIsSaving(false)
    }
  }
  
  // 保存成功時の処理
  useEffect(() => {
    if (isSuccess) {
      setIsSaving(false)
      setSaveSuccess(true)
      // 3秒後に成功メッセージを非表示
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }, [isSuccess])

  if (isConnected) {
    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4 mt-4">
        <h2 className="text-xl font-bold text-left">Monad Testnet連携</h2>
        <div className="flex flex-col space-y-4 justify-start">
          <p className="text-sm text-left">
            ウォレット接続済み:{' '}
            <span className="bg-white font-mono text-black rounded-md p-[4px] text-xs">
              {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
            </span>
          </p>
          
          {chainId !== monadTestnet.id ? (
            <button
              type="button"
              className="bg-yellow-600 hover:bg-yellow-500 text-white rounded-md p-2 text-sm"
              onClick={() => switchChain({ chainId: monadTestnet.id })}
            >
              Monad Testnetに切り替える
            </button>
          ) : (
            <div className="flex flex-col space-y-4">
              {savedScore !== null && (
                <p className="text-sm">
                  保存済みスコア: <span className="font-bold">{savedScore}</span> クッキー
                </p>
              )}
              
              <div className="flex flex-row space-x-2">
                <button
                  type="button"
                  className="bg-yellow-600 hover:bg-yellow-500 text-white rounded-md p-2 text-sm flex-1"
                  onClick={saveScore}
                  disabled={isSaving || cookies <= 0}
                >
                  {isSaving ? '保存中...' : 'スコアを保存'}
                </button>
                
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-500 text-white rounded-md p-2 text-sm"
                  onClick={() => refetchScore()}
                >
                  更新
                </button>
              </div>
              
              {saveSuccess && (
                <div className="text-green-500 text-sm">
                  スコアが正常に保存されました！
                </div>
              )}
              
              {saveHash && (
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-md p-2 text-sm"
                  onClick={() =>
                    window.open(
                      `https://testnet.monadexplorer.com/tx/${saveHash}`,
                      '_blank',
                    )
                  }
                >
                  トランザクション確認
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            className="bg-gray-600 hover:bg-gray-500 text-white rounded-md p-2 text-sm"
            onClick={() => disconnect()}
          >
            ウォレット接続解除
          </button>
        </div>
      </div>
    )
  }

  if (isEthProviderAvailable) {
    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4 mt-4">
        <h2 className="text-xl font-bold text-left">Monad Testnet連携</h2>
        <div className="flex flex-col space-y-2">
          <p className="text-sm">ウォレットを接続してスコアを保存・読み込みできます</p>
          <button
            type="button"
            className="bg-yellow-600 hover:bg-yellow-500 text-white w-full rounded-md p-2 text-sm"
            onClick={() => connect({ connector: miniAppConnector() })}
          >
            ウォレットを接続
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4 mt-4">
      <h2 className="text-xl font-bold text-left">Monad Testnet連携</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        <p className="text-sm text-left">Warpcast経由でのみウォレット接続可能です</p>
      </div>
    </div>
  )
}
