const web3 = require('@solana/web3.js');
const fs = require('fs');
const borsh = require('borsh');

// Connect to the local Solana cluster
const connection = new web3.Connection('http://localhost:8899', 'confirmed');

// Initialize the connection to the Solana network
//const connection = new web3.Connection(web3.clusterApiUrl('localnet'));
console.log(connection);

// Read the keypair file
const keypairFilePath = "/home/bittu/.config/solana/id.json";
const keypairData = fs.readFileSync(keypairFilePath);
const payerKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairData)));

// Get the public key
const publicKey = payerKeypair.publicKey.toBase58();
//console.log(publicKey);

// Specify the public key and private key for the client's wallet
const walletPublicKey = payerKeypair;
//const walletPrivateKey = web3.Buffer.from(keypairData, 'hex');

// Specify the program ID of the Solana program
const programId = new web3.PublicKey('23KFA4GFqANfLzENUczfQueg8843zk6RuvjRuYQkaX1a');

// Define the TodoItem struct
class TodoItem {
  constructor(id, completed) {
    this.id = id;
    this.completed = completed;
  }
}

// Define the TodoList struct
class TodoList {
  constructor(items) {
    this.items = items;
  }
}

// Define the schema for the TodoItem and TodoList structs
const schema = new Map([
  [TodoItem, { kind: 'struct', fields: [['id', 'u32'], ['completed', 'u8']] }],
  [TodoList, { kind: 'struct', fields: [['items', [TodoItem]]] }],
]);

async function addTodoItem(todoItem) {
  // Retrieve the associated account for the todo list
  const todoAccount = await web3.PublicKey.createWithSeed(
    walletPublicKey,
    'todo-list',
    programId
  );

  // Check if the todo account already exists
  const todoAccountInfo = await connection.getAccountInfo(todoAccount);
  if (!todoAccountInfo) {
    // Create a new todo account if it doesn't exist
    const todoList = new TodoList([todoItem]);
    const todoListData = borsh.serialize(schema, todoList);
    const lamports = await connection.getMinimumBalanceForRentExemption(todoListData.length);
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.createAccountWithSeed({
        fromPubkey: walletPublicKey,
        basePubkey: walletPublicKey,
        seed: 'todo-list',
        newAccountPubkey: todoAccount,
        lamports,
        space: todoListData.length,
        programId,
      })
    ).add(
      web3.SPLToken.createInitAccountInstruction(
        web3.SYSVAR_RENT_PUBKEY,
        web3.TokenInstructions.TOKEN_PROGRAM_ID,
        todoAccount,
        web3.SPLToken.TOKEN_PROGRAM_ID,
        walletPublicKey
      )
    ).add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: todoAccount,
        lamports,
      })
    ).add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: walletPublicKey,
        lamports: -lamports,
      })
    ).add(
      web3.SPLToken.createTransferCheckedInstruction(
        web3.SPLToken.TOKEN_PROGRAM_ID,
        todoAccount,
        web3.SPLToken.TOKEN_PROGRAM_ID,
        walletPublicKey,
        [],
        lamports,
        0
      )
    ).add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: todoAccount,
        lamports,
      })
    );

    await web3.sendAndConfirmTransaction(connection, transaction, [walletPrivateKey], {
      commitment: 'single',
    });
  } else {
    // Add the todo item to an existing todo account
    const todoListData = await connection.getAccountInfo(todoAccount, 'single');
    const todoList = borsh.deserialize(schema, TodoList, todoListData.data);
    todoList.items.push(todoItem);
    const updatedTodoListData = borsh.serialize(schema, todoList);

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: todoAccount,
        lamports: 0,
      })
    ).add(
      web3.SPLToken.transfer({
        source: todoAccount,
        destination: todoAccount,
        amount: 0,
        authority: walletPublicKey,
      })
    ).add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: walletPublicKey,
        lamports: 0,
      })
    ).add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: todoAccount,
        lamports: 0,
      })
    ).add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: todoAccount,
        lamports: 0,
      })
    ).add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: todoAccount,
        lamports: 0,
      })
    ).add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: todoAccount,
        lamports: 0,
      })
    ).add(
      web3.SPLToken.transfer({
        source: todoAccount,
        destination: todoAccount,
        amount: 0,
        authority: walletPublicKey,
      })
    ).add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: walletPublicKey,
        lamports: 0,
      })
    ).add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: todoAccount,
        lamports: 0,
      })
    );

    await web3.sendAndConfirmTransaction(connection, transaction, [walletPrivateKey], {
      commitment: 'single',
    });
  }
}

