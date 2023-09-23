// // CRUD
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectId = mongodb.ObjectId;

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to database!')
//     }

//     console.log('Connected correctly');
//     const db = client.db(databaseName);

//     // db.collection('users').updateOne({
//     //     _id: new ObjectId('6495a89f9d8d19c342bbb4b3')
//     // }, {
//     //     // $set: {
//     //     //     name: 'Annet'
//     //     // }
//     //     $inc: {
//     //         age: 1
//     //     }
//     // }).then((result) => {
//     //     console.log(result);
//     // }).catch((error) => {
//     //     console.log(error);
//     // })

//     db.collection('tasks').deleteOne({
//         description: "Clean the house"
//     }).then((result) => {
//         console.log(result);
//     }).catch((error) => {
//         console.log(error);
//     })

// })