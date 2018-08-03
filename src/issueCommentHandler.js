const util = require('./util')
const prHandler = require('./prHandler')

module.exports = async function issueCommentHandler (context) {
  let p = context.payload;
  if (util.isPRComment(p) && util.shouldRecheckPR(p)) {
    let pr = await context.github.pullRequests.get(context.repo({ number: context.payload.issue.number }));
    context.payload.pull_request = pr.data;
    return prHandler(context, true);
  }
  return Promise.resolve();
}