async function markTodoItemCompleted(todoId) {
  // Retrieve the associated account for the todo list
  const todoAccount = await web3.PublicKey.createWithSeed(
    walletPublicKey,
    'todo-list',
    programId
  );

  // Check if the todo account exists
  const todoAccountInfo = await connection.getAccountInfo(todoAccount);
  if (!todoAccountInfo) {
    throw new Error('Todo account not found');
  }

  // Retrieve the todo list data
  const todoListData = await connection.getAccountInfo(todoAccount, 'single');
  const todoList = borsh.deserialize(schema, TodoList, todoListData.data);

  // Find the todo item with the specified ID
  const itemIndex = todoList.items.findIndex((item) => item.id === todoId);
  if (itemIndex === -1) {
    throw new Error('Todo item not found');
  }

  // Mark the todo item as completed
  todoList.items[itemIndex].completed = 1;

  // Serialize the updated todo list
  const updatedTodoListData = borsh.serialize(schema, todoList);

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  ).add(
    web3.SPLToken.transfer({
      source: todoAccount,
      destination: todoAccount,
      amount: 0,
      authority: walletPublicKey,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: walletPublicKey,
      lamports: 0,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  ).add(
    web3.SPLToken.transfer({
      source: todoAccount,
      destination: todoAccount,
      amount: 0,
      authority: walletPublicKey,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: walletPublicKey,
      lamports: 0,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  );

  await web3.sendAndConfirmTransaction(connection, transaction, [walletPrivateKey], {
    commitment: 'single',
  });
}

async function deleteTodoItem(todoId) {
  // Retrieve the associated account for the todo list
  const todoAccount = await web3.PublicKey.createWithSeed(
    walletPublicKey,
    'todo-list',
    programId
  );

  // Check if the todo account exists
  const todoAccountInfo = await connection.getAccountInfo(todoAccount);
  if (!todoAccountInfo) {
    throw new Error('Todo account not found');
  }

  // Retrieve the todo list data
  const todoListData = await connection.getAccountInfo(todoAccount, 'single');
  const todoList = borsh.deserialize(schema, TodoList, todoListData.data);

  // Find the todo item with the specified ID
  const itemIndex = todoList.items.findIndex((item) => item.id === todoId);
  if (itemIndex === -1) {
    throw new Error('Todo item not found');
  }

  // Remove the todo item from the list
  todoList.items.splice(itemIndex, 1);

  // Serialize the updated todo list
  const updatedTodoListData = borsh.serialize(schema, todoList);

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  ).add(
    web3.SPLToken.transfer({
      source: todoAccount,
      destination: todoAccount,
      amount: 0,
      authority: walletPublicKey,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: walletPublicKey,
      lamports: 0,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  ).add(
    web3.SPLToken.transfer({
      source: todoAccount,
      destination: todoAccount,
      amount: 0,
      authority: walletPublicKey,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: walletPublicKey,
      lamports: 0,
    })
  ).add(
    web3.SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: todoAccount,
      lamports: 0,
    })
  );

  await web3.sendAndConfirmTransaction(connection, transaction, [walletPrivateKey], {
    commitment: 'single',
  });
}

// Usage example
const todoItem = new TodoItem(1, 0);
addTodoItem(todoItem)
  .then(() => console.log('Todo item added'))
  .catch((error) => console.error('Failed to add todo item:', error));

markTodoItemCompleted(1)
  .then(() => console.log('Todo item marked as completed'))
  .catch((error) => console.error('Failed to mark todo item as completed:', error));

deleteTodoItem(1)
  .then(() => console.log('Todo item deleted'))
  .catch((error) => console.error('Failed to delete todo item:', error));

