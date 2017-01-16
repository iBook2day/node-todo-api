// const MongoClient = require('mongodb').MongoClient;


// De-structuring
const {
    MongoClient,
    ObjectID
} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('connect to MongoDB server');

    // deleteMany
    db.collection('Users').deleteMany({
        name: 'liron'
    }).then((result) => {
        console.log(result)
    }, (err) => {
        console.log('delete many error')
    })
    // deleteOne
    // db.collection('Todos').deleteOne({
    //     text: 'something to dooooooooooooooo'
    // }).then((result) => {
    //     console.log(result)
    // })

    // findOneAndDelete
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('587cc27ea83e2e2f595ef632')
    }).then((result) => {
        console.log(result)
    })



    db.close();
});;
