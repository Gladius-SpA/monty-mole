const https = require('https');
const querystring = require('querystring');

class Github {
  constructor() { }

  identifyWebhook(headers, body) {
    let eventType = headers['X-GitHub-Event'];
    switch (eventType) {
      case 'pull_request_review':
        switch (body.action) {
          case 'submitted':
            switch (body.review.state) {
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
              return {name: 'PRReditWithChanges', data: {pullRequest: body.pull_request, recipient: body.pull_request.user.login}};
            } else {
              return {name: 'PRReditWithoutChanges', data: {}};
            }
      case 'pull_request':
        switch (body.action) {
          case 'review_requested':
            return {name: 'PRRrequested', data: {pullRequest: body.pull_request, recipient: body.pull_request.requested_reviewers[0].login}};
          default:
            console.log('Error: event not defined');
            return {name: 'EventNotDefined'}
        }

      default:
        console.log('Error: event not defined');
        return {name: 'EventNotDefined'}
    }
  }
}

module.exports = Github;
