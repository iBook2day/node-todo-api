const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {
    ObjectID
} = require('mongodb');


//de - structuring
var {
    env
} = require('./config/config.js');

var {
    mongoose
} = require('./db/mongoose.js');

var {
    Todo
} = require('./models/todo.js');

var {
    User
} = require('./models/user.js');

var {
    authenticate
} = require('./middleware/authenticate.js');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

// post
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then(
        (doc) => {
            res.send(doc);
        },
        (err) => {
            res.status(400).send(err);
        });

});

app.get('/todos', authenticate, (req, res) => {


    Todo.find({
        _creator: req.user._id
    }).then(
        (docs) => {
            res.send({
                docs
            });
        },
        (err) => {
            res.status(400).send(err);
        });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then(
        (todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({
                todo
            })
        },
        (err) => {
            res.send(err)
        }).catch((e) => {
        res.status(400).send();
    });
});



app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id

    }).then(
        (todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({
                todo
            })
        },
        (err) => {
            res.send(err)
        }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    if (body.completed && _.isBoolean(body.completed)) {
        body.completedAt = new Date().getTime();

    } else {
        body.completed = false;
        body.completedAt = null;

    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id

    }, {
        $set: body
    }, {
        new: true
    }).then(
        (todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({
                todo
            })
        }
    ).catch((e) => {
        res.status(400).send();
    });
});



// post user
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password', 'tokens'])

    var user = new User(body);

    user.save().then(
            () => {
                return user.generateAuthToken();

            }).then((token) => {
            res.header('x-auth', token).send(user);
        })
        .catch((e) => {
            res.status(400).send(e)
        })

});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);

})

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(
        () => {
            res.status(200).send()
        },
        () => {
            res.status(400).send()
        }

    );

})

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])

    User.findByCreditional(body.email, body.password).then(

        (user) => {

            return user.generateAuthToken().then((token) => {
                res.header('x-auth', token).send(user);
            })

        }).catch((e) => {
        console.log(e);
        res.status(400).send()
    })



})









app.listen(port, () => {
    console.log(`listen on port ${port} on ${env}`)
});

module.exports = {
    app
};
