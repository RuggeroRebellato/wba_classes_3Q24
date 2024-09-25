use crate::errors::ErrorCode;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn init(ctx: Context<Initialize>) -> Result<()> {
    let pontos_gratis = &mut ctx.accounts.pontos_gratis;
    pontos_gratis.authority = ctx.accounts.authority.key();
    pontos_gratis.businesses_count = 0;
    pontos_gratis.users_count = 0;
    Ok(())
}

pub fn create_business(
    ctx: Context<CreateBusiness>,
    name: String,
    token_name: String,
    token_symbol: String,
) -> Result<()> {
    let business = &mut ctx.accounts.business;
    let pontos_gratis = &mut ctx.accounts.pontos_gratis;

    business.authority = ctx.accounts.authority.key();
    business.name = name;
    business.token_name = token_name;
    business.token_symbol = token_symbol;
    business.token_supply = 0;

    pontos_gratis.businesses_count += 1;

    Ok(())
}

pub fn create_user(ctx: Context<CreateUser>, name: String) -> Result<()> {
    let user = &mut ctx.accounts.user;
    let pontos_gratis = &mut ctx.accounts.pontos_gratis;

    user.authority = ctx.accounts.authority.key();
    user.name = name;
    user.pontos_balance = 0;

    pontos_gratis.users_count += 1;

    Ok(())
}

pub fn create_token_account(ctx: Context<CreateTokenAccount>) -> Result<()> {
    let token_account = &mut ctx.accounts.token_account;
    token_account.owner = ctx.accounts.user.key();
    token_account.business = ctx.accounts.business.key();
    token_account.balance = 0;
    Ok(())
}

pub fn issue_tokens(ctx: Context<IssueTokens>, amount: u64) -> Result<()> {
    let business = &mut ctx.accounts.business;
    let token_account = &mut ctx.accounts.token_account;

    business.token_supply += amount;
    token_account.balance += amount;

    Ok(())
}

pub fn redeem_tokens(ctx: Context<RedeemTokens>, amount: u64) -> Result<()> {
    let token_account = &mut ctx.accounts.token_account;
    let user = &mut ctx.accounts.user;

    if token_account.balance < amount {
        return Err(ErrorCode::InsufficientTokenBalance.into());
    }

    token_account.balance -= amount;
    user.pontos_balance += amount;

    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8)]
    pub pontos_gratis: Account<'info, PontosGratis>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateBusiness<'info> {
    #[account(mut)]
    pub pontos_gratis: Account<'info, PontosGratis>,
    #[account(init, payer = authority, space = 8 + 32 + 64 + 64 + 16 + 8)]
    pub business: Account<'info, Business>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub pontos_gratis: Account<'info, PontosGratis>,
    #[account(init, payer = authority, space = 8 + 32 + 64 + 8)]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateTokenAccount<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 32 + 8)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub business: Account<'info, Business>,
    #[account(mut)]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IssueTokens<'info> {
    #[account(mut, has_one = authority)]
    pub business: Account<'info, Business>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct RedeemTokens<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Account<'info, User>,
    pub authority: Signer<'info>,
}
