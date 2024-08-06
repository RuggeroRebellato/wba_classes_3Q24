import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wallet/wba-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);
(async () => {
  let tx = createNft(umi, {
    mint,
    payer: myKeypairSigner,
    symbol: "wbaLSDRUG",
    name: "WBA - LSD RUG!",
    uri: "https://arweave.net/Fmbt7r3FU6-iU94z05bApNX5XymIKGRJAUG0u9aIrFA",
    sellerFeeBasisPoints: percentAmount(1.0),
  });
  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://solscan.io/tx/${signature}?cluster=devnet`,
  );
  console.log("Mint Address: ", mint.publicKey);
  console.log(
    `Check your NFT here: https://explorer.solana.com/address/${mint.publicKey.toString()}?cluster=devnet`,
  );
})();
