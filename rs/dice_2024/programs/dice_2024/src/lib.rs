use anchor_lang::prelude::*;

declare_id!("9iRZMRn7NApnBHt898czPpUrBM1vSL6KddTSYM1JNheX");

mod instructions;
mod state;
use instructions::*;
use state::*;

#[program]
pub mod dice_2024 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        ctx.accounts.init(amount)?;
        Ok(())
    }
}
