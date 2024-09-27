import wallet from "./wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";
import path from "path";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    const imagePath = path.join(__dirname, "nft_images", "rug_lsd_nft.jpg");
    const image = await readFile(imagePath);

    //
    //2. Convert image to generic file.
    const genericFile = createGenericFile(image, "rug_nft.jpg", {
      contentType: "image/jpeg",
      tags: [
        { name: "Content-Type", value: "image/jpeg" },
        { name: "Description", value: "LSD RUG NFT" },
      ],
    });
    //3. Upload image
    const myUri = await umi.uploader.upload([genericFile]);

    console.log("Your image URI: ", myUri[0]);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
