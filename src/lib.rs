use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, program_error::ProgramError,
    pubkey::Pubkey,
};

mod structs;
use structs::{parse_instruction, Instruction, TodoItem, TodoList};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = parse_instruction(instruction_data)?;

    match instruction {
        Instruction::AddTodo { todo_item } => {
            add_todo_item(program_id, accounts, todo_item)?;
        }
        Instruction::MarkCompleted { todo_id } => {
            mark_todo_item_completed(program_id, accounts, todo_id)?;
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

    Ok(())
}

fn deleteTodo(program_id: &Pubkey, accounts: &[AccountInfo], todo_id: u32) -> ProgramResult {
    if accounts.len() < 1 {
        return Err(ProgramError::NotEnoughAccountKeys);
    }

    let todo_account = &accounts[0];

    // Check that the todo account belongs to the program
    if todo_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }
    Ok(())
}
