export async function addComment(context, message, owner, repo, number) {
    const issueComment = { owner: owner, repo: repo, issue_number: number, body: message };
    await context.octokit.issues.createComment(issueComment);
}