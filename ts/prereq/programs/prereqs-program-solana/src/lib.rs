use anchor_lang::prelude::*;

declare_id!("WBAQSygkwMox2VuWKU133NxFrpDZUBdvSBeaBEue2Jq");

const ACCOUNT_SIZE: usize = 8 + 32 + 4 + 39; // discriminator + pubkey + vec size + u8*38

#[program]
mod wba_prereq {
    use super::*;
    pub fn complete(ctx: Context<Complete>, github: Vec<u8>) -> Result<()> {
        ctx.accounts.prereq.key = *ctx.accounts.signer.key;
        require!(
            validate_github_username(&github),
            WbaPrereqError::InvalidGithubAccount
        );
        let mut username = [0u8; 39];
        let len = github.len().min(39); // Ensure we don't exceed array length
        username[0..len].copy_from_slice(&github[0..len]);
        ctx.accounts.prereq.github = username.to_vec();
        Ok(())
    }

    pub fn update(ctx: Context<Update>, github: Vec<u8>) -> Result<()> {
        require!(
            validate_github_username(&github),
            WbaPrereqError::InvalidGithubAccount
        );
        let mut username = [0u8; 39];
        let len = github.len().min(39); // Ensure we don't exceed array length
        username[0..len].copy_from_slice(&github[0..len]);
        ctx.accounts.prereq.github = username.to_vec();
        Ok(())
    }
    pub fn clean(ctx: Context<Close>) -> Result<()> {
        Ok(())
    }
}


fn validate_github_username(bytes: &[u8]) -> bool {
    // Make sure it doesn't start or end with 0x2d
    if bytes[0] == 0x2d || bytes[bytes.len() - 1] == 0x2d || bytes.len() > 39 {
        return false;
    }

    let mut has_zero = false;
    let mut has_hyphen = false;
    for b in bytes.iter() {
        match *b {
            // a..z, 0-9, A-Z
            97..=122 | 65..=90 | 48..=57 => {
                if has_zero {
                    return false;
                }
                has_hyphen = false;
            },
            45 => {
                if has_hyphen {
                    return false;
                }
                has_hyphen = true;
            }
            0 => {
                if !has_zero {
                    has_zero = true;
                }
            }
            _ => {
                return false;
            }
        }
    }
    true
}

#[derive(Accounts)]
#[instruction(github: Vec<u8>)]
pub struct Complete<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, payer = signer, seeds = [b"prereq", signer.key().as_ref()], bump, space = ACCOUNT_SIZE)]
    pub prereq: Account<'info, Q2Prereq2024>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(github: Vec<u8>)]
pub struct Update<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut, constraint = prereq.key == signer.key())]
    pub prereq: Account<'info, Q2Prereq2024>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut,close= signer)]
    pub prereq: Account<'info, Q2Prereq2024>,
}

#[account]
pub struct Q2Prereq2024 {
    github: Vec<u8>,
    key: Pubkey,
}

#[account]
pub struct Q3Prereq2024 {
    github: Vec<u8>,
    key: Pubkey,
}

#[account]
pub struct Q4Prereq2024 {
    github: Vec<u8>,
    key: Pubkey,
}

#[error_code]
pub enum WbaPrereqError {
    #[msg("Invalid Github account")]
    InvalidGithubAccount,
}