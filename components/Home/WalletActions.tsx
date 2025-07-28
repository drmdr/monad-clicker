import { useFrame } from '@/components/farcaster-provider';
import { Button } from '@/components/ui/button';
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
      <div className="w-full text-center space-y-3">
        <p className="text-xs text-gray-600">
          <span className="font-bold">Monad Testnet</span>に接続中:
          <span className="ml-2 font-mono bg-gray-200 rounded-md px-2 py-1 text-xs">
            {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
          </span>
        </p>

        {chainId !== monadTestnet.id ? (
          <Button onClick={() => switchChain({ chainId: monadTestnet.id })} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
            Monad Testnetに切り替える
          </Button>
        ) : (
          <div className="space-y-3">
            <Button onClick={saveScore} disabled={isSaving || cookies <= 0} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
              {isSaving ? '保存中...' : `現在のスコア (${Math.floor(cookies)}) を保存`}
            </Button>

            <Button onClick={() => refetchScore()} variant="outline" className="w-full">
              {savedScore !== null ? `保存したスコア (${savedScore}) を読み込む` : '保存したスコアを読み込む'}
            </Button>

            {saveSuccess && (
                <p className="text-green-600 font-bold text-sm animate-pulse">
                  ✅ スコアが正常に保存されました！
                </p>
            )}

            {saveHash && (
              <a
                href={`https://testnet.monadexplorer.com/tx/${saveHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm mt-2 inline-block"
              >
                最新のトランザクションを確認
              </a>
            )}
          </div>
        )}

        <Button onClick={() => disconnect()} variant="ghost" size="sm" className="text-xs text-gray-500">
          切断する
        </Button>
      </div>
    );
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
