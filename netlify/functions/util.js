export function shouldRecheckPR(payload) {
    return payload.comment.body.includes('@gaugebot recheck');
}

export function isPRComment(payload) {
    return !!payload.issue.pull_request;
}

export function isBotUser(user) {
    return user.includes('[bot]');
}

export async function isOrgMember(context, user) {
    let members = await context.octokit.orgs.listMembers({ org: 'getgauge' });
    return members.data.some(member => member.login === user);
}
