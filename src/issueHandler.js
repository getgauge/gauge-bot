const labels = require('./labels');

module.exports = async function issueOpened(context) {
  if (context.payload.issue.author_association == 'NONE') {
    labels.add(context, context.payload.issue.number, 'community', 'e6e6e6');
  }
};
