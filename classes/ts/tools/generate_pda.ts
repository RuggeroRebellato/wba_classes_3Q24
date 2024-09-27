import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("Gk2Nf4wqcaP9K9pKPTXq9vuxzNP1KfiAE2MpJhX8Kbpd");

let [pda, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault")],
  programId,
);
console.log(`bump: ${bump}, pubkey: ${pda.toBase58()}`);
