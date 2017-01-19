var express = require('express');
var bodyParser = require('body-parser');
const {
    ObjectID
} = require('mongodb');


//de - structuring
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




app.listen(3000, () => {
    console.log("listen on port 3000")
});

module.exports = {
    app
};
