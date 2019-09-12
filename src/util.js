module.exports = {
  shouldRecheckPR: function (payload) {
    return payload.comment.body.includes('@gaugebot recheck');
  },

  isPRComment: function (payload) {
    return !!payload.issue.pull_request;
  },

  isBotUser: function(user) {
    return user.includes('[bot]')
  }
};
