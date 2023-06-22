use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;

#[derive(Clone, Debug, BorshDeserialize, BorshSerialize)]
pub struct TodoList {
    pub items: Vec<TodoItem>,
}

#[derive(Clone, Debug, BorshDeserialize, BorshSerialize)]
pub struct TodoItem {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub completed: bool,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub enum Instruction {
    AddTodo { todo_item: TodoItem },
    MarkCompleted { todo_item: TodoItem },
    DeleteTodo { todo_item: TodoItem },
}

impl Instruction {
    pub fn unpack(instruction_data: &[u8]) -> Result<Self, ProgramError> {
        let (&varient, rest) = instruction_data
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        let payload = TodoItem::try_from_slice(rest).unwrap();
        Ok(match varient {
            0 => Self::AddTodo { todo_item: payload },
            1 => Self::MarkCompleted { todo_item: payload },
            2 => Self::DeleteTodo { todo_item: payload },
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
