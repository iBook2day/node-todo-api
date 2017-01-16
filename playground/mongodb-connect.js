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

    db.collection('Todos').insertOne({
        text: 'something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert Todos', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));

    })

    db.collection('Users').insertOne({
        name: 'liron',
        age: 18,
        location: 'tlv'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert Users', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));

    })
    db.close();
});
