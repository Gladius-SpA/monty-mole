const https = require('https');
const querystring = require('querystring');

let config = require('./config.js');

exports.handler = function(event, context, callback) {
    let response = {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'isBase64Encoded': false
    };

    const body = JSON.parse(event.body);
    const review = body.review;
    const numberOfChanges = Object.keys(body.changes).length;
    if (review.state == 'approved' || (body.action == 'edited' && numberOfChanges == 0)) {
        return callback(null, Object.assign(response, {'statusCode': 204}));
    }

    const pullRequest = body.pull_request;
    let data = querystring.stringify({
        token: config.slackBotToken,
        channel: config.users[pullRequest.user.login],
        text: `${review.user.login} te dejó una review en tu PR#${pullRequest.number} ${pullRequest.html_url}`
    });

    const options = {
      hostname: 'slack.com',
      port: 443,
      path: '/api/chat.postMessage',
      method: 'POST',
      headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
         }
    };
    const req = https.request(options, (res) => {
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
          });
        return callback(null, Object.assign(response, {'statusCode': 201}));
    });
    req.write(data);
    req.end();
};
