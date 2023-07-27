"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTodoItem = exports.deleteTodoItem = exports.markCompleted = exports.addTodoItem = exports.getBalance = exports.getProgramId = exports.readKeypair = void 0;
const web3 = __importStar(require("@solana/web3.js"));
const buffer_1 = require("buffer");
const todo_item_1 = require("./models/todo_item");
const fs = __importStar(require("fs"));
function readKeypair(keypairFilePath) {
    const keypairData = fs.readFileSync(keypairFilePath, 'utf-8');
    return web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypairData)));
}
exports.readKeypair = readKeypair;
function getProgramId() {
    return __awaiter(this, void 0, void 0, function* () {
        return new web3.PublicKey("HG7TGfAafFsPTA28aTnmDPcgtEd26Xotr9iFZmDLGoMz");
    });
}
exports.getProgramId = getProgramId;
function getBalance(pubkey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
            const balance = yield connection.getBalance(readKeypair("/home/bittu/.config/solana/id.json").publicKey);
            return (balance / web3.LAMPORTS_PER_SOL);
        }
        catch (error) {
            console.error(error);
            return 0;
        }
    });
}
exports.getBalance = getBalance;
function addTodoItem(payerKey, programId, todoItem) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keypairFilePath = "/home/bittu/.config/solana/id.json";
            const payerKeypair = readKeypair(keypairFilePath);
            const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
            const transaction = new web3.Transaction();
            // Serialize the todoItem object using updated TodoItemLayout
            const payload = {
                instruction: 0,
                id: todoItem.id,
                title: todoItem.title,
                description: todoItem.description,
                completed: todoItem.completed,
            };
            // Serialize the instruction data
            const buffer = (0, todo_item_1.serialize_instruction_data)(payload);
            // Calculate the PDA
            const [pda, bump] = yield web3.PublicKey.findProgramAddress([buffer_1.Buffer.from(todoItem.id.toString()), payerKeypair.publicKey.toBuffer()], new web3.PublicKey("HG7TGfAafFsPTA28aTnmDPcgtEd26Xotr9iFZmDLGoMz"));
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
            const signature = yield web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
            console.log('Transaction confirmed:', signature);
        }
        catch (error) {
            console.error('Error adding Todo item:', error);
        }
    });
}
exports.addTodoItem = addTodoItem;
function markCompleted(payerKeypair, programId, todoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
        const transaction = new web3.Transaction();
        // Serialize the todoItem object using updated TodoItemLayout
        const payload = {
            instruction: 0,
            id: todoId,
            title: 'title',
            description: 'description',
            completed: false,
        };
        // Serialize the instruction data
        const buffer = (0, todo_item_1.serialize_instruction_data)(payload);
        // Calculate the PDA
        const [pda] = web3.PublicKey.findProgramAddressSync([buffer_1.Buffer.from(todoId.toString()), payerKeypair.publicKey.toBuffer()], programId);
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
        yield web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
    });
}
exports.markCompleted = markCompleted;
function deleteTodoItem(payerKeypair, programId, todoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
        const transaction = new web3.Transaction();
        // Serialize the todoItem object using updated TodoItemLayout
        const payload = {
            instruction: 0,
            id: todoId,
            title: 'title',
            description: 'description',
            completed: false,
        };
        // Serialize the instruction data
        const buffer = (0, todo_item_1.serialize_instruction_data)(payload);
        // Calculate the PDA
        const [pda] = web3.PublicKey.findProgramAddressSync([buffer_1.Buffer.from(todoId.toString()), payerKeypair.publicKey.toBuffer()], programId);
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
        yield web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
    });
}
exports.deleteTodoItem = deleteTodoItem;
function updateTodoItem(payerKeypair, programId, todoItem) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
        const transaction = new web3.Transaction();
        // Serialize the todoItem object using updated TodoItemLayout
        const payload = {
            instruction: 0,
            id: todoItem.id,
            title: todoItem.title,
            description: todoItem.description,
            completed: todoItem.completed,
        };
        // Serialize the instruction data
        const buffer = (0, todo_item_1.serialize_instruction_data)(payload);
        // Calculate the PDA
        const [pda] = web3.PublicKey.findProgramAddressSync([buffer_1.Buffer.from(todoItem.id.toString()), payerKeypair.publicKey.toBuffer()], programId);
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
        yield web3.sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
    });
}
exports.updateTodoItem = updateTodoItem;
