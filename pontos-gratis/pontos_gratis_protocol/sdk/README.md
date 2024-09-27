# PontosGratis SDK

The PontosGratis SDK provides a simple interface to interact with the PontosGratis protocol on the Solana blockchain. This SDK is written in TypeScript and is designed to be used in Node.js environments.

## Installation

To install the SDK, you can use npm or yarn:

```bash
npm install @pontosgratis/sdk @coral-xyz/anchor @solana/web3.js
```

or

```bash
yarn add @pontosgratis/sdk @coral-xyz/anchor @solana/web3.js
```

## Usage

Here's a basic example of how to use the PontosGratis SDK in a TypeScript project.

### Importing Required Modules

```typescript
import { Connection, Keypair } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
import { PontosGratisSDK } from "@pontosgratis/sdk";
```

### Setting Up the Connection and Wallet

```typescript
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const wallet = new Wallet(Keypair.generate());
```

### Initializing the SDK

```typescript
const sdk = new PontosGratisSDK(connection, wallet);
```

### Using the SDK

Now you can use the SDK to interact with the PontosGratis protocol. Here's an example of initializing the program and creating a business:

```typescript
async function exampleUsage() {
  const pontosGratisKeypair = Keypair.generate();
  const businessKeypair = Keypair.generate();

  // Initialize the program
  const initTx = await sdk.initialize(pontosGratisKeypair);
  console.log("Initialization transaction:", initTx);

  // Create a business
  const createBusinessTx = await sdk.createBusiness(
    businessKeypair,
    "My Business",
    "Business Token",
    "BTK",
  );
  console.log("Create business transaction:", createBusinessTx);

  // Fetch and log the business account data
  const businessData = await sdk.fetchBusinessAccount(
    businessKeypair.publicKey,
  );
  console.log("Business account data:", businessData);
}

exampleUsage().catch(console.error);
```

## API Reference

### `PontosGratisSDK`

#### `constructor(connection: Connection, wallet: Wallet, opts?: ConfirmOptions)`

Creates a new instance of the PontosGratis SDK.

- `connection`: The Solana connection object.
- `wallet`: The wallet object.
- `opts`: (Optional) Confirmation options for transactions.

#### `initialize(pontosGratis: Keypair): Promise<string>`

Initializes the Pontos Gratis program.

- `pontosGratis`: The keypair for the PontosGratis account.
- Returns: The transaction signature.

#### `createBusiness(business: Keypair, name: string, tokenName: string, tokenSymbol: string): Promise<string>`

Creates a new business.

- `business`: The keypair for the new business account.
- `name`: The name of the business.
- `tokenName`: The name of the business's token.
- `tokenSymbol`: The symbol of the business's token.
- Returns: The transaction signature.

#### `createUser(user: Keypair, name: string): Promise<string>`

Creates a new user account.

- `user`: The keypair for the new user account.
- `name`: The name of the user.
- Returns: The transaction signature.

#### `createTokenAccount(tokenAccount: Keypair, business: PublicKey, user: PublicKey): Promise<string>`

Creates a token account for a user and business.

- `tokenAccount`: The keypair for the new token account.
- `business`: The public key of the business.
- `user`: The public key of the user.
- Returns: The transaction signature.

#### `issueTokens(business: PublicKey, tokenAccount: PublicKey, amount: number): Promise<string>`

Issues tokens to a user.

- `business`: The public key of the business issuing tokens.
- `tokenAccount`: The public key of the token account.
- `amount`: The amount of tokens to issue.
- Returns: The transaction signature.

#### `redeemTokens(tokenAccount: PublicKey, user: PublicKey, amount: number): Promise<string>`

Redeems tokens for a user.

- `tokenAccount`: The public key of the token account.
- `user`: The public key of the user redeeming tokens.
- `amount`: The amount of tokens to redeem.
- Returns: The transaction signature.

#### `fetchPontosGratisAccount(): Promise<any>`

Fetches the PontosGratis account data.

- Returns: The PontosGratis account data.

#### `fetchBusinessAccount(businessPubkey: PublicKey): Promise<any>`

Fetches a business account data.

- `businessPubkey`: The public key of the business account.
- Returns: The business account data.

#### `fetchUserAccount(userPubkey: PublicKey): Promise<any>`

Fetches a user account data.

- `userPubkey`: The public key of the user account.
- Returns: The user account data.

#### `fetchTokenAccount(tokenAccountPubkey: PublicKey): Promise<any>`

Fetches a token account data.

- `tokenAccountPubkey`: The public key of the token account.
- Returns: The token account data.

## Error Handling

All methods in the SDK include error handling. If an error occurs during execution, it will be logged to the console and then thrown. Make sure to implement proper error handling in your application when using this SDK.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
