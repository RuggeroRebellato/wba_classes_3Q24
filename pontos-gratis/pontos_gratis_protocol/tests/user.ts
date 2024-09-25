import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PontosGratis } from "../target/types/pontos_gratis";
import { expect } from "chai";

module.exports = (program: Program<PontosGratis>) => {
  const provider = anchor.getProvider();

  describe("User", () => {
    let pontosGratis: anchor.web3.Keypair;

    before(async () => {
      pontosGratis = anchor.web3.Keypair.generate();
      await program.methods
        .initialize()
        .accounts({
          pontosGratis: pontosGratis.publicKey,
          authority: provider.publicKey,
        })
        .signers([pontosGratis])
        .rpc();
    });

    it("Creates a new user", async () => {
      const user = anchor.web3.Keypair.generate();
      const name = "Test User";

      await program.methods
        .createUser(name)
        .accounts({
          pontosGratis: pontosGratis.publicKey,
          user: user.publicKey,
          authority: provider.publicKey,
        })
        .signers([user])
        .rpc();

      const userAccount = await program.account.user.fetch(user.publicKey);
      expect(userAccount.authority.toString()).to.equal(
        provider.publicKey.toString()
      );
      expect(userAccount.name).to.equal(name);
      expect(userAccount.pontosBalance.toNumber()).to.equal(0);

      const pontosGratisAccount = await program.account.pontosGratis.fetch(
        pontosGratis.publicKey
      );
      expect(pontosGratisAccount.usersCount.toNumber()).to.equal(1);
    });
  });
};
