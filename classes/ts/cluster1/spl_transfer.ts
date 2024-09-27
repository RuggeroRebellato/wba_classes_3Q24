import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import wallet from "./wallet/wba-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { tokenAmount } from "@metaplex-foundation/umi";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("Gk2Nf4wqcaP9K9pKPTXq9vuxzNP1KfiAE2MpJhX8Kbpd");

// Recipient address
const to = new PublicKey("7wxVFNuK35shzgrF1wjdrTmfkUd3SSkRCXrZqxYjQVDX");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to,
    );

    const amount = tokenAmount(10, undefined, 6);
    // Transfer the new token to the "toTokenAccount" we just created
    const signature = await transfer(
      connection,
      keypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      keypair.publicKey,
      amount.basisPoints
    );

    console.log("Transfer Signature:", signature);
    console.log(
      `Check your transaction on Solscan: https://solscan.io/tx/${signature}?cluster=devnet`,
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
