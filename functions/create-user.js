const admin = require('firebase-admin');
module.exports = (request, response) => {
 // To ask whether the user has a phone or not
   if (!request.body.phone) {
   return response.status(422).send({ error: 'Bad Input'});
 }
// To correct the phone no. that remove dashes and paranthesis
const phone = String(request.body.phone).replace(/[^\d]/g, '');
return (
   // To create a new User
  admin.auth().createUser({ uid: phone })
 // To notify the user that the account has been created
.then(user => response.status(200).send(user))
.catch((err) => response.status(422).send({ error: err }))
);
};
