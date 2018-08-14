const comments = require('./comments');
const messages = require('./messages');

const excludeRepoForNightlyComment = ['taiko', 'screenshot', 'gauge_screenshot'];

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

    onLabelAdded: async function (context) {
        if (excludeRepoForNightlyComment.includes(context.payload.repository.name)) return;
        if (context.payload.label.name === 'ready for QA') {
            await comments.addComment(context, messages.nightlyComment());
        }
    }
}

