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

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('587d45c410a7013484825685')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('587bf6c9dda750e31fbebf13')
    }, {
        $set: {
            name: 'lichterman'
        },
        $inc: {
            age: 2
        }

    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    db.close();
});;
