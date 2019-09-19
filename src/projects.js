const comments = require('./comments');
const messages = require('./messages');
const excludeRepoForNightlyComment = ['taiko', 'screenshot', 'gauge_screenshot', 'docs.gauge.org', 'gauge.org', 'gocd-yml-config', 'infrastructure', 'gauge-nightly-repository'];

module.exports = {
    ISSUE_CONTENT_TYPE: "Issue",
    PR_CONTENT_TYPE: "PullRequest",
    createSupportCard: async function (context) {
        let p = context.github.projects
        let issueId = context.payload.issue.id;
        let projectID = (await p.listForOrg({ org: "getgauge", state: "open" }))
            .data.find(d => d.name == 'Support').id;
        let raisedColumnID = (await p.listColumns({ project_id: projectID }))
            .data.find(c => c.name == 'Raised').id;
        await p.createCard({ column_id: raisedColumnID, content_id: issueId, content_type: this.ISSUE_CONTENT_TYPE });
    },
    cardMoved: async function(context) {
        if (!context.payload.project_card.content_url) return;
        let matches = context.payload.project_card.content_url.match(/https?:\/\/api\.github\.com\/repos\/(.*)\/(.*)\/issues\/(\d*)/);
        if (!matches || matches.length != 4) return;
        const orgName = matches[1];
        const repoName = matches[2];
        const issueID = matches[3];
        if (excludeRepoForNightlyComment.includes(repoName)) return;
        let columnName = (await context.github.projects.getColumn({column_id: context.payload.project_card.column_id})).data.name;
        if (columnName !== "Testing") return;
        await comments.addComment(context, messages.nightlyComment(), orgName, repoName, issueID);
    },
    createProjectCard: async function (context, contentID, contentType) {
        let p = context.github.projects;
        let projects = (await p.listForOrg({ org: "getgauge", state: "open" }))
            .data.filter(d => d.name.startsWith("Gauge Q"));
        for(let project of projects) {
            let raisedColumnID = (await p.listColumns({ project_id: project.id }))
                .data.find(c => c.name == 'Backlog').id;
            await p.createCard({ column_id: raisedColumnID, content_id: contentID, content_type: contentType });
        }
    }  
}

