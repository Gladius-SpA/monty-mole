const https = require('https');
const querystring = require('querystring');

class Github {
  constructor() { }

  identifyWebhook(headers, body) {
    let eventType = headers['X-GitHub-Event'];
    switch (eventType) {
      case 'pull_request_review':
        const review = body.review;
        if (body.sender.id == review.user.id) {
          return 'actionOverOwnResource';
        }
        switch (body.action) {
          case 'submitted':
            switch (review.state) {
              case 'approved':
                return {name: 'PRRapproved', data: {pullRequest: body.pull_request, recipient: body.pull_request.user.login}};
              case 'changes_requested':
                return {name: 'PRRchangesRequested', data: {pullRequest: body.pull_request, recipient: body.pull_request.user.login}}};
            }
          case 'dismissed':
            return {name: 'PRRdismiss', data: {}};
          case 'edited':
            const numberOfChanges = Object.keys(body.changes || {}).length;
            if (numberOfChanges > 0) {
              return {name: 'PRReditWithChanges', data: {pullRequest: body.pull_request, recipient: body.pull_request.user.login}}};
            } else {
              return {name: 'PRReditWithoutChanges', data: {}};
            }
        }
      default:
        console.log('Error: event not defined');
        break;
    }
  }
}

module.exports = Github;
