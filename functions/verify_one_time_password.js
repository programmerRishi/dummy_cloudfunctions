const admin = require('firebase-admin');

module.exports = (request, response) =>
{
  if (!request.body.phone || !request.body.code) {
    return response.status(422).send({ error: "Phone number and code must be entered"});
  }

  const phone = String(request.body.phone).replace(/[^\d]/g, '');
  const code = parseInt(request.body.code);

  admin.auth().getUser(phone)
  .then(userId => {
    const ref = admin.database().ref(`users/${phone}`);

    return(
    ref.on('value', snapshot =>
      {
      //Because google cloud functions do not support any connected to processes and sitting for watching changes
        ref.off();// switches off .on() and donot listen to any further changes to reference
        const user = snapshot.val();

        if(user.code !== code || !user.codeValid) {
          return response.status(422).send({ error: 'Code not valid' });
        }

        ref.update({ codeValid: false })
        return (
        admin.auth().createCustomToken(phone)
        .then(token => response.send({ token: token }))
        .catch(err => response.send({ error: err }))
               );
       }
   )
    )
    }
  )
  .catch((err) => response.status(422).send({ error: err }));
};
