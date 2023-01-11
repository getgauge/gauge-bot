import { createProbot } from "probot";

async function addComment(context, message, owner, repo, number) {
    const issueComment = { owner: owner, repo: repo, issue_number: number, body: message };
    await context.octokit.issues.createComment(issueComment);
}

function bumpVersion(creator, owner, repo) {
  return `@${creator} Thank you for contributing to ${repo}. Your pull request has been labeled ` +
    `as a release candidate 🎉🎉.\n\n` +

    `Merging this PR will trigger a release.\n\n` +

    `### Please bump up the version as part of this PR.\n\n` +

    `Instructions to bump the version can found at ` +
    `[CONTRIBUTING.md](https://github.com/${owner}/${repo}/blob/master/CONTRIBUTING.md)\n\n` +

    `If the CONTRIBUTING.md file does not exist or does not include instructions about bumping up the ` +
    `version, please looks previous commits in git history to see what changes need to be done.`
}

async function prClosed(context) {
  let labels = context.payload.pull_request.labels;
  let merged = context.payload.pull_request.merged;
  let owner = context.payload.pull_request.base.repo.owner.login;
  let repo = context.payload.pull_request.base.repo.name;

  if (merged && labels.some(e => e.name == 'ReleaseCandidate')) {
    try {
      let response = await fetch(`https://api.github.com/repos/${owner}/${repo}/deployments`, {
        method: 'POST',
        headers: {
          'Authorization': 'token ' + process.env.GAUGEBOT_GITHUB_TOKEN,
          'Accept': 'application/vnd.github.ant-man-preview+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "ref": "master",
          "required_contexts": [],
          "environment": "production"
        }),
      })
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
}

async function prLabeled(context) {
  let label = context.payload.label;
  let creator = context.payload.pull_request.user.login;
  let owner = context.payload.pull_request.base.repo.owner.login;
  let repo = context.payload.pull_request.base.repo.name;
  let number = context.payload.pull_request.number;
  if (label.name === 'ReleaseCandidate') {
    let message = bumpVersion(creator, owner, repo);
    await addComment(context, message, owner, repo, number);
  }
}

/**
 * @param {import('probot').Probot} app
 */
function bot(app) {
  app.on(['pull_request.closed'], prClosed);
  app.on(['pull_request.labeled'], prLabeled);
}

const probot = createProbot();
const loadingApp = probot.load(bot);

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
    console.error(error);

    return {
      statusCode: error.status || 500,
      error: "ooops",
    };
  }
};

