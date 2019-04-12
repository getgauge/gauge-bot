const labels = require('./labels');
const projects = require('./projects');

async function isOrgMember(context, user) {
  let members = await context.github.orgs.getMembers({ org: 'getgauge' });
  return members.data.some(member => member.login === user);
}

module.exports = async function issueOpened(context) {
  let isMember = await isOrgMember(context, context.payload.issue.user.login);
  if (!isMember) {
    await projects.createSupportCard(context, context.payload.issue.number);
  }
};
