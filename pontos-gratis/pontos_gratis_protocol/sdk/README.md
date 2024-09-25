# PontosGratis SDK

The PontosGratis SDK provides a simple interface to interact with the PontosGratis protocol on the Solana blockchain. This SDK is written in TypeScript and is designed to be used in Node.js environments.

## Installation

To install the SDK, you can use npm or yarn:

```bash
npm install @pontosgratis/sdk @coral-xyz/anchor @solana/web3.js
```

or

```bash
yarn add @pontosgratis/sdk @@pontosgratis/sdcoral-xyz/anchor @solana/web3.js
```

## Usage

Here's a basic example of how to use the PontosGratis SDK in a TypeScript project.

### Importing Required Modules

First, import the necessary modules from `@solana/web3.js` and `@coral-xyz/anchor`:

```typescript
import { Connection, Keypair } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
import { PontosGratisSDK } from "./pontosGratis";
```

### Setting Up the Connection and Wallet

Create a connection to the Solana cluster and set up the wallet:

```typescript
const connection = new Connection("http://localhost:8899", "confirmed");
const wallet = new Wallet(Keypair.generate());
```

### Initializing the SDK

Initialize the PontosGratis SDK with the connection and the wallet:

```typescript
const sdk = new PontosGratisSDK(connection, wallet);
```

### Using the SDK

Now you can use the SDK to interact with the PontosGratis protocol. For example, you can call methods on the `sdk` instance to perform various actions.

```typescript
async function exampleUsage() {
  // Example method call
  const result = await sdk.someMethod();
  console.log(result);
}

exampleUsage().catch(console.error);
```

## API Reference

### `PontosGratisSDK`

#### `constructor(connection: Connection, wallet: Wallet)`

Creates a new instance of the PontosGratis SDK.

- `connection`: The Solana connection object.
- `wallet`: The wallet object.

#### Example Method

```typescript
async someMethod(): Promise<SomeType> {
  // Implementation of the method
}
```

Replace `someMethod` and `SomeType` with actual methods and types provided by the SDK.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
