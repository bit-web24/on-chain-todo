import web3 from '@solana/web3.js';
import fs from 'fs';
import * as borsh from 'borsh';
import { TodoItem, TodoItemSchema } from "./models/todo_item";

// Connect to the local Solana cluster
const connection = new web3.Connection('http://localhost:8899', 'confirmed');

// Read the keypair file
const keypairFilePath = "/home/bittu/.config/solana/id.json";
const keypairData = fs.readFileSync(keypairFilePath);
const payerKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairData.toString('utf8'))));

// Specify the program ID of the Solana program
const programId = new web3.PublicKey(fs.readFileSync('../program_id'));

export async function addTodoItem(todoItem: TodoItem) {
  const transaction = new web3.Transaction();

  // Pack the instruction data
  const instructionIndexBuffer = Buffer.alloc(4);
  instructionIndexBuffer.writeInt32LE(0, 0); // Instruction index 0 for AddTodo

  // Serialize the todoItem object
  const todoItemBuffer = borsh.serialize(TodoItemSchema, todoItem);

  // Prepare the instruction data
  const instructionData = Buffer.concat([instructionIndexBuffer, todoItemBuffer]);

  // Calculate the PDA
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(todoItem.id.toString()), payerKeypair.publicKey.toBuffer()],
    programId
  );

  // Add the instruction to the transaction
  transaction.add(new web3.TransactionInstruction({
    keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: payerKeypair.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pda,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: web3.SystemProgram.programId,
      },
    ],
    programId: programId,
    data: instructionData,
  }));

  await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
}

export async function markCompleted(todoItem: TodoItem) {
  const transaction = new web3.Transaction();

  // Pack the instruction data
  const instructionIndexBuffer = Buffer.alloc(4);
  instructionIndexBuffer.writeInt32LE(1, 0); // Instruction index 1 for MarkCompleted

  // Serialize the todoItem object
  const todoItemBuffer = borsh.serialize(TodoItemSchema, todoItem);

  // Prepare the instruction data
  const instructionData = Buffer.concat([instructionIndexBuffer, todoItemBuffer]);

  // Calculate the PDA
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(todoItem.id.toString()), payerKeypair.publicKey.toBuffer()],
    programId
  );

  // Add the instruction to the transaction
  transaction.add(new web3.TransactionInstruction({
    keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: payerKeypair.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pda,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: web3.SystemProgram.programId,
      },
    ],
    programId: programId,
    data: instructionData,
  }));

  await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
}


export async function deleteTodoItem(todoItem: TodoItem) {
  const transaction = new web3.Transaction();

  // Pack the instruction data
  const instructionIndexBuffer = Buffer.alloc(4);
  instructionIndexBuffer.writeInt32LE(2, 0); // Instruction index 2 for DeleteTodo

  // Serialize the todoItem object
  const todoItemBuffer = borsh.serialize(TodoItemSchema, todoItem);

  // Prepare the instruction data
  const instructionData = Buffer.concat([instructionIndexBuffer, todoItemBuffer]);

  // Calculate the PDA
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(todoItem.id.toString()), payerKeypair.publicKey.toBuffer()],
    programId
  );

  // Add the instruction to the transaction
  transaction.add(new web3.TransactionInstruction({
    keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: payerKeypair.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pda,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: web3.SystemProgram.programId,
      },
    ],
    programId: programId,
    data: instructionData,
  }));

  await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
}

// function to update a todo item
export async function updateTodoItem(todoItem: TodoItem) {
  const transaction = new web3.Transaction();

  // Pack the instruction data
  const instructionIndexBuffer = Buffer.alloc(4);
  instructionIndexBuffer.writeInt32LE(3, 0); // Instruction index 3 for UpdateTodo

  // Serialize the todoItem object
  const todoItemBuffer = borsh.serialize(TodoItemSchema, todoItem);

  // Prepare the instruction data
  const instructionData = Buffer.concat([instructionIndexBuffer, todoItemBuffer]);

  // Calculate the PDA
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(todoItem.id.toString()), payerKeypair.publicKey.toBuffer()],
    programId
  );

  // Add the instruction to the transaction
  transaction.add(new web3.TransactionInstruction({
    keys: [
      {
        isSigner: true,
        isWritable: true,
        pubkey: payerKeypair.publicKey,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pda,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: web3.SystemProgram.programId,
      },
    ],
    programId: programId,
    data: instructionData,
  }));

  await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
}