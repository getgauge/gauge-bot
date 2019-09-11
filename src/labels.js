async function hasLabel(context, issueNumber, label) {
    let config = context.repo({ number: issueNumber });
    let labels = await context.github.issues.getIssueLabels(config);
    return Promise.resolve(labels.data.some(l => l.name === label));
}

module.exports = {
    add: async function (context, issueNumber, label, color) {
        if (await hasLabel(context, issueNumber, label)) return Promise.resolve();
        try {
            await context.github.issues.getLabel(context.repo({ name: label }));
        } catch (error) {
            await context.github.issues.createLabel(context.repo({ name: label, color: color }));
        }
        return context.github.issues.addLabels(context.repo({ number: issueNumber, labels: [label] }));
    },

}

