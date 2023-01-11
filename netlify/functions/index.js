import issueHandler from './issueHandler';
import issueCommentHandler from './issueCommentHandler';
import issueLabelHandler from './issueLabelHandler';
import { prUpdated, prClosed, prLabeled } from './prHandler';

/**
 * @param {import('probot').Probot} app
 */
export default (app) => {

  app.on(['issues.opened', 'issues.reopened'], issueHandler);
  app.on(['issue_comment.created', 'issue_comment.edited'], issueCommentHandler);
  app.on(['issues.labeled'], issueLabelHandler);
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'], prUpdated);
  app.on(['pull_request.closed'], prClosed);
  app.on(['pull_request.labeled'], prLabeled);

}
