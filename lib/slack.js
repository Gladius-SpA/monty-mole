const https = require('https');
const querystring = require('querystring');

class Slack {
  constructor(botToken) {
    this.botToken = botToken;
  }

  sendDM(username, message, callback) {
    let data = querystring.stringify({
      token: this.botToken,
      channel: username,
      text: message
    });

    const options = {
      hostname: 'slack.com',
      port: 443,
      path: '/api/chat.postMessage',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    const req = https.request(options, (res) => {
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
      callback();
    });

    req.write(data);
    req.end();
  }
}

module.exports = Slack;
