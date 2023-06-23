import web3 from '@solana/web3.js';
const fs = require('fs');
const borsh = require('borsh');
import { TodoItem } from "./models/todo_item";

// Connect to the local Solana cluster
const connection = new web3.Connection('http://localhost:8899', 'confirmed');

// Read the keypair file
const keypairFilePath = "/home/bittu/.config/solana/id.json";
const keypairData = fs.readFileSync(keypairFilePath);
const payerKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairData)));

// Specify the program ID of the Solana program
const programId = new web3.PublicKey(fs.readFileSync('../program_id'));

export async function addTodoItem(todoItem: TodoItem) {
  const transaction = new web3.Transaction();

  // Pack the instruction data
  const instructionIndexBuffer = Buffer.alloc(4);
  instructionIndexBuffer.writeInt32LE(0, 0); // Instruction index 0 for AddTodo

  // creating buffer for todo id
  const idBuffer = Buffer.alloc(8);
  idBuffer.writeBigUInt64LE(BigInt(todoItem.id), 0);

  // creating buffer for title
  const titleBuffer = Buffer.from(todoItem.title, 'utf8');

  // creating buffer for description  
  const descriptionBuffer = Buffer.from(todoItem.description, 'utf8');

  // creating buffer for CompletedTodo
  const completedBuffer = Buffer.alloc(1);
  completedBuffer.writeUInt8(0, 0);

  const instructionData = Buffer.concat([instructionIndexBuffer, idBuffer, titleBuffer, descriptionBuffer, completedBuffer]);

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
  instructionIndexBuffer.writeInt32LE(1, 0); // Instruction index 0 for AddTodo

  // creating buffer for todo id
  const idBuffer = Buffer.alloc(8);
  idBuffer.writeBigUInt64LE(BigInt(todoItem.id), 0);

  // creating buffer for title
  const titleBuffer = Buffer.from(todoItem.title, 'utf8');

  // creating buffer for description  
  const descriptionBuffer = Buffer.from(todoItem.description, 'utf8');

  // creating buffer for CompletedTodo
  const completedBuffer = Buffer.alloc(1);
  completedBuffer.writeUInt8(todoItem.completed ? 1 : 0, 0);

  const instructionData = Buffer.concat([instructionIndexBuffer, idBuffer, titleBuffer, descriptionBuffer, completedBuffer]);

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
  instructionIndexBuffer.writeInt32LE(2, 0); // Instruction index 0 for DeleteTodo

  // creating buffer for todo id
  const idBuffer = Buffer.alloc(8);
  idBuffer.writeBigUInt64LE(BigInt(todoItem.id), 0);

  // creating buffer for title
  const titleBuffer = Buffer.from(todoItem.title, 'utf8');

  // creating buffer for description  
  const descriptionBuffer = Buffer.from(todoItem.description, 'utf8');

  // creating buffer for CompletedTodo
  const completedBuffer = Buffer.alloc(1);
  completedBuffer.writeUInt8(todoItem.completed ? 1 : 0, 0);

  const instructionData = Buffer.concat([instructionIndexBuffer, idBuffer, titleBuffer, descriptionBuffer, completedBuffer]);

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