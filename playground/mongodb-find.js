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

    // db.collection('Todos').find({
    //     _id: new ObjectID('587bf5daa682bfe24f724d59')
    // }).toArray().then((docs) => {
    //
    //     console.log('todos');
    //
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('error', err);
    // })



    // db.collection('Todos').find({
    //     _id: new ObjectID('587bf5daa682bfe24f724d59')
    // }).count().then((cnt) => {
    //   console.log(cnt);
    // });


    // db.collection('Todos').find().count().then((cnt) => {
    //     console.log(cnt);
    // });

    db.collection('Users').find({
        name: 'lironj'
    }).toArray().then((docs) => {

        console.log('Users');

        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('error', err);
    })








    db.close();
});;
