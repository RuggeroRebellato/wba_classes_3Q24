import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PontosGratis } from "../target/types/pontos_gratis";
import { expect } from "chai";

module.exports = (program: Program<PontosGratis>) => {
  const provider = anchor.getProvider();

  describe("Initialize", () => {
    it("Initializes the program state", async () => {
      const pontosGratis = anchor.web3.Keypair.generate();

      await program.methods
        .initialize()
        .accounts({
          pontosGratis: pontosGratis.publicKey,
        })
        .signers([pontosGratis])
        .rpc();

      const account = await program.account.pontosGratis.fetch(
        pontosGratis.publicKey
      );
      expect(account.authority.toString()).to.equal(
        provider.publicKey.toString()
      );
      expect(account.businessesCount.toNumber()).to.equal(0);
      expect(account.usersCount.toNumber()).to.equal(0);
    });
  });
};
