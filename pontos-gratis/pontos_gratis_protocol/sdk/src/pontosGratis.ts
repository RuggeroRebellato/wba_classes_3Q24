import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PontosGratis } from "./types/pontos_gratis";
import idl from "./types/idl_pontos_gratis.json";

export class PontosGratisSDK {
  private program: Program<PontosGratis>;
  private provider: anchor.AnchorProvider;

  constructor(
    connection: anchor.web3.Connection,
    wallet: anchor.Wallet,
    opts: anchor.web3.ConfirmOptions = anchor.AnchorProvider.defaultOptions()
  ) {
    this.provider = new anchor.AnchorProvider(connection, wallet, opts);
    this.program = new Program<PontosGratis>(
      idl as PontosGratis,
      this.provider
    );
  }

  /**
   * Initialize the Pontos Gratis program
   * @param pontosGratis The keypair for the PontosGratis account
   * @returns The transaction signature
   */
  async initialize(pontosGratis: anchor.web3.Keypair): Promise<string> {
    try {
      const tx = await this.program.methods
        .initialize()
        .accounts({
          pontosGratis: pontosGratis.publicKey,
          authority: this.program.provider.publicKey,
        })
        .signers([pontosGratis])
        .rpc();
      return tx;
    } catch (error) {
      console.error("Error in initialize:", error);
      throw error;
    }
  }

  /**
   * Create a new business
   * @param business The keypair for the new business account
   * @param name The name of the business
   * @param tokenName The name of the business's token
   * @param tokenSymbol The symbol of the business's token
   * @returns The transaction signature
   */
  async createBusiness(
    business: anchor.web3.Keypair,
    name: string,
    tokenName: string,
    tokenSymbol: string
  ): Promise<string> {
    try {
      const tx = await this.program.methods
        .createBusiness(name, tokenName, tokenSymbol)
        .accounts({
          pontosGratis: await this.getPontosGratisPDA(),
          business: business.publicKey,
          authority: this.program.provider.publicKey,
        })
        .signers([business])
        .rpc();
      return tx;
    } catch (error) {
      console.error("Error in createBusiness:", error);
      throw error;
    }
  }

  /**
   * Create a new user account
   * @param user The keypair for the new user account
   * @param name The name of the user
   * @returns The transaction signature
   */
  async createUser(user: anchor.web3.Keypair, name: string): Promise<string> {
    try {
      const tx = await this.program.methods
        .createUser(name)
        .accounts({
          pontosGratis: await this.getPontosGratisPDA(),
          user: user.publicKey,
          authority: this.program.provider.publicKey,
        })
        .signers([user])
        .rpc();
      return tx;
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  }

  /**
   * Create a token account for a user and business
   * @param tokenAccount The keypair for the new token account
   * @param business The public key of the business
   * @param user The public key of the user
   * @returns The transaction signature
   */
  async createTokenAccount(
    tokenAccount: anchor.web3.Keypair,
    business: anchor.web3.PublicKey,
    user: anchor.web3.PublicKey
  ): Promise<string> {
    try {
      const tx = await this.program.methods
        .createTokenAccount()
        .accounts({
          tokenAccount: tokenAccount.publicKey,
          business: business,
          user: user,
          authority: this.program.provider.publicKey,
        })
        .signers([tokenAccount])
        .rpc();
      return tx;
    } catch (error) {
      console.error("Error in createTokenAccount:", error);
      throw error;
    }
  }

  /**
   * Issue tokens to a user
   * @param business The public key of the business issuing tokens
   * @param tokenAccount The public key of the token account
   * @param amount The amount of tokens to issue
   * @returns The transaction signature
   */
  async issueTokens(
    business: anchor.web3.PublicKey,
    tokenAccount: anchor.web3.PublicKey,
    amount: number
  ): Promise<string> {
    try {
      const tx = await this.program.methods
        .issueTokens(new anchor.BN(amount))
        .accounts({
          business: business,
          tokenAccount: tokenAccount,
        })
        .rpc();
      return tx;
    } catch (error) {
      console.error("Error in issueTokens:", error);
      throw error;
    }
  }

  /**
   * Redeem tokens for a user
   * @param tokenAccount The public key of the token account
   * @param user The public key of the user redeeming tokens
   * @param amount The amount of tokens to redeem
   * @returns The transaction signature
   */
  async redeemTokens(
    tokenAccount: anchor.web3.PublicKey,
    user: anchor.web3.PublicKey,
    amount: number
  ): Promise<string> {
    try {
      const tx = await this.program.methods
        .redeemTokens(new anchor.BN(amount))
        .accounts({
          tokenAccount: tokenAccount,
          user: user,
          authority: this.program.provider.publicKey,
        })
        .rpc();
      return tx;
    } catch (error) {
      console.error("Error in redeemTokens:", error);
      throw error;
    }
  }

  /**
   * Fetch the PontosGratis account data
   * @returns The PontosGratis account data
   */
  async fetchPontosGratisAccount(): Promise<any> {
    try {
      const pontosGratisPDA = await this.getPontosGratisPDA();
      return await this.program.account.pontosGratis.fetch(pontosGratisPDA);
    } catch (error) {
      console.error("Error in fetchPontosGratisAccount:", error);
      throw error;
    }
  }

  /**
   * Fetch a business account data
   * @param businessPubkey The public key of the business account
   * @returns The business account data
   */
  async fetchBusinessAccount(
    businessPubkey: anchor.web3.PublicKey
  ): Promise<any> {
    try {
      return await this.program.account.business.fetch(businessPubkey);
    } catch (error) {
      console.error("Error in fetchBusinessAccount:", error);
      throw error;
    }
  }

  /**
   * Fetch a user account data
   * @param userPubkey The public key of the user account
   * @returns The user account data
   */
  async fetchUserAccount(userPubkey: anchor.web3.PublicKey): Promise<any> {
    try {
      return await this.program.account.user.fetch(userPubkey);
    } catch (error) {
      console.error("Error in fetchUserAccount:", error);
      throw error;
    }
  }

  /**
   * Fetch a token account data
   * @param tokenAccountPubkey The public key of the token account
   * @returns The token account data
   */
  async fetchTokenAccount(
    tokenAccountPubkey: anchor.web3.PublicKey
  ): Promise<any> {
    try {
      return await this.program.account.tokenAccount.fetch(tokenAccountPubkey);
    } catch (error) {
      console.error("Error in fetchTokenAccount:", error);
      throw error;
    }
  }

  /**
   * Get the PDA for the PontosGratis account
   * @returns The PDA for the PontosGratis account
   */
  private async getPontosGratisPDA(): Promise<anchor.web3.PublicKey> {
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pontos_gratis")],
      this.program.programId
    );
    return pda;
  }
}

export { PontosGratis } from "./types/pontos_gratis";
