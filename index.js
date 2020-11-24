const issueHandler = require('./src/issueHandler');
const issueCommentHandler = require('./src/issueCommentHandler');
const issueLabelHandler = require('./src/issueLabelHandler');
const { prUpdated, prClosed, prLabeled } = require('./src/prHandler');

module.exports = ({app}) => {
  app.on(['issues.opened', 'issues.reopened'], issueHandler);
  app.on(['issue_comment.created', 'issue_comment.edited'], issueCommentHandler);
  app.on(['issues.labeled'], issueLabelHandler);
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'], prUpdated);
  app.on(['pull_request.closed'], prClosed);
  app.on(['pull_request.labeled'], prLabeled);
}
