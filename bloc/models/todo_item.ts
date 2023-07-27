import * as borsh from '@project-serum/borsh';

const payloadSchema = borsh.struct([
    borsh.u8('instruction'),
    borsh.u8('id'),
    borsh.str('title'),
    borsh.str('description'),
    borsh.bool('completed')
]);

function serialize_instruction_data(data: TodoItem): Buffer {
    const buffer = Buffer.alloc(1000);
    payloadSchema.encode(data, buffer)

    const instructionBuffer = buffer.slice(0, payloadSchema.getSpan(buffer));

    return instructionBuffer;
}

interface TodoItem {
    instruction: number,
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

export {
    TodoItem,
    serialize_instruction_data,
};
