const jwt = require('jsonwebtoken');

const {
    ObjectID
} = require('mongodb');


const {
    Todo
} = require('./../../models/todo.js');

const {
    User
} = require('./../../models/user.js');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: '123@gmail.com',
    password: '123password',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userOneId.toHexString(),
            access: 'auth'
        }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'abc@gmail.com',
    password: 'abcpassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userTwoId.toHexString(),
            access: 'auth'
        }, 'abc123').toString()
    }]

}];

const todos = [{
        _id: new ObjectID(),
        text: 'first const todo',
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: 'second const todo',
        completed: true,
        completedAt: 123,
        _creator: userTwoId

    }
];

const populateTodos = (done) => {

    Todo.remove({}).then(() => {

        return Todo.insertMany(todos);

    }).then(() => {
        done();
    });
}

const populateUsers = (done) => {

    User.remove({}).then(() => {

        var saveOne = new User(users[0]).save();
        var saveTwo = new User(users[1]).save();

        return Promise.all([saveOne, saveTwo]);

    }).then(() => {
        done();
    })
}

module.exports = {
    todos,
    populateTodos,
    populateUsers,
    users

}
