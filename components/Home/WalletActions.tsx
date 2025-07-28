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

// Cookie Clicker Smart Contract ABI (simplified version)
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

// Smart contract address
const CONTRACT_ADDRESS = '0x7f748f154B6D180D35fA12460C7E4C631e28A9d7'

// Props interface definition
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
  
  // Contract function to save score
  const { writeContract, isPending, isSuccess, data: saveHash } = useWriteContract()
  
  // Contract function to load saved score
  const { data: savedScoreData, refetch: refetchScore } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: cookieClickerABI,
    functionName: 'getScore',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && address !== undefined && chainId === monadTestnet.id
    }
  })
  
  // Notify parent component when score is loaded
  useEffect(() => {
    if (savedScoreData && onLoadSavedScore) {
      const score = Number(savedScoreData)
      setSavedScore(score)
      onLoadSavedScore(score)
    }
  }, [savedScoreData, onLoadSavedScore])
  
  // Function to save score
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
      console.error('Score save error:', error)
      setIsSaving(false)
    }
  }
  
  // Handle successful save
  useEffect(() => {
    if (isSuccess) {
      setIsSaving(false)
      setSaveSuccess(true)
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }, [isSuccess])

  if (isConnected) {
    return (
      <div className="w-full text-center space-y-3">
        <p className="text-xs text-gray-600">
          <span className="font-bold">Monad Testnet</span> connected:
          <span className="ml-2 font-mono bg-gray-200 rounded-md px-2 py-1 text-xs">
            {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
          </span>
        </p>

        {chainId !== monadTestnet.id ? (
          <Button onClick={() => switchChain({ chainId: monadTestnet.id })} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
            Switch to Monad Testnet
          </Button>
        ) : (
          <div className="space-y-3">
            <Button onClick={saveScore} disabled={isSaving || cookies <= 0} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
              {isSaving ? 'Saving...' : `Save Current Score (${Math.floor(cookies)})`}
            </Button>

            <Button onClick={() => refetchScore()} variant="outline" className="w-full">
              {savedScore !== null ? `Load Saved Score (${savedScore})` : 'Load Saved Score'}
            </Button>

            {saveSuccess && (
                <p className="text-green-600 font-bold text-sm animate-pulse">
                  ✅ Score saved successfully!
                </p>
            )}

            {saveHash && (
              <a
                href={`https://testnet.monadexplorer.com/tx/${saveHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm mt-2 inline-block"
              >
                View Latest Transaction
              </a>
            )}
          </div>
        )}

        <Button onClick={() => disconnect()} variant="ghost" size="sm" className="text-xs text-gray-500">
          Disconnect
        </Button>
      </div>
    );
  }

  if (isEthProviderAvailable) {
    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4 mt-4">
        <h2 className="text-xl font-bold text-left">Monad Testnet Connection</h2>
        <div className="flex flex-col space-y-2">
          <p className="text-sm">Connect wallet to save and load your score</p>
          <button
            type="button"
            className="bg-yellow-600 hover:bg-yellow-500 text-white w-full rounded-md p-2 text-sm"
            onClick={() => connect({ connector: miniAppConnector() })}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4 mt-4">
      <h2 className="text-xl font-bold text-left">Monad Testnet連携</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        <p className="text-sm text-left">Wallet connection available only via Warpcast</p>
      </div>
    </div>
  )
}
