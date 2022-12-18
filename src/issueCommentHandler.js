import { isPRComment, shouldRecheckPR } from './util';
import { prUpdated } from './prHandler';

export default async (context) => {
  let p = context.payload;
  if (isPRComment(p) && shouldRecheckPR(p)) {
    let pr = await context.octokit.pullRequests.get(context.repo({ number: context.payload.issue.number }));
    context.payload.pull_request = pr.data;
    return prUpdated(context, true);
  }
  return Promise.resolve();
}
