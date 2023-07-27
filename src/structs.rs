use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;

#[derive(Clone, Debug, BorshDeserialize, BorshSerialize)]
pub struct TodoItem {
    pub id: u8,
    pub title: String,
    pub description: String,
    pub completed: bool,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub enum Instruction {
    AddTodo {
        id: u8,
        title: String,
        description: String,
        completed: bool
    },
    MarkCompleted {
        id: u8
    },
    DeleteTodo {
        id: u8
    },
    UpdateTodo {
        id: u8,
        title: String,
        description: String,
        completed: bool
    },
}

impl Instruction {
    pub fn unpack(instruction_data: &[u8]) -> Result<Self, ProgramError> {
        let (&varient, rest) = instruction_data
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        let payload = TodoItem::try_from_slice(rest)?;

        Ok(match varient {
            0 => Self::AddTodo {
                id: payload.id,
                title: payload.title,
                description: payload.description,
                completed: payload.completed,
            },
            1 => Self::MarkCompleted {
                id: payload.id,
            },
            2 => Self::DeleteTodo {
                id: payload.id,
            },
            3 => Self::UpdateTodo {
                id: payload.id,
                title: payload.title,
                description: payload.description,
                completed: payload.completed,
            },
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
