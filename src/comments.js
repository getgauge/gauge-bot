module.exports = {
    addComment: async function (context, message, owner, repo, number) {
        const issueComment = { owner: owner, repo: repo, number: number, body: message };
        await context.github.issues.createComment(issueComment);
    }
}