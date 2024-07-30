import wallet from "./wallet/wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    createMetadataAccountV3,
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    findMetadataPda
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import * as bs58 from "bs58";

// Define our Mint address
const mint = publicKey("Gk2Nf4wqcaP9K9pKPTXq9vuxzNP1KfiAE2MpJhX8Kbpd")
// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        const metadataPda = findMetadataPda(umi, { mint });
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            metadata: metadataPda,
            mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: signer.publicKey,
        }
        let data: DataV2Args = {
            name: "Token Name",
            symbol: "TOKEN",
            uri: "https://arweave.net/123456",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null
        }
        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        }
        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )
        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

