export const ISSUE_CONTENT_TYPE = "Issue";
export const PR_CONTENT_TYPE = "PullRequest";
export const GAUGE_READY_FOR_DEV_COLUMN_NAME = "Ready for Development";
export async function createSupportCard(context) {
    let p = context.octokit.projects;
    let issueId = context.payload.issue.id;
    let projectID = (await p.listForOrg({ org: "getgauge", state: "open" }))
        .data.find(d => d.name == 'Support').id;
    let raisedColumnID = (await p.listColumns({ project_id: projectID }))
        .data.find(c => c.name == 'Raised').id;
    await p.createCard({ column_id: raisedColumnID, content_id: issueId, content_type: this.ISSUE_CONTENT_TYPE });
}
export async function createProjectCard(context, contentID, contentType, columnName) {
    let p = context.octokit.projects;
    let projects = (await p.listForOrg({ org: "getgauge", state: "open" }))
        .data.filter(d => d.name.startsWith("Gauge+Taiko"));
    for (let project of projects) {
        let raisedColumnID = (await p.listColumns({ project_id: project.id }))
            .data.find(c => c.name == columnName).id;
        await p.createCard({ column_id: raisedColumnID, content_id: contentID, content_type: contentType });
    }
}

