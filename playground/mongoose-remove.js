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

// Todo.remove({}).then((resolve) => {
//     console.log(resolve);
// });

Todo.findOneAndRemove({
    _id: '58813c0835e35aebfa19bdbd'
}).then((todo) => {
    console.log(todo);
}).catch((e) => {
    console.log(e)
});

// Todo.findByIdAndRemove('58813c0835e35aebfa19bdbd').then((todo) => {
//     console.log(todo);
// }).catch((e) => {
//     console.log(e)
// });
