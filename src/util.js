module.exports = {
  shouldRecheckPR: function (payload) {
    return payload.comment.body.includes('@gaugebot recheck');
  },

  isPRComment: function (payload) {
    return !!payload.issue.pull_request;
  },

  isBotUser: function(user) {
    return user.includes('[bot]')
  },

  isOrgMember: async function(context, user) {
    let members = await context.octokit.orgs.listMembers({ org: 'getgauge' });
    return members.data.some(member => member.login === user);
  }
};
