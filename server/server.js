const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

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


var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

// post
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then(
        (doc) => {
            res.send(doc);
        },
        (err) => {
            res.status(400).send(err);
        });

});

app.get('/todos', (req, res) => {


    Todo.find().then(
        (docs) => {
            res.send({
                docs
            });
        },
        (err) => {
            res.status(400).send(err);
        });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    Todo.findById(id).then(
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



app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    Todo.findByIdAndRemove(id).then(
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

app.patch('/todos/:id', (req, res) => {

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

    Todo.findByIdAndUpdate(id, {
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



app.listen(port, () => {
    console.log(`listen on port ${port} on ${env}`)
});

module.exports = {
    app
};
