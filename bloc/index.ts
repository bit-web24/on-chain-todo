import web3 from '@solana/web3.js';
import fs from 'fs';
import * as borsh from 'borsh';
import { TodoItem, TodoItemSchema } from "./models/todo_item";

export async function connectToSolanaCluster(endpoint: string) {
  try {
    const connection = new web3.Connection(endpoint, 'confirmed');
    const version = await connection.getVersion();
    console.log('Connected to Solana cluster version:', version['solana-core']);
    return connection;
  } catch (error) {
    console.error('Error connecting to the Solana cluster:', error);
  }
}

export async function readKeypair(keypairFilePath: string) {
  const keypairData = fs.readFileSync(keypairFilePath);
  return web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairData.toString('utf8'))));
}

export async function readProgramId(programIdPath: string) {
  const programIdData = fs.readFileSync(programIdPath);
  return new web3.PublicKey(programIdData);
}

export async function getBalance(connection: web3.Connection, publicKey: web3.PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / web3.LAMPORTS_PER_SOL;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function addTodoItem(connection: web3.Connection, payerKeypair: web3.Keypair, programId: web3.PublicKey, todoItem: TodoItem) {
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

export async function markCompleted(connection: web3.Connection, payerKeypair: web3.Keypair, programId: web3.PublicKey, todoItem: TodoItem) {
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

export async function deleteTodoItem(connection: web3.Connection, payerKeypair: web3.Keypair, programId: web3.PublicKey, todoItem: TodoItem) {
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

export async function updateTodoItem(connection: web3.Connection, payerKeypair: web3.Keypair, programId: web3.PublicKey, todoItem: TodoItem) {
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

export async function getTodoItems(connection:web3.Connection, programId: web3.PublicKey) {
    connection.getProgramAccounts(programId).then(async (accounts) => {
			const todos: TodoItem[] = accounts.map(({ account }) => {
				return borsh.deserialize(TodoItemSchema, TodoItem, account.data)
			})
      return todos;
    })
}