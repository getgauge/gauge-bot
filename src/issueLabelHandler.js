const messages = require('./messages');
const comments = require('./comments');

module.exports = async (context) => {
  if (context.payload.label.name === 'needs-more-info') {
    let creator = context.payload.issue.user.login;
    let owner = context.payload.repository.owner.login;
    let repo = context.payload.repository.name;
    let number = context.payload.issue.number;


    let message = messages.moreInfoInstructions(creator, owner, repo);
    await comments.addComment(context, message, owner, repo, number);
    const params = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      issue_number: context.payload.issue.number
    }
    await context.octokit.issues.update({
      ...params,
      state: 'closed'
    });
  }
};