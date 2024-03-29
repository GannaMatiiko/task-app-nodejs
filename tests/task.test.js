const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { 
    userOne, 
    userOneId, 
    userTwo, 
    userTwoId,
    taskOne,
    taskTwo,
    taskThree, 
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async() => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should get tasks for certain user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const tasks = await response.body;
    expect(tasks.length).toBe(2)
})

test('Should not delete other users tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})

test('Should not create task with invalid description', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: ''
        })
        .expect(400)
})

test('Should not create task with invalid completed', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            description: 'test invalid completed',
            completed: 1234
        })
        .expect(400)
})

test('Should not update task with invalid description', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: ''
        })
        .expect(400)
})

test('Should not update task with invalid completed', async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'test invalid completed',
            completed: 1234
        })
        .expect(400)
})

test('Should delete user task', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await Task.findById(response.body._id);
    expect(task).toBeNull()
})

test('Should not delete task if unauthenticated', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
})

test('Should not update other users task', async () => {
    await request(app)
        .patch(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'update other user task'
        })
        .expect(404)
})

test('Should fetch user task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(response.body._id);
    expect(task.description).toEqual('Second task')
})

test('Should not fetch user task by id if unauthenticated', async () => {
    await request(app)
        .get(`/tasks/${taskTwo._id}`)
        .send()
        .expect(401)
})

test('Should not fetch other users task by id', async () => {
    await request(app)
        .get(`/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
})

test('Should fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks/?completed=true')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(1)
}) 

test('Should fetch only incomplete tasks', async () => {
    const response = await request(app)
        .get('/tasks/?completed=false')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(0)
}) 

test('Should sort tasks by description', async () => {
    const response = await request(app)
        .get('/tasks/?sortBy=description:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body[0].description).toEqual('Second task')
})

test('Should sort tasks by completed', async () => {
    const response = await request(app)
        .get('/tasks/?sortBy=completed:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body[0].description).toEqual('Second task')
})

test('Should sort tasks by createdAt', async () => {
    const response = await request(app)
        .get('/tasks/?sortBy=createdAt:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body[0].description).toEqual('Second task')
})

test('Should sort tasks by updatedAt', async () => {
    const response = await request(app)
        .get('/tasks/?sortBy=updatedAt:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body[0].description).toEqual('Second task')
})

test('Should fetch page of tasks', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=createdAt:desc&limit=1&skip=1')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body[0].description).toEqual('First task')
})