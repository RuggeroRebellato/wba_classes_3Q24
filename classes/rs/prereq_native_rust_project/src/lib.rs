mod programs;

#[cfg(test)]
mod tests {

    use crate::programs::wba_prereq::{CompleteArgs, WbaPrereqProgram};
    use solana_client::rpc_client::RpcClient;
    use solana_sdk::{
        message::Message,
        pubkey::Pubkey,
        signature::{read_keypair_file, write_keypair_file, Keypair, Signer},
        system_instruction, system_program,
        transaction::Transaction,
    };
    use std::str::FromStr;

    const RPC_URL: &str = "https://api.devnet.solana.com";

    #[test]
    fn keygen() {
        // Create a new keypair
        let kp = Keypair::new();
        println!("You've generated a new Solana wallet: {}", kp.pubkey());

        println!("To save your wallet, copy and paste the following into a JSON file:");
        println!("{:?}", kp.to_bytes());
        match write_keypair_file(&kp, "dev-wallet.json") {
            Ok(_) => println!("Your wallet has been saved to dev-wallet.json"),
            Err(e) => println!(
                "Oops, something went wrong while saving wallet to file: {}",
                e
            ),
        }
    }

    #[test]
    fn airdrop() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

        let client = RpcClient::new(RPC_URL);

        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(sig) => {
                println!("Success! Check out your TX here:");
                println!("https://explorer.solana.com/tx/{}?cluster=devnet", sig);
            }
            Err(e) => println!("Oops, something went wrong: {}", e),
        };
    }

    #[test]
    fn transfer_sol() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        let to_pubkey = Pubkey::from_str("soLix1hcSFSrn3PqgZ5vksLUHje7iN6Eqqs2aQzx4yi").unwrap();
        let rpc_client = RpcClient::new(RPC_URL);

        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let message = solana_sdk::message::Message::new_with_blockhash(
            &[system_instruction::transfer(
                &keypair.pubkey(),
                &to_pubkey,
                1_000_000_000,
            )],
            Some(&keypair.pubkey()),
            &recent_blockhash,
        );

        let fee = rpc_client
            .get_fee_for_message(&message)
            .expect("Failed to get fee calculator");

        let amount_to_transfer = 1_000_000_000 - fee;

        let transaction = Transaction::new_signed_with_payer(
            &[system_instruction::transfer(
                &keypair.pubkey(),
                &to_pubkey,
                amount_to_transfer,
            )],
            Some(&keypair.pubkey()),
            &[&keypair],
            recent_blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: 
            https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }

    #[test]
    fn empty_wallet() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

        let to_pubkey = Pubkey::from_str("soLix1hcSFSrn3PqgZ5vksLUHje7iN6Eqqs2aQzx4yi").unwrap();

        let rpc_client = RpcClient::new(RPC_URL);

        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let balance = rpc_client
            .get_balance(&keypair.pubkey())
            .expect("Failed to get balance");

        dbg!(balance);
        println!("{}", &keypair.pubkey());
        if balance == 0 {
            println!("Wallet is already empty!");
            return;
        }

        let message = Message::new_with_blockhash(
            &[system_instruction::transfer(
                &keypair.pubkey(),
                &to_pubkey,
                balance,
            )],
            Some(&keypair.pubkey()),
            &recent_blockhash,
        );

        let fee = rpc_client
            .get_fee_for_message(&message)
            .expect("Failed to get fee calculator");

        let amount_to_transfer = balance.saturating_sub(fee);

        if amount_to_transfer == 0 {
            println!("Not enough balance to pay for transaction fee!");
            return;
        }

        let transaction = Transaction::new_signed_with_payer(
            &[system_instruction::transfer(
                &keypair.pubkey(),
                &to_pubkey,
                amount_to_transfer,
            )],
            Some(&keypair.pubkey()),
            &[&keypair],
            recent_blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );

        let new_balance = rpc_client
            .get_balance(&keypair.pubkey())
            .expect("Failed to get balance");

        assert_eq!(new_balance, 0, "Wallet not completely emptied!");
        println!(
            "Wallet emptied successfully. New balance: {} lamports",
            new_balance
        );
    }

    #[test]
    fn submit_completion() {
        let rpc_client = RpcClient::new(RPC_URL);

        let signer = read_keypair_file("wba-wallet.json").expect("Couldn't find wallet file");

        let prereq = WbaPrereqProgram::derive_program_address(&[
            b"prereq",
            signer.pubkey().to_bytes().as_ref(),
        ]);

        let args = CompleteArgs {
            github: b"RuggeroRebellato".to_vec(),
        };

        let blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let transaction = WbaPrereqProgram::complete(
            &[&signer.pubkey(), &prereq, &system_program::id()],
            &args,
            Some(&signer.pubkey()),
            &[&signer],
            blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }
}
