const web3 = require('@solana/web3.js');
const fs = require('fs');
const borsh = require('borsh');
const { TodoItemLayout } = require('./models/todo_item');

function readKeypair(keypairFilePath) {
  const keypairData = fs.readFileSync(keypairFilePath);
  return web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairData)));
}

async function getProgramId() {
  return new web3.PublicKey("HG7TGfAafFsPTA28aTnmDPcgtEd26Xotr9iFZmDLGoMz");
}

async function getBalance(pubkey) {
  try {
    const connection = new web3.Connection('http://localhost:8899', 'confirmed');
    const balance = await connection.getBalance(pubkey.publicKey);
    return (balance / web3.LAMPORTS_PER_SOL);
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function addTodoItem(payerKeypair, programId, todoItem) {
  try {
    const connection = new web3.Connection('http://localhost:8899', 'confirmed');
    const transaction = new web3.Transaction();

    // Serialize the todoItem object using updated TodoItemLayout
    const instructionData = Buffer.from(TodoItemLayout.encode(todoItem));

    // Calculate the PDA
    const [pda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(todoItem.id.toString()), payerKeypair.publicKey.toBuffer()],
      programId
    );

    // Add the instruction to the transaction
    transaction.add(new web3.TransactionInstruction({
      keys: [
        { isSigner: true, isWritable: true, pubkey: payerKeypair.publicKey },
        { isSigner: false, isWritable: true, pubkey: pda },
        { isSigner: false, isWritable: false, pubkey: web3.SystemProgram.programId },
      ],
      programId: programId,
      data: instructionData,
    }));

    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
    console.log('Transaction confirmed:', signature);
  } catch (error) {
    console.error('Error adding Todo item:', error);
  }
}

async function markCompleted(payerKeypair, programId, todoItem) {
  const connection = new web3.Connection('http://localhost:8899', 'confirmed');
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

async function deleteTodoItem(payerKeypair, programId, todoItem) {
  const connection = new web3.Connection('http://localhost:8899', 'confirmed');
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

async function updateTodoItem(payerKeypair, programId, todoItem) {
  const connection = new web3.Connection('http://localhost:8899', 'confirmed');
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

// async function getTodoItems(programId) {
//   try {
//     const connection = new web3.Connection('http://localhost:8899', 'confirmed');
//     const accounts = await connection.getProgramAccounts(programId);
//     const todos = accounts.map(({ account }) => {
//       return borsh.deserialize(TodoItemSchema, TodoItem, account.data);
//     });
//     return todos;
//   } catch (error) {
//     console.error('Error fetching todo items:', error);
//     return [];
//   }
// }

module.exports = {
  readKeypair,
  getProgramId,
  getBalance,
  addTodoItem,
  markCompleted,
  deleteTodoItem,
  updateTodoItem,
  getTodoItems
};
