import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Escrow } from "../target/types/escrow";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { assert } from "chai";

describe("escrow", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Escrow as Program<Escrow>;

  const maker = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(
      JSON.parse(
        require("fs").readFileSync(
          require("os").homedir() + "/.config/solana/solix.json",
          "utf8"
        )
      )
    )
  );

  let mintA: PublicKey;
  let mintB: PublicKey;
  let makerAtaA: PublicKey;
  let escrow: PublicKey;
  let vault: PublicKey;
  const seed = new anchor.BN(1);
  const amount = new anchor.BN(100);
  const receive = new anchor.BN(50);

  before(async () => {
    // Create mints
    mintA = await createMint(
      program.provider.connection,
      maker,
      maker.publicKey,
      null,
      6
    );
    mintB = await createMint(
      program.provider.connection,
      maker,
      maker.publicKey,
      null,
      6
    );

    // Get or create maker's associated token account for mint A
    const makerAtaAAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      maker,
      mintA,
      maker.publicKey
    );
    makerAtaA = makerAtaAAccount.address;

    // Mint some tokens to maker's account
    await mintTo(
      program.provider.connection,
      maker,
      mintA,
      makerAtaA,
      maker.publicKey,
      100 ** 6
    );

    // Derive PDA for escrow account
    [escrow] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    // Derive PDA for vault account
    [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), escrow.toBuffer()],
      program.programId
    );
  });

  it("Create escrow", async () => {
    try {
      const tx = await program.methods
        .make(seed, amount, receive)
        .accounts({
          maker: maker.publicKey,
          mintA: mintA,
          mintB: mintB,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([maker])
        .rpc();

      console.log("Your transaction signature", tx);

      // Fetch the created escrow account
      const escrowAccount = await program.account.escrow.fetch(escrow);

      // Assert the escrow account data
      assert.ok(escrowAccount.maker.equals(maker.publicKey));
      assert.ok(escrowAccount.mintA.equals(mintA));
      assert.ok(escrowAccount.mintB.equals(mintB));
      assert.ok(escrowAccount.seed.eq(seed));
      assert.ok(escrowAccount.receive.eq(receive));

      // Check the balance of the vault
      const vaultBalance =
        await program.provider.connection.getTokenAccountBalance(vault);
      assert.ok(vaultBalance.value.amount === amount.toString());
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  });
});
