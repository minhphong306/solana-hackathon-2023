use solana_program::{
    account_info::next_account_info, account_info::AccountInfo, entrypoint, entrypoint::ProgramResult,
    program_error::ProgramError, pubkey::Pubkey,
};
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    program_pack::Pack,
    signature::{Keypair, Signer},
    system_instruction,
};
use spl_token::{
    instruction::{initialize_account, initialize_mint, mint_to},
    state::{Account, Mint},
    token_amount_to_ui_amount, ui_amount_to_token_amount, Decimals, TokenAmount,
};

// Define the program ID of the NFT program
const PROGRAM_ID: [u8; 32] = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f];

// Define the decimals of the NFT
const DECIMALS: u8 = 0;

// Define the number of tokens to mint
const TOKENS_TO_MINT: u64 = 100;

// Define the program entrypoint
entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Get the account information for the mint account
    let accounts_iter = &mut accounts.iter();
    let mint_info = next_account_info(accounts_iter)?;

    // Get the account information for the account to mint tokens to
    let recipient_info = next_account_info(accounts_iter)?;

    // Get the account information for the token account
    let token_account_info = next_account_info(accounts_iter)?;

    // Check if the mint account has already been initialized
    if !mint_info.data_is_empty() {
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    // Initialize the mint account
    let decimals = Decimals::from(DECIMALS);
    initialize_mint(
        program_id,
        mint_info,
        &Keypair::new(),
        Some(&recipient_info.key()),
        decimals,
    )?;

    // Mint tokens to the recipient's account
    let token_amount = ui_amount_to_token_amount(TOKENS_TO_MINT, decimals);
    mint_to(program_id, mint_info, recipient_info, token_amount)?;

    // Initialize the token account
    let token_account = Account::unpack(&token_account_info.data.borrow())?;
    if token_account.is_initialized() {
        return Err(ProgramError::AccountAlreadyInitialized);
    }
    initialize_account(program_id, token_account_info)?;

    Ok(())
}
