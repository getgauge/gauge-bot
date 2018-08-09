const labels = require('./labels');

async function isOrgMember(context, user) {
  let members = await context.github.orgs.getMembers({ org: 'getgauge' });
  return members.data.some(member => member.login === user);
}

module.exports = async function issueOpened(context) {
  let isMemeber = await isOrgMember(context, context.payload.issue.user.login);
  if (!isMemeber) labels.add(context, context.payload.issue.number, 'community', 'e6e6e6');
};
