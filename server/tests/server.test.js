const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('mongodb');


const {
    app
} = require('./../server.js');
const {
    Todo
} = require('./../models/todo.js');


const todos = [{
    _id: new ObjectID(),
    text: 'first const todo'
}, {
    _id: new ObjectID(),
    text: 'second const todo',
    completed: true,
    completedAt: 123

}];

beforeEach((done) => {
    Todo.remove({}).then(() => {

        return Todo.insertMany(todos);

    }).then(() => {
        done();
    });
});

describe('POST /todo', () => {
    it('should create a new todo', (done) => {
            var text = 'test todo text';
            request(app)
                .post('/todos')
                .send({
                    text
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.text).toBe(text);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.find({
                        text
                    }).then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch((e) => {
                        done(e);
                    })

                });



        }),

        it('should not create a new todo, invalid text', (done) => {
            request(app)
                .post('/todos')
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.find().then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    }).catch((e) => {
                        done(e);
                    })

                });


        });

});

describe('GET /todo', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.docs.length).toBe(2)
            })
            .end(done);

    })

})

describe('GET /todo/id', () => {
    it('should return todo doc', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text)
                })
                .end(done);

        }),

        it('should return 404 if todo not found ', (done) => {
            var id = new ObjectID();

            request(app)
                .get(`/todos/${id.toHexString()}`)
                .expect(404)
                .end(done);

        }),

        it('should return 404 if id not valid', (done) => {
            request(app)
                .get(`/todos/123`)
                .expect(404)
                .end(done);

        })

})





describe('DELETE /todo/id', () => {
    it('should remove todo doc', (done) => {
            var hexID = todos[0]._id.toHexString();
            request(app)
                .delete(`/todos/${hexID}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(hexID)
                })
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    Todo.findById(hexID)
                        .then((todo) => {
                            expect(todo).toNotExist();
                            done();
                        }).catch((e) => {
                            done(e);
                        })

                });
        }),

        it('should return 404 if todo not found ', (done) => {
            var id = new ObjectID();

            request(app)
                .delete(`/todos/${id.toHexString()}`)
                .expect(404)
                .end(done);

        }),

        it('should return 404 if id not valid', (done) => {
            request(app)
                .delete(`/todos/123`)
                .expect(404)
                .end(done);

        })

})




describe('PATCH /todo/id', () => {
    // Todos[0].completed --> false, Todos[1].completed --> true
    it('should update todo / update text / update completed from false to true / update completdAt to number', (done) => {
            var hexID = todos[0]._id.toHexString();
            var text = "update from server.test";

            request(app)
                .patch(`/todos/${hexID}`)
                .send({
                    text,
                    completed: true
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.completed).toBe(true);
                    expect(res.body.todo.completedAt).toBeA('number');
                    expect(res.body.todo.text).toBe(text);
                })
                .end(done);
        }),

        it('should update todo / update text / update completed from true to false / update completdAt to null', (done) => {
            var hexID = todos[1]._id.toHexString();
            var text = "update from server.test";

            request(app)
                .patch(`/todos/${hexID}`)
                .send({
                    text,
                    completed: false
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toNotExist();
                    expect(res.body.todo.text).toBe(text);
                })
                .end(done);

        })

})
