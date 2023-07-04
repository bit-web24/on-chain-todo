import { Connection, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import borsh from 'borsh';
import { bool } from '@project-serum/borsh';

// Flexible class that takes properties and imbues them
// to the object instance
class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            return (this[key] = properties[key]);
        });
    }
}

// Our instruction payload vocabulary
export class TodoItem extends Assignable {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

export const TodoItemSchema = new Map([
    [TodoItem, { kind: 'struct', fields: [['id', 'u64'], ['title', 'string'], ['description', 'string'], ['completed', 'bool']] }],
]);