const issueHandler = require('./src/issueHandler');
const issueCommentHandler = require('./src/issueCommentHandler');
const prHandler = require('./src/prHandler');
const confugureCLA = require('./src/cla');

module.exports = app => {
  confugureCLA(app);
  app.on('issues.opened', issueHandler);
  app.on(['issue_comment.created', 'issue_comment.edited'], issueCommentHandler);
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'], prHandler);
}
