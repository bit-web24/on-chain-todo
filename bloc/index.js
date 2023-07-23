const web3 = require('@solana/web3.js');
const fs = require('fs');
const borsh = require('borsh');
const { TodoItem, TodoItemSchema } = require('./models/todo_item');

async function connectToSolanaCluster(endpoint) {
  try {
    const connection = new web3.Connection(endpoint, 'confirmed');
    const version = await connection.getVersion();
    console.log('Connected to Solana cluster version:', version['solana-core']);
    return connection;
  } catch (error) {
    console.error('Error connecting to the Solana cluster:', error);
  }
}

async function readKeypair(keypairFilePath) {
  const keypairData = fs.readFileSync(keypairFilePath);
  return web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairData.toString('utf8'))));
}

async function readProgramId(programIdPath) {
  const programIdData = fs.readFileSync(programIdPath);
  return new web3.PublicKey(programIdData);
}

async function getBalance(connection, publicKey) {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / web3.LAMPORTS_PER_SOL;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function addTodoItem(connection, payerKeypair, programId, todoItem) {
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

async function markCompleted(connection, payerKeypair, programId, todoItem) {
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

async function deleteTodoItem(connection, payerKeypair, programId, todoItem) {
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

async function updateTodoItem(connection, payerKeypair, programId, todoItem) {
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

async function getTodoItems(connection, programId) {
  try {
    const accounts = await connection.getProgramAccounts(programId);
    const todos = accounts.map(({ account }) => {
      return borsh.deserialize(TodoItemSchema, TodoItem, account.data);
    });
    return todos;
  } catch (error) {
    console.error('Error fetching todo items:', error);
    return [];
  }
}

module.exports = {
  connectToSolanaCluster,
  readKeypair,
  readProgramId,
  getBalance,
  addTodoItem,
  markCompleted,
  deleteTodoItem,
  updateTodoItem,
  getTodoItems
};
