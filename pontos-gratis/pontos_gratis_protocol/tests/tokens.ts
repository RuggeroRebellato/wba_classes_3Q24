import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PontosGratis } from "../target/types/pontos_gratis";
import { expect } from "chai";

module.exports = (program: Program<PontosGratis>) => {
  const provider = anchor.getProvider();

  describe("Tokens", () => {
    let pontosGratis: anchor.web3.Keypair;
    let business: anchor.web3.Keypair;
    let user: anchor.web3.Keypair;
    let tokenAccount: anchor.web3.Keypair;

    before(async () => {
      pontosGratis = anchor.web3.Keypair.generate();
      business = anchor.web3.Keypair.generate();
      user = anchor.web3.Keypair.generate();
      tokenAccount = anchor.web3.Keypair.generate();

      // Initialize program
      await program.methods
        .initialize()
        .accounts({
          pontosGratis: pontosGratis.publicKey,
          authority: provider.publicKey,
        })
        .signers([pontosGratis])
        .rpc();

      // Create business
      await program.methods
        .createBusiness("Test Business", "Test Token", "TST")
        .accounts({
          pontosGratis: pontosGratis.publicKey,
          business: business.publicKey,
          authority: provider.publicKey,
        })
        .signers([business])
        .rpc();

      // Create user
      await program.methods
        .createUser("Test User")
        .accounts({
          pontosGratis: pontosGratis.publicKey,
          user: user.publicKey,
          authority: provider.publicKey,
        })
        .signers([user])
        .rpc();

      // Create token account
      await program.methods
        .createTokenAccount()
        .accounts({
          tokenAccount: tokenAccount.publicKey,
          business: business.publicKey,
          user: user.publicKey,
          authority: provider.publicKey,
        })
        .signers([tokenAccount])
        .rpc();
    });

    it("Issues tokens to a user", async () => {
      const amount = new anchor.BN(100);

      await program.methods
        .issueTokens(amount)
        .accounts({
          business: business.publicKey,
          tokenAccount: tokenAccount.publicKey,
        })
        .rpc();

      const tokenAccountState = await program.account.tokenAccount.fetch(
        tokenAccount.publicKey
      );
      expect(tokenAccountState.balance.toNumber()).to.equal(100);

      const businessState = await program.account.business.fetch(
        business.publicKey
      );
      expect(businessState.tokenSupply.toNumber()).to.equal(100);
    });

    it("Redeems tokens for a user", async () => {
      const amount = new anchor.BN(50);

      await program.methods
        .redeemTokens(amount)
        .accounts({
          tokenAccount: tokenAccount.publicKey,
          user: user.publicKey,
          authority: provider.publicKey,
        })
        .rpc();

      const tokenAccountState = await program.account.tokenAccount.fetch(
        tokenAccount.publicKey
      );
      expect(tokenAccountState.balance.toNumber()).to.equal(50);

      const userState = await program.account.user.fetch(user.publicKey);
      expect(userState.pontosBalance.toNumber()).to.equal(50);
    });

    it("Fails to redeem more tokens than available", async () => {
      const amount = new anchor.BN(100);

      try {
        await program.methods
          .redeemTokens(amount)
          .accounts({
            tokenAccount: tokenAccount.publicKey,
            user: user.publicKey,
            authority: provider.publicKey,
          })
          .rpc();
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).to.include("Insufficient token balance");
      }
    });
  });
};
