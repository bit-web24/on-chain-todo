const { struct, u32, bool, str } = require('@solana/buffer-layout');

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

// Define the updated TodoItem schema using @solana/buffer-layout
const TodoItemLayout = struct([
  u32('id'),
  str('title'),
  str('description'),
  bool('completed'),
]);

module.exports = {
    TodoItem,
    TodoItemLayout,
};
