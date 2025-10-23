import { ethers } from "ethers"

// ------------------------
// 🔹 Extend Window type for MetaMask
// ------------------------
declare global {
  interface Window {
    ethereum?: any
  }
}

// ------------------------
// 🔹 Contract details
// ------------------------
export const CONTRACT_ADDRESS = "0xb513E1bfCD84DA7885d739ddd3eB16005AD85671"
export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "score", "type": "uint256" },
      { "indexed": false, "internalType": "uint8", "name": "difficulty", "type": "uint8" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "ScoreSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_score", "type": "uint256" },
      { "internalType": "uint8", "name": "_difficulty", "type": "uint8" },
      { "internalType": "string", "name": "_name", "type": "string" }
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint8", "name": "_difficulty", "type": "uint8" }],
    "name": "getTopScores",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "player", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "uint256", "name": "score", "type": "uint256" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct PumpkinLeaderboard.Entry[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// ------------------------
// 🔹 Connect wallet
// ------------------------
export async function connectWallet(): Promise<string> {
  if (!window.ethereum) throw new Error("MetaMask not installed")

  const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" })
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const network = await provider.getNetwork()

  console.log("🦊 Wallet connected:", accounts[0])
  console.log("Connected to chain:", network.chainId)
  return accounts[0]
}

// ------------------------
// 🔹 Provider & Contract helpers
// ------------------------
export function getProvider(): ethers.providers.Web3Provider {
  if (!window.ethereum) throw new Error("MetaMask not installed")
  return new ethers.providers.Web3Provider(window.ethereum)
}

export function getContract(signerOrProvider: ethers.Signer | ethers.providers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider)
}

// ------------------------
// 🔹 Submit Score with dynamic gas estimation
// ------------------------
export async function submitScore(score: number, difficulty: number, name: string) {
  if (!window.ethereum) throw new Error("Please install MetaMask")
  if (![0, 1, 2].includes(difficulty)) throw new Error("Invalid difficulty level")

  const provider = getProvider()
  const signer = provider.getSigner()
  const contract = getContract(signer)

  console.log("🚀 Starting score submission...")
  console.log("Player Name:", name)
  console.log("Score:", score)
  console.log("Difficulty:", difficulty)

  try {
    // Estimate gas
    const estimatedGas = await contract.estimateGas.submitScore(score, difficulty, name)
    const gasLimit = estimatedGas.mul(120).div(100) // +20% buffer
    console.log("Estimated Gas:", estimatedGas.toString())
    console.log("Gas Limit with buffer:", gasLimit.toString())

    // Submit transaction
    const tx = await contract.submitScore(score, difficulty, name, { gasLimit })
    console.log("Transaction sent:", tx.hash)

    const receipt = await tx.wait()
    console.log("✅ Score submitted!", receipt.transactionHash)
    return receipt
  } catch (err: any) {
    console.error("❌ Transaction failed:", err.reason || err.message)
    throw err
  }
}

// ------------------------
// 🔹 Fetch Leaderboard
// ------------------------
export async function fetchLeaderboard(difficulty: number) {
  try {
    const provider = getProvider()
    const contract = getContract(provider)
    const entries = await contract.getTopScores(difficulty)

    return entries.map((e: any) => ({
      player: e.player,
      name: e.name || "Anonymous",
      score: Number(e.score),
      difficulty,
      timestamp: new Date(Number(e.timestamp) * 1000)
    }))
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err)
    return []
  }
}
