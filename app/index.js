const web3 = require('@solana/web3.js');
const fs = require('fs');
const borsh = require('borsh');
const { TodoItem, TodoList } = require('./models/todo');

// Connect to the local Solana cluster
const connection = new web3.Connection('http://localhost:8899', 'confirmed');

// Read the keypair file
const keypairFilePath = "/home/bittu/.config/solana/id.json";
const keypairData = fs.readFileSync(keypairFilePath);
const payerKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairData)));

// Specify the program ID of the Solana program
const programId = new web3.PublicKey(fs.readFileSync('../program_id'));

async function addTodoItem(TodoItem) {
  const transaction = new web3.Transaction();
  
  // transaction.add()

  await web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
}