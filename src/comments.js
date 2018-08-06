module.exports = {
    addComment: async function (context, message) {
        const issueComment = context.issue({ body: message });
        await context.github.issues.createComment(issueComment);
    }
}