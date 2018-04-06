const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = (request, response) => {
 if(!request.body.phone){
   return response.status(422).send({ error: 'You must provide a phone number' });
 }

const phone = String(request.body.phone).replace(/[^\d]/g, '');
return(
  //admin.auth().getUser(uid)
  admin.auth().getUser(phone)
  .then(userRecord =>
  {
   const code = Math.floor((Math.random() * 8999 + 1000));
   //Twilio API doesnot return a promise,
   //therfore we have to use a callback instead of .then()
    return(
     twilio.messages.create({
     body: `Your one time password is:- ${code}`,
     to: '+91'+phone,
     from: '+18302823285'
   }, (err) => {
     if(err) { return response.status(422).send(err);}

    return( admin.database().ref('users/'+ phone)
     .update({ code: code, codeValid: true }, () => {
       response.send({ success: true});
     })
   );
   })
 )}
)
 .catch((err) => response.status(422).send({ error: 'no user identified', err }))
);
}
