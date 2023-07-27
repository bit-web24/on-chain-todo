import * as web3 from '@solana/web3.js';
import { Buffer } from 'buffer';
import { TodoItem, serialize_instruction_data } from './models/todo_item';
import * as fs from 'fs';
import * as bs58 from "bs58";

function readKeypair(keypairFilePath: string): web3.Keypair {
  const keypairData = fs.readFileSync(keypairFilePath, 'utf-8');
  return web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairData)));
}

async function getProgramId(): Promise<web3.PublicKey> {
  return new web3.PublicKey("HG7TGfAafFsPTA28aTnmDPcgtEd26Xotr9iFZmDLGoMz");
}

async function getBalance(pubkey: web3.PublicKey): Promise<number> {
  try {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    const balance = await connection.getBalance(readKeypair("/home/bittu/.config/solana/id.json").publicKey);
    return (balance / web3.LAMPORTS_PER_SOL);
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function addTodoItem(payerKey: web3.Keypair, programId: web3.PublicKey, todoItem: TodoItem): Promise<void> {
  try {
    const keypairFilePath = "/home/bittu/.config/solana/id.json";
    const payerKeypair = readKeypair(keypairFilePath);
    
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    const transaction = new web3.Transaction();

    // Serialize the todoItem object using updated TodoItemLayout
    const payload:TodoItem = {
      instruction: 0,
      id: todoItem.id,
      title: todoItem.title,
      description: todoItem.description,
      completed: todoItem.completed,
    };

    // Serialize the instruction data
    const buffer = serialize_instruction_data(payload);

    // Calculate the PDA
    const [pda, bump] = await web3.PublicKey.findProgramAddress(
      [Buffer.from(todoItem.id.toString()), payerKeypair.publicKey.toBuffer()],
      new web3.PublicKey("HG7TGfAafFsPTA28aTnmDPcgtEd26Xotr9iFZmDLGoMz")
    );

    // Add the instruction to the transaction
    transaction.add(new web3.TransactionInstruction({
      keys: [
        { isSigner: true, isWritable: true, pubkey: payerKeypair.publicKey },
        { isSigner: false, isWritable: true, pubkey: pda },
        { isSigner: false, isWritable: false, pubkey: web3.SystemProgram.programId },
      ],
      programId: new web3.PublicKey("HG7TGfAafFsPTA28aTnmDPcgtEd26Xotr9iFZmDLGoMz"),
      data: buffer,
    }));

    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
    console.log('Transaction confirmed:', signature);
  } catch (error) {
    console.error('Error adding Todo item:', error);
  }
}

async function markCompleted(payerKeypair: web3.Keypair, programId: web3.PublicKey, todoId: number) {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
  const transaction = new web3.Transaction();

    // Serialize the todoItem object using updated TodoItemLayout
    const payload:TodoItem = {
      instruction: 0,
      id: todoId,
      title: 'title',
      description: 'description',
      completed: false,
    };

    // Serialize the instruction data
    const buffer = serialize_instruction_data(payload);

  // Calculate the PDA
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(todoId.toString()), payerKeypair.publicKey.toBuffer()],
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
    data: buffer,
  }));

  await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
}

async function deleteTodoItem(payerKeypair: web3.Keypair, programId: web3.PublicKey, todoId: number): Promise<void> {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
  const transaction = new web3.Transaction();

    // Serialize the todoItem object using updated TodoItemLayout
    const payload:TodoItem = {
      instruction: 0,
      id: todoId,
      title: 'title',
      description: 'description',
      completed: false,
    };

    // Serialize the instruction data
    const buffer = serialize_instruction_data(payload);

  // Calculate the PDA
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(todoId.toString()), payerKeypair.publicKey.toBuffer()],
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
    data: buffer,
  }));

  await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
}

async function updateTodoItem(payerKeypair: web3.Keypair, programId: web3.PublicKey, todoItem: TodoItem): Promise<void> {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
  const transaction = new web3.Transaction();

    // Serialize the todoItem object using updated TodoItemLayout
    const payload:TodoItem = {
      instruction: 0,
      id: todoItem.id,
      title: todoItem.title,
      description: todoItem.description,
      completed: todoItem.completed,
    };

    // Serialize the instruction data
    const buffer = serialize_instruction_data(payload);

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
    data: buffer,
  }));

  await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
}

// The TodoItem interface or class needs to be defined here.

export {
  readKeypair,
  getProgramId,
  getBalance,
  addTodoItem,
  markCompleted,
  deleteTodoItem,
  updateTodoItem,
};
