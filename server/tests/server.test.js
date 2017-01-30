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

const {
    User
} = require('./../models/user.js');

const {
    todos,
    populateTodos,
    users,
    populateUsers
} = require('./seed/seed.js');


beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todo', () => {
    it('should create a new todo', (done) => {
            var text = 'test todo text';
            request(app)
                .post('/todos')
                .set('x-auth', users[0].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.docs.length).toBe(1)
            })
            .end(done);

    })

})

describe('GET /todo/id', () => {
    it('should return todo doc', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text)
                })
                .end(done);

        }),
        it('should not return todo doc not ', (done) => {
            request(app)
                .get(`/todos/${todos[1]._id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);

        }),

        it('should return 404 if todo not found ', (done) => {
            var id = new ObjectID();

            request(app)
                .get(`/todos/${id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);

        }),

        it('should return 404 if id not valid', (done) => {
            request(app)
                .get(`/todos/123`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);

        })

})





describe('DELETE /todo/id', () => {
    it('should remove todo doc', (done) => {
            var hexID = todos[0]._id.toHexString();
            request(app)
                .delete(`/todos/${hexID}`)
                .set('x-auth', users[0].tokens[0].token)
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

        it('should remove todo doc with different user', (done) => {
            var hexID = todos[0]._id.toHexString();
            request(app)
                .delete(`/todos/${hexID}`)
                .set('x-auth', users[1].tokens[0].token)
                .expect(404)

                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    Todo.findById(hexID)
                        .then((todo) => {
                            expect(todo).toExist();
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
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);

        }),

        it('should return 404 if id not valid', (done) => {
            request(app)
                .delete(`/todos/123`)
                .set('x-auth', users[0].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
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
        it('should not update due to different user todo / update text / update completed from false to true / update completdAt to number', (done) => {
            var hexID = todos[0]._id.toHexString();
            var text = "update from server.test";

            request(app)
                .patch(`/todos/${hexID}`)
                .set('x-auth', users[1].tokens[0].token)
                .send({
                    text,
                    completed: true
                })
                .expect(404)
                .end(done);
        }),

        it('should update todo / update text / update completed from true to false / update completdAt to null', (done) => {
            var hexID = todos[0]._id.toHexString();
            var text = "update from server.test";

            request(app)
                .patch(`/todos/${hexID}`)
                .set('x-auth', users[0].tokens[0].token)
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
describe('POST /users/me', () => {

    it('should return user if authenticate', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
            }).end(done);

    })


    it('should return 401 if not authenticate', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'somefake')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            }).end(done);
    })

})

describe('POST /users', () => {

    it('should create new user', (done) => {
        var email = 'example@gmail.com';
        var password = 'mypassword';
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toExist();
            }).end((e) => {
                if (e) {
                    done(e)
                } else {
                    User.findOne({
                        email
                    }).then((user) => {
                        expect(user).toExist();
                        expect(user.password).toNotBe(password);
                        done()
                    }).catch((e) => {
                        done(e)
                    })
                }

            });


    })

    it('should return validation error', (done) => {
        var email = 'examplegmail.com';
        var password = 'mypassword';
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400).end((e) => {
                done(e)
            });
    })

    it('should not create user if email exists', (done) => {
        var email = users[0].email;
        var password = 'mypassword';
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400).end((e) => {
                done(e)
            });
    })

})






describe('POST /users/login', () => {


    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            }).end(
                (err, res) => {
                    if (err) {
                        return done(err);
                    }

                    User.findById(users[1]._id).then(
                        (user) => {
                            expect(user.tokens[1]).toInclude({
                                access: 'auth',
                                token: res.headers['x-auth']
                            });
                            done();
                        }).catch((e) => {
                        done(e)
                    })
                }

            ) // end end
        // end it;

    })


    it('should reject invalid login ', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'fake'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    User.findById(users[1]._id).then(
                        (user) => {
                            expect(user.tokens.length).toBe(1);
                            done();
                        }).catch((e) => {
                        done(e)
                    })
                }

            );
    })

})

describe('DELETE /users/me/token', () => {

    it('should delete token ', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then(
                    (user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch((e) => {
                    done(e)
                })



            })
    })


})
