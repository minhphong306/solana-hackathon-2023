use anchor_lang::prelude::*;

declare_id!("2QofFxHF1vPYKp6hUhi83iZpwLfXSKZsb1QKZwZoDSR8");

pub mod schema;
pub use schema::*;

pub mod instructions;
pub use instructions::*;

pub mod errors;


#[program]
pub mod rent {
    use super::*;
    pub fn create_nft_entry(ctx: Context<CreateNFT>) -> ProgramResult {
        create_nft(ctx, ctx.accounts.name.to_string(), ctx.accounts.description.to_string(), ctx.accounts.image.to_string())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
