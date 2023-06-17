use serde::{Deserialize, Serialize};
use solana_program::program_error::ProgramError;

#[derive(Clone, Deserialize, Serialize, Debug)]
pub struct TodoList {
    pub items: Vec<TodoItem>,
}

#[derive(Clone, Deserialize, Serialize, Debug)]
pub struct TodoItem {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub completed: bool,
}

#[derive(Serialize, Deserialize)]
pub enum Instruction {
    AddTodo { todo_item: TodoItem },
    MarkCompleted { todo_id: u32 },
}

pub fn parse_instruction(instruction_data: &[u8]) -> Result<Instruction, ProgramError> {
    let instruction_json = String::from_utf8(instruction_data.to_vec())
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    let instruction: Instruction = serde_json::from_str(&instruction_json)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    Ok(instruction)
}
