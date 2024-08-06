import wallet from "./wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  generateSigner,
  percentAmount,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";
import path from "path";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import base58 from "bs58";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));
umi.use(mplTokenMetadata());
const mint = generateSigner(umi);

(async () => {
  try {
    const imagePath = path.join(__dirname, "nft_images", "rug_lsd_nft.jpg");
    const image = await readFile(imagePath);
    const genericFile = createGenericFile(image, "rug_nft.jpg", {
      contentType: "image/jpeg",
      tags: [
        { name: "Content-Type", value: "image/jpeg" },
        { name: "Description", value: "LSD RUG NFT" },
      ],
    });
    const [myImageUri] = await umi.uploader.upload([genericFile]);
    console.log("Your image URI: ", myImageUri);
    const metadata = {
      name: "WBA - LSD RUG!",
      image: myImageUri,
      properties: {
        files: [
          {
            uri: myImageUri,
            type: "image/jpeg",
          },
        ],
      },
      creators: [
        {
          address: keypair.publicKey,
          share: 100,
        },
      ],
    };
    const myMetadataUri = await umi.uploader
      .uploadJson(metadata)
      .catch((err) => {
        throw new Error(err);
      });
    console.log("Your metadata URI:", myMetadataUri);
    let tx = createNft(umi, {
      mint,
      payer: signer,
      symbol: "wbaLSDRUG",
      name: "WBA - LSD RUG!",
      uri: myMetadataUri,
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
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
