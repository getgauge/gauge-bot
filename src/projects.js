module.exports = {
    createSupportCard: async function (context) {
        let p = context.github.projects
        let issueId = context.payload.issue.id;
        let projectID = (await p.listForOrg({ org: "getgauge", state: "open" }))
            .data.find(d => d.name == 'Support').id;
        let raisedColumnID = (await p.listColumns({ project_id: projectID }))
            .data.find(c => c.name == 'Raised').id;
        await p.createCard({ column_id: raisedColumnID, content_id: issueId, content_type: 'Issue' });
    },
}

