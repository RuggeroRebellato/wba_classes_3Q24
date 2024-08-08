#![allow(unused)]

use anchor_lang::prelude::*;

declare_id!("BJWsC77kwuEX2rbeJ2VPgkr96u3mWSP32HqWxvS6bLNo");
mod contexts;
use contexts::*;
mod state;
use state::*;

#[program]
pub mod escrow {
    use super::*;

    pub fn make(ctx: Context<Make>, seed: u64, amount: u64, receive: u64) -> Result<()> {
        ctx.accounts.init_escrow(seed, receive, &ctx.bumps)?;
        ctx.accounts.deposit_to_vault(amount)?;
        Ok(())
    }
    pub fn take(ctx: Context<Take>) -> Result<()> {
        ctx.accounts.deposit()?;
        ctx.accounts.withdraw_and_close_vault()?;
        Ok(())
    }

    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        // ctx_accounts.withdraw_and_close()?;
        Ok(())
    }
}
