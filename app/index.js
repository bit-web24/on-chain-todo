const web3 = require('@solana/web3.js');
const fs = require('fs');

// Connect to the local Solana cluster
const connection = new web3.Connection('http://localhost:8899', 'confirmed');
console.log(connection);

// Read the keypair file
const keypairFilePath = "/home/bittu/.config/solana/id.json";
const keypairData = fs.readFileSync(keypairFilePath);
const payerKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairData)));

// Get the public key
const publicKey = payerKeypair.publicKey.toBase58();
console.log(publicKey);
