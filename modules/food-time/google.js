const { OAuth2Client } = require('google-auth-library')
const CLIENT_ID = '299114443733-g59vv11262camtp97hiv99sjh0qr3b9i.apps.googleusercontent.com'

const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
  });
 return ticket.getPayload()
}

module.exports = {
  verify
}
