const twilio = require('twilio');

const accountSid = 'AC0d297a527925656072cd6c671a9a276c';
const authToken = 'ee21c89bf7ba7237639e1be5b965f11e';

module.exports = new twilio(accountSid, authToken);
