use anchor_lang::prelude::*;

declare_id!("Hw25VdJjpYKNVbB3KEchXL5NebR283fBGT9yCHaMqT8M");

mod instructions;
mod state;
use instructions::*;
mod errors;

#[program]
pub mod pontos_gratis {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::init(ctx)
    }

    pub fn create_business(
        ctx: Context<CreateBusiness>,
        name: String,
        token_name: String,
        token_symbol: String,
    ) -> Result<()> {
        instructions::create_business(ctx, name, token_name, token_symbol)
    }

    pub fn create_user(ctx: Context<CreateUser>, name: String) -> Result<()> {
        instructions::create_user(ctx, name)
    }

    pub fn create_token_account(ctx: Context<CreateTokenAccount>) -> Result<()> {
        instructions::create_token_account(ctx)
    }

    pub fn issue_tokens(ctx: Context<IssueTokens>, amount: u64) -> Result<()> {
        instructions::issue_tokens(ctx, amount)
    }

    pub fn redeem_tokens(ctx: Context<RedeemTokens>, amount: u64) -> Result<()> {
        instructions::redeem_tokens(ctx, amount)
    }
}
