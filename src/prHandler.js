const data = require('./data')

async function hasLabel (context) {
  let config = context.repo({ number: context.payload.pull_request.number });
  let labels = await context.github.issues.getIssueLabels(config);
  return Promise.resolve(labels.data.some(l => l.name === 'cla-signed'));
}

async function ccToCoreTeam (context) {
  const issueComment = context.issue({ body: 'This PR has been verified. The guage team will be looking into this soon.\n\n/cc @getgauge/core' });
  await context.github.issues.createComment(issueComment);
}

async function addCLASignedLabel (context, recheck) {
  if (recheck) await ccToCoreTeam(context);
  if (await hasLabel(context)) return Promise.resolve();
  try {
    await context.github.issues.getLabel(context.repo({ name: 'cla-signed' }));
  } catch (error) {
    await context.github.issues.createLabel(context.repo({ name: 'cla-signed', color: '1CA50F' }));
  }
  let number = context.payload.pull_request.number;
  return context.github.issues.addLabels(context.repo({ number: number, labels: ['cla-signed'] }));
}

async function createStatus (context, state, recheck) {
  if (state) await addCLASignedLabel(context, recheck);
  let status = context.repo({
    state: state ? 'success' : 'failure',
    context: 'verification/cla-signed',
    targetURl: '',
    sha: context.payload.pull_request.head.sha
  })
  return context.github.repos.createStatus(status);
}

async function updatePR (context, logins, recheck) {
  if (logins.length === 0) return createStatus(context, true, recheck);
  let users = logins.map(u => `@${u}`).join(', ');
  const issueComment = context.issue({
    body: createTemplate(users)
  });
  await context.github.issues.createComment(issueComment);
  return createStatus(context, false);
}

function createTemplate (users) {
  return users + ' Thanks for your pull request! ' +
    'Looks like this is your first contribution to Gauge. ' +
    'Before we can look at your pull request,' +
    " you'll need to sign our Contributor License Agreement (CLA)." +
    '\n Please visit '+process.env.APP_URL+'cla/ to read and sign it.'
}

async function prCreated (context, recheck) {
  const compare = await context.github.repos.compareCommits(context.repo({
    base: context.payload.pull_request.base.sha,
    head: context.payload.pull_request.head.sha
  }));
  let unsignedUsers = [];
  for (const { author, committer } of compare.data.commits) {
    let authorLogin = author.login;
    let committerLogin = committer.login;
    if (authorLogin !== committerLogin && committerLogin !== 'web-flow') {
      let signed = await data.hasSignedCLA(committerLogin);
      !signed && unsignedUsers.push(committerLogin);
    }
    let signed = await data.hasSignedCLA(authorLogin);
    !signed && unsignedUsers.push(authorLogin);
  }
  return updatePR(context, unsignedUsers, recheck);
}

module.exports = prCreated;
