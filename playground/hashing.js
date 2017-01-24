const {
    SHA256
} = require('crypto-js');


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })
// })

var hashpass = '$2a$10$btpdQpquhBv08gIl2OLshe5vCekGsm2sCBZgzUsFDm15l8.NHo1LW';
bcrypt.compare(password, hashpass, (err, res) => {
    console.log(res);
})

// var data = {
//     id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// var message = 'I am user number';
//
// var hash = SHA256(message).toString();
//
// console.log(message);
//
// console.log(hash);
//
// var data = {
//     id: 4
// };
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data)).toString()
// }
