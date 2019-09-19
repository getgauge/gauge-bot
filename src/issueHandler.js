const projects = require('./projects');
const { isOrgMember } = require('./util');

module.exports = async function issueOpened(context) {
  let isMember = await isOrgMember(context, context.payload.issue.user.login);
  if (!isMember) {
    await projects.createSupportCard(context, context.payload.issue.number);
  }
};
