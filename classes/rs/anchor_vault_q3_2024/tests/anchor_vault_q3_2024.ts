import * as anchor from "@coral-xyz/anchor";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { AnchorVaultQ32024 } from "../target/types/anchor_vault_q3_2024";

describe("anchor-vault-q3-2024", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorVaultQ32024 as anchor.Program<AnchorVaultQ32024>;
  const user = provider.wallet;

  let vaultState: PublicKey;
  let vault: PublicKey;

  before(async () => {
    [vaultState] = PublicKey.findProgramAddressSync(
      [Buffer.from("state"), user.publicKey.toBuffer()],
      program.programId
    );

    [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), vaultState.toBuffer()],
      program.programId
    );
  });

  it("Initializes the vault", async () => {
    await program.methods
      .initialize()
      .accounts({
        user: user.publicKey,
      })
      .rpc();

    const vaultStateAccount = await program.account.vaultState.fetch(
      vaultState
    );
    expect(vaultStateAccount.vaultBump).to.be.greaterThan(0);
    expect(vaultStateAccount.stateBump).to.be.greaterThan(0);
  });

  it("Deposits SOL into the vault", async () => {
    const depositAmount = new anchor.BN(LAMPORTS_PER_SOL); // 1 SOL
    const initialUserBalance = await provider.connection.getBalance(
      user.publicKey
    );
    const initialVaultBalance = await provider.connection.getBalance(vault);

    await program.methods
      .deposit(depositAmount)
      .accounts({
        user: user.publicKey,
      })
      .rpc();

    const finalUserBalance = await provider.connection.getBalance(
      user.publicKey
    );
    const finalVaultBalance = await provider.connection.getBalance(vault);

    expect(finalUserBalance).to.be.lessThan(initialUserBalance);
    expect(finalVaultBalance).to.equal(
      initialVaultBalance + depositAmount.toNumber()
    );
  });

  it("Withdraws SOL from the vault", async () => {
    const withdrawAmount = new anchor.BN(LAMPORTS_PER_SOL / 2); // 0.5 SOL
    const initialUserBalance = await provider.connection.getBalance(
      user.publicKey
    );
    const initialVaultBalance = await provider.connection.getBalance(vault);

    await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        user: user.publicKey,
      })
      .rpc();

    const finalUserBalance = await provider.connection.getBalance(
      user.publicKey
    );
    const finalVaultBalance = await provider.connection.getBalance(vault);

    expect(finalUserBalance).to.be.greaterThan(initialUserBalance);
    expect(finalVaultBalance).to.equal(
      initialVaultBalance - withdrawAmount.toNumber()
    );
  });

  it("Closes the vault", async () => {
    const initialUserBalance = await provider.connection.getBalance(
      user.publicKey
    );

    await program.methods
      .close()
      .accounts({
        user: user.publicKey,
      })
      .rpc();

    const finalUserBalance = await provider.connection.getBalance(
      user.publicKey
    );
    const finalVaultBalance = await provider.connection.getBalance(vault);

    expect(finalUserBalance).to.be.greaterThan(initialUserBalance);
    expect(finalVaultBalance).to.equal(0);

    const vaultStateInfo = await provider.connection.getAccountInfo(vaultState);
    expect(vaultStateInfo).to.be.null;
  });
});
