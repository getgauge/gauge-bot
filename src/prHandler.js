import { addComment } from './comments';
import { bumpVersion } from './messages';
import axios from 'axios';
import { createProjectCard, PR_CONTENT_TYPE, GAUGE_READY_FOR_DEV_COLUMN_NAME } from './projects';

export async function prUpdated(context) {
  if (context.payload.action === 'opened') {
    await createProjectCard(context, context.payload.pull_request.id, PR_CONTENT_TYPE, GAUGE_READY_FOR_DEV_COLUMN_NAME);
  }
}

export async function prClosed(context) {
  let labels = context.payload.pull_request.labels;
  let merged = context.payload.pull_request.merged;
  let owner = context.payload.pull_request.base.repo.owner.login;
  let repo = context.payload.pull_request.base.repo.name;

  if (merged && labels.some(e => e.name == 'ReleaseCandidate')) {
    try {
      let response = await axios.post(`https://api.github.com/repos/${owner}/${repo}/deployments`, {
        "ref": "master",
        "required_contexts": [],
        "environment": "production"
      }, {
        headers: {
          'Authorization': 'token ' + process.env.GAUGEBOT_GITHUB_TOKEN,
          'Accept': 'application/vnd.github.ant-man-preview+json',
          'Content-Type': 'application/json',
        },
      })
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
}


export async function prLabeled(context) {
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

