# Pontos.Gratis Project

## Turbin3 Capstone Project

Devnet Address: `Hw25VdJjpYKNVbB3KEchXL5NebR283fBGT9yCHaMqT8M`

## Project Overview

Pontos.Gratis is a comprehensive blockchain-based loyalty and rewards system, developed as a capstone project for the Turbin3 program. It demonstrates the application of blockchain technology in creating an efficient, transparent, and flexible loyalty solution.

## Project Structure

The project is divided into several key components:

```
.
├── pontos_gratis_app
├── pontosgratis_docs
├── pontos_gratis_landing_page
├── pontos_gratis_offchain
└── pontos_gratis_protocol
```

### pontos_gratis_app

Mobile application for users to interact with the Pontos.Gratis system.

### pontosgratis_docs

Comprehensive documentation covering various aspects of the project.

### pontos_gratis_landing_page

Web-based landing page for the Pontos.Gratis project.

### pontos_gratis_offchain

Off-chain components and backend services.

### pontos_gratis_protocol

Core blockchain protocol built on Solana.

## Features

- **Custom Token Creation**: Businesses can create branded loyalty tokens.
- **User Management**: Efficient creation and management of user accounts.
- **Token Issuance and Redemption**: Seamless process for token transactions.
- **Blockchain Transparency**: All transactions recorded on Solana for trust and verification.
- **Mobile App Interface**: User-friendly mobile application for easy interaction.
- **Comprehensive Documentation**: Detailed guides and explanations of system components.
- **Web Presence**: Informative landing page for project overview.
- **Off-chain Integration**: Backend services to complement blockchain operations.

## Technical Stack

- **Blockchain**: Solana
- **Smart Contract**: Rust with Anchor Framework
- **Mobile App**: React Native
- **Web Fullstack**: Remix (nodejs)
- **Backend**: Node.js (for off-chain components)
- **Documentation**: Hugo - Markdown/Static Site Generator

## Getting Started

### Prerequisites

- Rust and Cargo
- Solana CLI
- Anchor Framework
- Node.js and Yarn
- React Native environment (for mobile app)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/RuggeroRebellato/wba_classes_3Q24
   cd wba_classes_3Q24/pontos-gratis
   ```

2. Install dependencies for each component:

   ```
   cd pontos_gratis_protocol && yarn install
   cd ../pontos_gratis_app && yarn install
   cd ../pontos_gratis_landing_page && yarn install
   cd ../pontos_gratis_offchain && yarn install
   ```

3. Build the Solana program:
   ```
   cd pontos_gratis_protocol
   anchor build
   ```

### Running the Project

1. Start the Solana program (on devnet):

   ```
   cd pontos_gratis_protocol
   anchor deploy --provider.cluster devnet
   ```

2. Run the mobile app:

   ```
   cd pontos_gratis_app
   yarn expo start

   ```

3. Launch the landing page:

   ```
   cd pontos_gratis_landing_page
   yarn start
   ```

4. Start the off-chain services:
   ```
   cd pontos_gratis_offchain
   yarn start
   ```

## Testing

To run tests for the Solana program:

```
cd pontos_gratis_protocol
anchor test
```

For devnet testing:

```
anchor test --provider.cluster devnet
```

## Key Learnings

- Implementing a full-stack blockchain application
- Integrating on-chain and off-chain components
- Developing user-friendly interfaces for blockchain interactions
- Creating comprehensive documentation for a complex system

## Contributing

This project is part of the Turbin3 capstone program. While primarily for educational purposes, we welcome feedback and suggestions. Please open an issue to discuss potential changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Turbin3 program mentors and instructors
- Solana and Anchor documentation and community
- Fellow Turbin3 participants for their support and feedback

---

_Note: This project is a capstone demonstration and not intended for production use without further development and security audits._
