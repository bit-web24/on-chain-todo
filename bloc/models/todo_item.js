class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            return (this[key] = properties[key]);
        });
    }
}

// Our instruction payload vocabulary
class TodoItem extends Assignable {
    constructor(properties) {
        super(properties);
        this.id = 0;
        this.title = '';
        this.description = '';
        this.completed = false;
    }
}

const TodoItemSchema = new Map([
    [TodoItem, { kind: 'struct', fields: [['id', 'u64'], ['title', 'string'], ['description', 'string'], ['completed', 'bool']] }],
]);

module.exports = {
    TodoItem,
    TodoItemSchema,
};
