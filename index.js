const issueHandler = require('./src/issueHandler');
const issueCommentHandler = require('./src/issueCommentHandler');
const prHandler = require('./src/prHandler');
const configureCLA = require('./src/cla');
const labels = require('./src/labels');


module.exports = app => {
  configureCLA(app);
  app.on('issues.opened', issueHandler);
  app.on(['issue_comment.created', 'issue_comment.edited'], issueCommentHandler);
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'], prHandler);
  app.on('issues.labeled', labels.onLabelAdded);
}
