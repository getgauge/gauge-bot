const util = require('./util')
const { prUpdated } = require('./prHandler');

module.exports = async (context) => {
  let p = context.payload;
  if (util.isPRComment(p) && util.shouldRecheckPR(p)) {
    let pr = await context.github.pullRequests.get(context.repo({ number: context.payload.issue.number }));
    context.payload.pull_request = pr.data;
    return prUpdated(context, true);
  }
  return Promise.resolve();
}
