import wallet from "./wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fetchMetadataFromSeeds,
  findMetadataPda,
  updateMetadataAccountV2,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import * as bs58 from "bs58";

const mint = publicKey("Gk2Nf4wqcaP9K9pKPTXq9vuxzNP1KfiAE2MpJhX8Kbpd");
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    const initialMetadata = await fetchMetadataFromSeeds(umi, { mint });
    const metadataPda = findMetadataPda(umi, { mint });
    const tx = await updateMetadataAccountV2(umi, {
      metadata: metadataPda,
      updateAuthority: signer,
      data: {
        ...initialMetadata,
        name: "WBA RR TOKEN",
        symbol: "wbaRR",
        uri: "https://example.com/metadata.json",
      },
    }).sendAndConfirm(umi);

    console.log(bs58.encode(tx.signature));
    console.log(`Metadata updated: ${tx.signature}`);
    console.log(
      `Link to https://solscan.io/tx/${bs58.encode(tx.signature)}?cluster=devnet`,
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
