/**
 * 🔗 Anchor Composable
 * 
 * Provides methods for interacting with the QWAMI token Anchor program.
 * Handles burning tokens for Energy, Connections, and Metamorphosis.
 */

import { Connection, PublicKey, Transaction, type Commitment } from '@solana/web3.js'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, createBurnInstruction } from '@solana/spl-token'
import { useWallet } from 'solana-wallets-vue'

export const useAnchor = () => {
  const config = useRuntimeConfig()
  const wallet = useWallet()

  /**
   * Get Solana connection
   */
  const getConnection = (): Connection => {
    const rpcEndpoint = config.public.solanaRpcEndpoint || 'https://api.devnet.solana.com'
    return new Connection(rpcEndpoint, 'confirmed' as Commitment)
  }

  /**
   * Get QWAMI token mint public key
   */
  const getQwamiMint = (): PublicKey | null => {
    const mintAddress = config.public.qwamiTokenMint
    
    if (!mintAddress || mintAddress === 'PLACEHOLDER_MINT_ADDRESS') {
      console.warn('⚠️ QWAMI token mint not configured')
      return null
    }

    try {
      return new PublicKey(mintAddress)
    } catch (err) {
      console.error('❌ Invalid QWAMI mint address:', err)
      return null
    }
  }

  /**
   * Get QWAMI program ID
   */
  const getProgramId = (): PublicKey | null => {
    const programId = config.public.qwamiTokenProgramId
    
    if (!programId || programId === 'PLACEHOLDER_PROGRAM_ID') {
      console.warn('⚠️ QWAMI program not configured')
      return null
    }

    try {
      return new PublicKey(programId)
    } catch (err) {
      console.error('❌ Invalid program ID:', err)
      return null
    }
  }

  /**
   * Burn QWAMI tokens for Energy
   * 
   * @param amount - Amount of QWAMI to burn
   * @param kwamiNftMint - Public key of the KWAMI NFT to credit Energy to
   * @returns Transaction signature
   */
  const burnForEnergy = async (amount: number, kwamiNftMint?: PublicKey): Promise<string> => {
    if (!wallet.connected.value || !wallet.publicKey.value) {
      throw new Error('Wallet not connected')
    }

    const qwamiMint = getQwamiMint()
    if (!qwamiMint) {
      throw new Error('QWAMI token mint not configured')
    }

    // TODO: When Anchor program is deployed, replace this with actual program call
    // For now, we'll simulate by burning tokens directly
    
    const connection = getConnection()
    const userTokenAccount = await getAssociatedTokenAddress(
      qwamiMint,
      wallet.publicKey.value
    )

    try {
      // Create burn instruction
      const burnInstruction = createBurnInstruction(
        userTokenAccount,
        qwamiMint,
        wallet.publicKey.value,
        amount,
        [],
        TOKEN_PROGRAM_ID
      )

      const transaction = new Transaction().add(burnInstruction)
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey.value

      // Sign and send transaction using solana-wallets-vue
      if (!wallet.signTransaction.value) {
        throw new Error('Wallet does not support transaction signing')
      }

      const signed = await wallet.signTransaction.value(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())
      
      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed')

      console.log('✅ Burned', amount, 'QWAMI for Energy:', signature)

      return signature
    } catch (err: any) {
      console.error('❌ Failed to burn for Energy:', err)
      throw err
    }
  }

  /**
   * Burn QWAMI tokens for Connections
   * 
   * @param amount - Amount of QWAMI to burn
   * @param kwamiNftMint - Public key of the KWAMI NFT to add connections to
   * @returns Transaction signature
   */
  const burnForConnections = async (amount: number, kwamiNftMint?: PublicKey): Promise<string> => {
    if (!wallet.connected.value || !wallet.publicKey.value) {
      throw new Error('Wallet not connected')
    }

    const qwamiMint = getQwamiMint()
    if (!qwamiMint) {
      throw new Error('QWAMI token mint not configured')
    }

    // TODO: When Anchor program is deployed, replace with actual program call
    const connection = getConnection()
    const userTokenAccount = await getAssociatedTokenAddress(
      qwamiMint,
      wallet.publicKey.value
    )

    try {
      const burnInstruction = createBurnInstruction(
        userTokenAccount,
        qwamiMint,
        wallet.publicKey.value,
        amount,
        [],
        TOKEN_PROGRAM_ID
      )

      const transaction = new Transaction().add(burnInstruction)
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey.value

      if (!wallet.signTransaction.value) {
        throw new Error('Wallet does not support transaction signing')
      }

      const signed = await wallet.signTransaction.value(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())
      await connection.confirmTransaction(signature, 'confirmed')

      console.log('✅ Burned', amount, 'QWAMI for Connections:', signature)

      return signature
    } catch (err: any) {
      console.error('❌ Failed to burn for Connections:', err)
      throw err
    }
  }

  /**
   * Burn QWAMI tokens for Metamorphosis
   * 
   * @param amount - Amount of QWAMI to burn
   * @param kwamiNftMint - Public key of the KWAMI NFT to add metamorphosis slot to
   * @returns Transaction signature
   */
  const burnForMetamorphosis = async (amount: number, kwamiNftMint?: PublicKey): Promise<string> => {
    if (!wallet.connected.value || !wallet.publicKey.value) {
      throw new Error('Wallet not connected')
    }

    const qwamiMint = getQwamiMint()
    if (!qwamiMint) {
      throw new Error('QWAMI token mint not configured')
    }

    // TODO: When Anchor program is deployed, replace with actual program call
    const connection = getConnection()
    const userTokenAccount = await getAssociatedTokenAddress(
      qwamiMint,
      wallet.publicKey.value
    )

    try {
      const burnInstruction = createBurnInstruction(
        userTokenAccount,
        qwamiMint,
        wallet.publicKey.value,
        amount,
        [],
        TOKEN_PROGRAM_ID
      )

      const transaction = new Transaction().add(burnInstruction)
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey.value

      if (!wallet.signTransaction.value) {
        throw new Error('Wallet does not support transaction signing')
      }

      const signed = await wallet.signTransaction.value(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())
      await connection.confirmTransaction(signature, 'confirmed')

      console.log('✅ Burned', amount, 'QWAMI for Metamorphosis:', signature)

      return signature
    } catch (err: any) {
      console.error('❌ Failed to burn for Metamorphosis:', err)
      throw err
    }
  }

  /**
   * Check if devnet simulation mode is enabled
   */
  const isSimulationMode = (): boolean => {
    return config.public.devnetSimulation === true || 
           config.public.devnetSimulation === 'true'
  }

  return {
    getConnection,
    getQwamiMint,
    getProgramId,
    burnForEnergy,
    burnForConnections,
    burnForMetamorphosis,
    isSimulationMode,
  }
}


