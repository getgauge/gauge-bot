import issueHandler from './src/issueHandler';
import issueCommentHandler from './src/issueCommentHandler';
import issueLabelHandler from './src/issueLabelHandler';
import { prUpdated, prClosed, prLabeled } from './src/prHandler';

export default (app, { getRouter }) => {


  app.on(['issues.opened', 'issues.reopened'], issueHandler);
  app.on(['issue_comment.created', 'issue_comment.edited'], issueCommentHandler);
  app.on(['issues.labeled'], issueLabelHandler);
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'], prUpdated);
  app.on(['pull_request.closed'], prClosed);
  app.on(['pull_request.labeled'], prLabeled);

  const router = getRouter("/health");

  router.use(require("express").static("public"));

  // Add a new route
  router.get("/check", (req, res) => {
    res.send("Ok!");
  });
}
