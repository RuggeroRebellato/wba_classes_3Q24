import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PontosGratis } from "../target/types/pontos_gratis";
import { expect } from "chai";

module.exports = (program: Program<PontosGratis>) => {
  const provider = anchor.getProvider();

  describe("Business", () => {
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

    it("Creates a new business", async () => {
      const business = anchor.web3.Keypair.generate();
      const name = "Test Business";
      const tokenName = "Test Token";
      const tokenSymbol = "TST";

      await program.methods
        .createBusiness(name, tokenName, tokenSymbol)
        .accounts({
          pontosGratis: pontosGratis.publicKey,
          business: business.publicKey,
          authority: provider.publicKey,
        })
        .signers([business])
        .rpc();

      const businessAccount = await program.account.business.fetch(
        business.publicKey
      );
      expect(businessAccount.authority.toString()).to.equal(
        provider.publicKey.toString()
      );
      expect(businessAccount.name).to.equal(name);
      expect(businessAccount.tokenName).to.equal(tokenName);
      expect(businessAccount.tokenSymbol).to.equal(tokenSymbol);
      expect(businessAccount.tokenSupply.toNumber()).to.equal(0);

      const pontosGratisAccount = await program.account.pontosGratis.fetch(
        pontosGratis.publicKey
      );
      expect(pontosGratisAccount.businessesCount.toNumber()).to.equal(1);
    });
  });
};
