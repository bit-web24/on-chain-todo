use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    borsh::try_from_slice_unchecked,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    program_pack::IsInitialized,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

mod structs;
use structs::{Instruction, TodoItem, TodoList};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = Instruction::unpack(instruction_data)?;

    match instruction {
        Instruction::AddTodo { todo_item } => {
            let todo_account = &accounts[0];
            add_todo_item(program_id, accounts, todo_item)?;
        },
        Instruction::MarkCompleted { todo_item } => {
            mark_todo_item_completed(program_id, accounts, todo_item)?;
        },
        Instruction::DeleteTodo { todo_item } => {
            delete_todo_item(program_id, accounts, todo_item)?;
        }
    }

    Ok(())
}

fn add_todo_item(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    todo_item: TodoItem,
) -> ProgramResult {
    // Ensure that the accounts slice has the required accounts in the expected order
    if accounts.len() < 1 {
        return Err(ProgramError::NotEnoughAccountKeys);
    }

    // Get Account iterator
    let account_info_iter = &mut accounts.iter();

    // Get accounts
    let todo_creator = next_account_info(account_info_iter)?;

    // Check that the todo account belongs to the program
    if todo_creator.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Signer check
    if !todo_creator.is_signer {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature);
    }

    let pda_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let account_len: usize = (todo_item.title.len() + 4) + (todo_item.description.len() + 4) + 8;
    let rent = Rent::get()?;
    let rent_lamport = rent.minimum_balance(account_len);
    let (pda, bump_seed) = Pubkey::find_program_address(
        &[
            todo_creator.key.as_ref(),
            todo_item.id.to_string().as_bytes().as_ref(),
        ],
        program_id,
    );

    if pda != *pda_account.key {
        msg!("Invalid seeds for PDA");
        return Err(ProgramError::InvalidSeeds);
    }

    // create a data account
    let create_account_instruction = system_instruction::create_account(
        todo_creator.key,
        pda_account.key,
        rent_lamport,
        account_len.try_into().unwrap(),
        program_id,
    );
    // CPI using invoke_signed
    invoke_signed(
        // instruction
        &create_account_instruction,
        // account_infos
        &[
            todo_creator.clone(),
            pda_account.clone(),
            system_program.clone(),
        ],
        // signers_seeds
        &[&[
            todo_creator.key.as_ref(),
            todo_item.id.to_string().as_bytes().as_ref(),
            &[bump_seed],
        ]],
    )?;

    msg!("PDA created: {}", pda);

    // deserializing account data
    msg!("unpacking state account");
    let mut account_data =
        try_from_slice_unchecked::<TodoItem>(&pda_account.data.borrow()).unwrap();
    if account_data.is_initialized() {
        msg!("Account is not initialized");
        return Err(ProgramError::AccountAlreadyInitialized);
    }
    msg!("borrowed account data");
    account_data.id = todo_item.id;
    account_data.title = todo_item.title;
    account_data.description = todo_item.description;
    account_data.completed = false;

    // Serialize account data
    msg!("serializing account");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    msg!("state account serialized");

    Ok(())
}

fn mark_todo_item_completed(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    todo_item: TodoItem,
) -> ProgramResult {
    // Ensure that the accounts slice has the required accounts in the expected order
    if accounts.len() < 1 {
        return Err(ProgramError::NotEnoughAccountKeys);
    }

    let todo_account = &accounts[0];

    // Check that the todo account belongs to the program
    if todo_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    msg!("Marking todo as completed");

    // Get Account iterator
    let account_info_iter = &mut accounts.iter();

    // Get accounts
    let initializer = next_account_info(account_info_iter)?;
    if !initializer.is_signer {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature);
    }

    let pda_account = next_account_info(account_info_iter)?;

    // Derive PDA and check that it matches client
    let (pda, _bump_seed) = Pubkey::find_program_address(
        &[
            initializer.key.as_ref(),
            todo_item.id.to_string().as_bytes().as_ref(),
        ],
        program_id,
    );

    if pda != *pda_account.key {
        msg!("Invalid seeds for PDA");
        return Err(ProgramError::InvalidSeeds);
    }

    let mut account_data =
        try_from_slice_unchecked::<TodoItem>(&pda_account.data.borrow()).unwrap();
    if !account_data.is_initialized() {
        msg!("Account is not initialized");
        return Err(ProgramError::InvalidAccountData);
    }

    account_data.title = todo_item.title;
    account_data.description = todo_item.description;
    account_data.completed = true;

    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

    Ok(())
}

fn delete_todo_item(program_id: &Pubkey, accounts: &[AccountInfo], todo_item: TodoItem) -> ProgramResult {
   Ok(())
}
