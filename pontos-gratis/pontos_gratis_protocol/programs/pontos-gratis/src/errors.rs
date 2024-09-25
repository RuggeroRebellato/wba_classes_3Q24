use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient token balance")]
    InsufficientTokenBalance,
    #[msg("Invalid token amount")]
    InvalidTokenAmount,
    #[msg("Unauthorized operation")]
    Unauthorized,
}
