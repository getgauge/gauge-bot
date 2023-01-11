async function hasLabel(context, issueNumber, label) {
    let config = context.repo({ number: issueNumber });
    let labels = await context.octokit.issues.getIssueLabels(config);
    return Promise.resolve(labels.data.some(l => l.name === label));
}

export async function add(context, issueNumber, label, color) {
    if (await hasLabel(context, issueNumber, label))
        return Promise.resolve();
    try {
        await context.octokit.issues.getLabel(context.repo({ name: label }));
    } catch (error) {
        await context.octokit.issues.createLabel(context.repo({ name: label, color: color }));
    }
    return context.octokit.issues.addLabels(context.repo({ number: issueNumber, labels: [label] }));
}

