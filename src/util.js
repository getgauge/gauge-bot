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
    console.log(context.github.orgs);
    let members = await context.github.orgs.listMembers({ org: 'getgauge' });
    return members.data.some(member => member.login === user);
  }
};
