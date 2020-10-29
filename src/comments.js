module.exports = {
    addComment: async function (context, message, owner, repo, number) {
        const issueComment = { owner: owner, repo: repo, issue_number: number, body: message };
        await context.github.issues.createComment(issueComment);
    }
}