use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    borsh::try_from_slice_unchecked,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
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
            if todo_account.data_is_empty() {
                // Create a new todo account if it doesn't exist
                let todo_list = TodoList {
                    items: vec![todo_item],
                };
                todo_list.serialize(&mut &mut todo_account.data.borrow_mut()[..])?;
            } else {
                add_todo_item(program_id, accounts, todo_item)?;
            }
        }
        Instruction::MarkCompleted { todo_id } => {
            mark_todo_item_completed(program_id, accounts, todo_id)?;
        }
        Instruction::DeleteTodo { todo_id } => {
            delete_todo_item(program_id, accounts, todo_id)?;
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
    todo_id: u64,
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

    // Deserialize the account data into TodoList
    let mut todo_list = TodoList::try_from_slice(&todo_account.data.borrow())?;

    // Find the todo item with the specified ID
    let item_index = todo_list.items.iter().position(|item| item.id == todo_id);

    match item_index {
        Some(index) => {
            // Mark the todo item as completed
            todo_list.items[index].completed = true;

            // Serialize the updated todo list back into the account data
            todo_account.data.borrow_mut()[..].copy_from_slice(&todo_list.try_to_vec()?);
            Ok(())
        }
        None => {
            // Return an error if the specified todo item is not found
            Err(ProgramError::InvalidArgument)
        }
    }
}

fn delete_todo_item(program_id: &Pubkey, accounts: &[AccountInfo], todo_id: u64) -> ProgramResult {
    // Ensure that the accounts slice has the required accounts in the expected order
    if accounts.len() < 1 {
        return Err(ProgramError::NotEnoughAccountKeys);
    }

    let todo_account = &accounts[0];

    // Check that the todo account belongs to the program
    if todo_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize the account data into TodoList
    let mut todo_list = TodoList::try_from_slice(&todo_account.data.borrow())?;

    // Find the index of the todo item with the specified ID
    let item_index = todo_list.items.iter().position(|item| item.id == todo_id);

    match item_index {
        Some(index) => {
            // Remove the todo item from the list
            todo_list.items.remove(index);

            // Serialize the updated todo list back into the account data
            todo_account.data.borrow_mut()[..].copy_from_slice(&todo_list.try_to_vec()?);
            Ok(())
        }
        None => {
            // Return an error if the specified todo item is not found
            Err(ProgramError::InvalidArgument)
        }
    }
}
