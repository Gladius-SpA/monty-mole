let config = require('./config.js');
let Slack = require('./lib/slack.js');
let Github = require('./lib/github.js');

exports.handler = function(event, context, callback) {
    let response = {
      'statusCode': 201,
      'headers': {
          'Content-Type': 'application/json'
      },
      'isBase64Encoded': false
    };

    let github = new Github();
    let eventType = github.identifyWebhook(event.headers, JSON.parse(event.body));
    let data = eventType.data;

    let message = '';
    switch (eventType.name) {
      case 'PRRapproved':
        message = `Te aceptaron tu PR#${data.pullRequest.number} ${data.pullRequest.html_url}.`;
        break;
      case 'PRRchangesRequested':
        message = `Solicitaron cambios en tu PR#${data.pullRequest.number} ${data.pullRequest.html_url}.`;
        break;
      case 'PRReditWithChanges':
        message = `La review de tu PR#${data.pullRequest.number} ${data.pullRequest.html_url} ha sido modificada.`;
        break;
      default:
        return callback(null, Object.assign(response, {'statusCode': 204}));
    }

    let slack = new Slack(config.slackBotToken);

    slack.sendDM(
     config.users[data.recipient],
      message,
      function() {
        return callback(null, Object.assign(response, {'statusCode': 201}));
      }
    )
};
