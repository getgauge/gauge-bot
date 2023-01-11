import { createProbot } from "probot";

import issueHandler from './issueHandler';
import issueCommentHandler from './issueCommentHandler';
import issueLabelHandler from './issueLabelHandler';
import { prUpdated, prClosed, prLabeled } from './prHandler';

/**
 * @param {import('probot').Probot} app
 */
function app() {

  app.on(['issues.opened', 'issues.reopened'], issueHandler);
  app.on(['issue_comment.created', 'issue_comment.edited'], issueCommentHandler);
  app.on(['issues.labeled'], issueLabelHandler);
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'], prUpdated);
  app.on(['pull_request.closed'], prClosed);
  app.on(['pull_request.labeled'], prLabeled);

}

const probot = createProbot();
const loadingApp = probot.load({
  appFn: app
});

/**
 * Netlify function to handle webhook event requests from GitHub
 *
 * @param {import("@netlify/functions").HandlerEvent} event
 * @param {import("@netlify/functions").HandlerContext} _context
 */
export async function handler(event, _context) {
  try {
    await loadingApp;

    // this could will be simpler once we  ship `verifyAndParse()`
    // see https://github.com/octokit/webhooks.js/issues/379
    await probot.webhooks.verifyAndReceive({
      id:
        event.headers["X-GitHub-Delivery"] ||
        event.headers["x-github-delivery"],
      name: event.headers["X-GitHub-Event"] || event.headers["x-github-event"],
      signature:
        event.headers["X-Hub-Signature-256"] ||
        event.headers["x-hub-signature-256"],
      payload: JSON.parse(event.body),
    });

    return {
      statusCode: 200,
      body: '{"ok":true}',
    };
  } catch (error) {
    app.log.error(error);

    return {
      statusCode: error.status || 500,
      error: "ooops",
    };
  }
};

