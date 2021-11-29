/**
 * referência: https://gist.github.com/dmh2000/1609820c17c5daf95298f54324360950
 */

const bcrypt = require("bcryptjs");

const GerenciadorSenhas = {

  genSalt(password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, function(err, salt) {
        if (err) {
          reject(err);
        } else {
          resolve({
            salt,
            password
          });
        }
      });
    });
  },

  genHash(salt, password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve({
            salt: salt,
            password: password,
            hash: hash
          });
        }
      });
    });
  }
};

module.exports = GerenciadorSenhas;




// // execute in sequence
// console.log("store");
// genSalt(password)
//   .then(function(result) {
//     return genHash(result.salt, result.password);
//   })
//   .then(function(result) {
//     console.log("store hash in user profile :", result);
//     stored_hash = result.hash;
//   })
//   .catch(function(err) {
//     console.log(err);
//   });

// // =====================================================
// function lookupUser(user, passwd) {
//   return new Promise((resolve, reject) => {
//     // lookup the user in the stored database
//     // in this case its not async so just resolve with the stored hash
//     resolve({
//       user: user,
//       password: passwd,
//       hash1: stored_hash
//     });
//   });
// }

// function reHash(user, password, hash1) {
//     // extract salt from existing has (30 characters)
//   let salt = hash1.substr(0, 30);
//   return new Promise((resolve, reject) => {
//     bcrypt.hash(password, salt,  function(err, hash2) {
//       if (err) {
//         reject({
//             err,
//             user: user,
//             salt: salt,
//             password: password,
//             hash1: hash1, // stored hash
//             hash2: hash2 // generated hash
//           });
//       } else {
//         resolve({
//           user: user,
//           salt: salt,
//           password: password,
//           hash1: hash1, // stored hash
//           hash2: hash2 // generated hash
//         });
//       }
//     });
//   });
// }

// // lookup and verify
// setTimeout(function() {
//   console.log("verify");
//   lookupUser("joe", password)
//     .then(function(result) {
//       return reHash(result.user, result.password, result.hash1);
//     })
//     .then(function(result) {
//       console.log(result.hash1);
//       console.log(result.hash2);
//       if (result.hash1 === result.hash2) {
//         console.log("verified");
//       } else {
//         console.log("failed");
//       }
//     })
//     .catch(function(err) {
//       console.log(err);
//     });
// }, 1000);