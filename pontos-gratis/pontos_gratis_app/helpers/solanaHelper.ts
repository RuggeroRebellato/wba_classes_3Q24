import { Connection, Keypair, PublicKey, Commitment, Signer, ConfirmOptions, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, tokenMetadataInitialize } from "@solana/spl-token";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVNET_URL = 'https://api.devnet.solana.com';
const commitment: Commitment = "confirmed";
const connection = new Connection(DEVNET_URL, commitment);

export async function getOrCreateKeypair(): Promise<Keypair> {
  const storedKeypair = await AsyncStorage.getItem('userKeypair');
  if (storedKeypair) {
    return Keypair.fromSecretKey(new Uint8Array(JSON.parse(storedKeypair)));
  }

  const newKeypair = Keypair.generate();
  await AsyncStorage.setItem('userKeypair', JSON.stringify(Array.from(newKeypair.secretKey)));
  return newKeypair;
}

export async function requestAirdrop(publicKey: PublicKey): Promise<string> {
  const airdropSignature = await connection.requestAirdrop(publicKey, (LAMPORTS_PER_SOL * 1));


  return airdropSignature;
}

export async function createToken(
  payer: Keypair,
  decimals: number = 6,
  symbol: string,
  name: string,
  uri: string = ""
): Promise<PublicKey> {
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,
    payer.publicKey,
    decimals
  );

  // Initialize token metadata
  await tokenMetadataInitialize(
    connection,
    payer,
    mint,
    payer.publicKey,
    payer.publicKey,
    name,
    symbol,
    uri
  );

  // Store token metadata off-chain (optional, but can be useful)
  const tokenMetadata = {
    mint: mint.toBase58(),
    symbol,
    name,
    decimals,
    uri
  };

  await AsyncStorage.setItem(`tokenMetadata-${mint.toBase58()}`, JSON.stringify(tokenMetadata));

  return mint;
}

export async function mintTokens(
  mint: PublicKey,
  amount: bigint,
  destinationWallet: PublicKey,
  payer: Keypair
): Promise<string> {
  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    destinationWallet
  );

  const mintTx = await mintTo(
    connection,
    payer,
    mint,
    ata.address,
    payer.publicKey,
    amount
  );

  return mintTx;
}

export async function transferTokens(
  mint: PublicKey,
  amount: bigint,
  fromWallet: Keypair,
  toWallet: PublicKey
): Promise<string> {
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey
  );

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    toWallet
  );

  const signature = await transfer(
    connection,
    fromWallet,
    fromTokenAccount.address,
    toTokenAccount.address,
    fromWallet.publicKey,
    amount
  );

  return signature;
}
