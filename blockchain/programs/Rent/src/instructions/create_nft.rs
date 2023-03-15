use crate::schema::*;
use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};
use crate::errors::ErrorCode;
use mpl_token_metadata::state::Metadata;

#[account]
pub struct NFT {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub image: String,
}

#[instruction]
pub fn create_nft(ctx: Context<CreateNFT>, name: String, description: String, image: String) -> ProgramResult {
    let nft = &mut ctx.accounts.nft;
    nft.owner = *ctx.accounts.owner.key;
    nft.name = name;
    nft.description = description;
    nft.image = image;
    Ok(())
}

#[state]
pub struct NFTProgram {
    pub nfts: Vec<Account<NFT>>,
}

#[entry]
pub fn create_nft_entry(ctx: Context<CreateNFT>) -> ProgramResult {
    create_nft(ctx, ctx.accounts.name.to_string(), ctx.accounts.description.to_string(), ctx.accounts.image.to_string())
}

#[derive(Accounts)]
pub struct OwnerAccounts<'info> {
    #[account(signer)]
    pub owner: Account<'info, Signer>,
}

#[derive(Context)]
pub struct CreateNFT<'info> {
    #[account(init, payer = owner, space = 8 + 64 + 64 + 64)]
    pub nft: Account<'info, NFT>,
    #[account(mut)]
    pub owner: Account<'info, Signer>,
}
