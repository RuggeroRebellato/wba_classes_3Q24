use anchor_lang::prelude::*;

#[account]
pub struct PontosGratis {
    pub authority: Pubkey,
    pub businesses_count: u64,
    pub users_count: u64,
}

#[account]
pub struct Business {
    pub authority: Pubkey,
    pub name: String,
    pub token_name: String,
    pub token_symbol: String,
    pub token_supply: u64,
}

#[account]
pub struct User {
    pub authority: Pubkey,
    pub name: String,
    pub pontos_balance: u64,
}

#[account]
pub struct TokenAccount {
    pub owner: Pubkey,
    pub business: Pubkey,
    pub balance: u64,
}
