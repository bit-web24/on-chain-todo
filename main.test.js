const supertest = require('supertest');
const assert = require('assert');
const server = require('./server/serve'); // Replace with the actual path to your server file

const request = supertest(server);

describe('Server API Test', () => {
  // Set up test data or resources if needed before running the test cases

  // Test case for checking server connection
  it('should check server connection', async () => {
    const res = await request.get('/check-connection');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.isConnected, true);
    assert.strictEqual(res.body.walletAddr, 'CT6KYufS97eHBSN3FWtH7M4wk3TJCy2anftTQi94du7q');
  });

  // Test case for getting balance
  it('should get balance', async () => {
    const res = await request.get('/balance');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.balance, 499999989.020502985);
  });

  // Test case for creating a todo
  it('should create a new todo', async () => {
    const todo = {
      title: 'Test Todo',
      description: 'This is a test todo',
      completed: false,
    };
    const res = await request.post('/todos').send({ todo });
    assert.strictEqual(res.status, 201);
    // Assert any additional conditions you expect for a successful creation
  });

  // Test case for marking a todo as completed
  it('should mark a todo as completed', async () => {
    const todo = {
      id: 1, // Replace with a valid todo ID that exists in your test data
      title: 'Test Todo',
      description: 'This is a test todo',
      completed: false,
    };
    const res = await request.put('/todos/1/complete').send({ todo });
    assert.strictEqual(res.status, 200);
    // Assert any additional conditions you expect after marking the todo as completed
  });

  // Test case for updating a todo
  it('should update a todo', async () => {
    const todo = {
      id: 1, // Replace with a valid todo ID that exists in your test data
      title: 'Updated Todo',
      description: 'This is an updated test todo',
    };
    const res = await request.put('/todos/1').send({ todo });
    assert.strictEqual(res.status, 200);
    // Assert any additional conditions you expect after updating the todo
  });

  // Test case for deleting a todo
  it('should delete a todo', async () => {
    const todo = {
      id: 1, // Replace with a valid todo ID that exists in your test data
      title: 'Test Todo',
      description: 'This is a test todo',
    };
    const res = await request.delete('/todos/1').send({ todo });
    assert.strictEqual(res.status, 200);
    // Assert any additional conditions you expect after deleting the todo
  });

  // // Test case for fetching a todo by ID
  // it('should fetch a todo by ID', async () => {
  //   // Implement test logic to add a todo item and then fetch it by ID
  //   // Assert the response status, data, etc.
  // });

  // // Test case for fetching all todos
  // it('should fetch all todos', async () => {
  //   // Implement test logic to add multiple todo items and then fetch all of them
  //   // Assert the response status, data, etc.
  // });
});
