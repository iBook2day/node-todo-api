const {
    mongoose
} = require('./../server/db/mongoose.js');


const {
    Todo
} = require('./../server/models/todo.js');

const {
    User
} = require('./../server/models/user.js');

var id = '587f246e63b83c76f670bc9b';

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log(todos);
// });
//
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log(todo);
// });

// Todo.findById(id).then((todo) => {
//     console.log(todo);
// }).catch((e) => {
//     console.log(e.message)
// });

User.findById(id).then((user) => {
    if (!user) {
        return console.log('no user with id', id);
    }
    console.log(user);
}).catch((e) => {
    console.log(e.message)
});
