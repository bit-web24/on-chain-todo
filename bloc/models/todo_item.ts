// Define the schema for TodoItem serialization
export class TodoItem {
    id: number;
    title: string;
    description: string;
    completed: boolean;

    constructor(id: number, title: string, description: string, completed: boolean) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
    }
}

export const TodoItemSchema = new Map([
    [TodoItem, { kind: 'struct', fields: [['id', 'u64'], ['title', 'string'], ['description', 'string'], ['completed', 'bool']] }],
]);