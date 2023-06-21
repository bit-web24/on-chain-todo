use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, program_error::ProgramError,
    pubkey::Pubkey,
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

    let todo_account = &accounts[0];

    // Check that the todo account belongs to the program
    if todo_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize the account data into TodoList
    let mut todo_list = TodoList::try_from_slice(&todo_account.data.borrow())?;

    // Add the new todo item
    todo_list.items.push(todo_item);

    // Serialize the updated todo list back into the account data
    todo_list.serialize(&mut &mut todo_account.data.borrow_mut()[..])?;

    Ok(())
}

fn mark_todo_item_completed(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    todo_id: u32,
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

fn delete_todo_item(program_id: &Pubkey, accounts: &[AccountInfo], todo_id: u32) -> ProgramResult {
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
