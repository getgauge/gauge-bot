module.exports = {
    createSupportCard: async function (context) {
        let p = context.github.projects
        let issueId = context.payload.issue.id;
        let projectID = (await p.listForOrg({ org: "getgauge", state: "open" })).data[0].id;
        let columnID = (await p.listColumns({ project_id: projectID }))
            .data
            .find((c) => c.name == 'Support')
            .id;
        await p.createCard({column_id: columnID, content_id: issueId, content_type: 'Issue'});
    }
}

