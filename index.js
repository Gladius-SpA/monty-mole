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
      case 'actionOverOwnResource':
        break;
      case 'PRRapproved':
        message = `¡Te aceptaron tu PR#${data.pullRequest.number}! :clap::tada: \n${data.pullRequest.html_url}.`;
        break;
      case 'PRRchangesRequested':
        message = `Solicitaron cambios en tu PR#${data.pullRequest.number}. :sweat_smile: \n${data.pullRequest.html_url}.`;
        break;
      case 'PRReditWithChanges':
        message = `Tu review del PR#${data.pullRequest.number} ha sido modificada. :unamused: \n${data.pullRequest.html_url} `;
        break;
      case 'PRRrequested':
        message = `Han solicitado tu revisión de PR#${data.pullRequest.number}. :mag: \n${data.pullRequest.html_url}`;
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
