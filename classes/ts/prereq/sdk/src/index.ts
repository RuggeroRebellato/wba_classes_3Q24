import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import { WbaPrereq } from "./types/wba_prereq";
import IDL from "./types/wba_prereq.json";
import devWallet from "../solix.json";

const myKeypair = Keypair.fromSecretKey(new Uint8Array(devWallet));

// Create a Wallet instance
const myWallet = new Wallet(myKeypair);

const connection = new Connection("https://api.devnet.solana.com");

async function execute_complete(githubUsername: string) {
  const provider = new AnchorProvider(
    connection,
    myWallet,
    AnchorProvider.defaultOptions()
  );

  const program = new Program<WbaPrereq>(IDL as WbaPrereq, provider);

  const githubBytes = Buffer.from(githubUsername, "utf-8");

  try {
    const tx = await program.methods
      .complete(githubBytes)
      .accounts({
        signer: myWallet.publicKey,
      })
      .signers([myKeypair])
      .rpc();
    console.log("Transaction signature", tx);
  } catch (error) {
    console.error("Error executing 'complete':", error);
  }
}

async function main() {
  await execute_complete("RuggeroRebellato");
}

main()
  .then(() => console.log("Finished"))
  .catch(console.error);
