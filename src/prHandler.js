const labels = require('./labels');
const comments = require('./comments');
const messages = require('./messages');
const data = require('./data')

async function createStatus(context, state, recheck) {
  if (state) {
    const ownerLogin = context.payload.organization.login;
    const repoName = context.payload.repository.name;  
    let number = context.payload.pull_request.number;
    if (recheck) await comments.addComment(context, messages.claVerified(), ownerLogin, repoName, number);
    await labels.add(context, number, 'cla-signed', '1CA50F');
  }
  let status = context.repo({
    state: state ? 'success' : 'failure',
    context: 'verification/cla-signed',
    targetURl: '',
    sha: context.payload.pull_request.head.sha
  })
  return context.github.repos.createStatus(status);
}

async function updateClaStatusForUnsignedUsers(context, unsignedUsers) {
  let users = unsignedUsers.map(u => `@${u}`);
  const ownerLogin = context.payload.organization.login;
  const repoName = context.payload.repository.name;
  let number = context.payload.pull_request.number;
  await comments.addComment(context, messages.claNotice(users.join(', ')), ownerLogin, repoName, number);
  return createStatus(context, false);
}

async function prCreated(context, recheck) {
  let users = await getCommitUsers(context);
  let unsignedUsers = getUnsignedUsers(users);
  if (unsignedUsers && unsignedUsers.length === 0) {
    await createStatus(context, true, recheck);
    return createPullRequestReview(context);
  }
  return updateClaStatusForUnsignedUsers(context, unsignedUsers, recheck)
}

async function createPullRequestReview(context, users) {
  const ownerLogin = context.payload.organization.login;
  const repoName = context.payload.repository.name;
  let reviewTeam = (await context.github.repos.listTeams({owner: ownerLogin, repo: repoName}))
    .data.find(team => team.name == "reviewers");
  if (!reviewTeam) return;
  let members = (await context.github.teams.listMembers({team_id: reviewTeam.id})).data;
  let mem = members.filter(member => !users.includes(member.login));
  let reviewer = mem[Math.floor(Math.random() * mem.length)].login;
  await context.github.pullRequests.createReviewRequest({ 
    owner: ownerLogin, 
    repo: repoName, 
    number: context.payload.pull_request.number, 
    reviewers: [reviewer]
  });
}

async function getUnsignedUsers(users) {
  let unsignedUsers = [];
  for (let user in users) {
    if (!user.includes('[bot]') && !(await data.hasSignedCLA(user))){
      unsignedUsers.push(user);
    }
  }
}

async function getCommitUsers(context) {
  const compare = await context.github.repos.compareCommits(context.repo({
    base: context.payload.pull_request.base.sha,
    head: context.payload.pull_request.head.sha
  }));
  let users = [];
  for (const { author, committer } of compare.data.commits) {
    if (!author || !committer) continue;
    let authorLogin = author.login;
    let committerLogin = committer.login;
    if (authorLogin !== committerLogin && committerLogin !== 'web-flow') {
      if (!users.includes(committerLogin)) users.push(committerLogin);
    }
    if (!users.includes(authorLogin)) users.push(authorLogin);
  }
  return users;
}

module.exports = prCreated;
