const comments = require('./comments');
const messages = require('./messages');

module.exports = {
    ISSUE_CONTENT_TYPE: "Issue",
    PR_CONTENT_TYPE: "PullRequest",
    GAUGE_READY_FOR_DEV_COLUMN_NAME: "Ready for Development",
    createSupportCard: async function (context) {
        let p = context.github.projects
        let issueId = context.payload.issue.id;
        let projectID = (await p.listForOrg({ org: "getgauge", state: "open" }))
            .data.find(d => d.name == 'Support').id;
        let raisedColumnID = (await p.listColumns({ project_id: projectID }))
            .data.find(c => c.name == 'Raised').id;
        await p.createCard({ column_id: raisedColumnID, content_id: issueId, content_type: this.ISSUE_CONTENT_TYPE });
    },

    createProjectCard: async function (context, contentID, contentType, columnName) {
        let p = context.github.projects;
        let projects = (await p.listForOrg({ org: "getgauge", state: "open" }))
            .data.filter(d => d.name.startsWith("Gauge Q"));
        for(let project of projects) {
            let raisedColumnID = (await p.listColumns({ project_id: project.id }))
                .data.find(c => c.name == columnName).id;
            await p.createCard({ column_id: raisedColumnID, content_id: contentID, content_type: contentType });
        }
    }  
}

