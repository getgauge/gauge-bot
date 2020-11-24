module.exports = {
    bumpVersion: function (creator, owner, repo) {
        return `@${creator} Thank you for contributing to ${repo}. Your pull request has been labeled ` +
            `as a release candidate 🎉🎉.\n\n` +

            `Merging this PR will trigger a release.\n\n` +

            `### Please bump up the version as part of this PR.\n\n` +

            `Instructions to bump the version can found at ` +
            `[CONTRIBUTING.md](https://github.com/${owner}/${repo}/blob/master/CONTRIBUTING.md)\n\n` +

            `If the CONTRIBUTING.md file does not exist or does not include instructions about bumping up the ` +
            `version, please looks previous commits in git history to see what changes need to be done.`
    },
    moreInfoInstructions: (creator, owner, repo) => {
        return `@${creator} This issue does not have enough information to debug locally or it
        is missing sections of the issue template.\n\n` +

            `You can read [CONTRIBUTING.md](https://github.com/${owner}/${repo}/blob/master/CONTRIBUTING.md) 
        on how to report with more information.\n\n` +

            `This issue will be closed for now and will be re-opened as soon as
        all the required information is available`
    }
}