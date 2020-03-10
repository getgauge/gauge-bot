module.exports = {
    claNotice: function (users) {
        return users + ' Thanks for your pull request! ' +
            'Looks like this is your first contribution to Gauge. ' +
            'Before we can look at your pull request,' +
            " you'll need to sign our Contributor License Agreement (CLA)." +
            '\n Please visit ' + process.env.APP_URL + 'cla/ to read and sign it.';
    },

    claVerified: function () {
        return 'This PR has been verified.' +
            ' The gauge team will be looking into this soon.' +
            '\n\n/cc @getgauge/core';
    },
    bumpVersion: function (creator, owner, repo) {
        return `@${creator} Thank you for contributing to ${repo}. Your pull request has been labeled ` +
            `as a release candidate 🎉🎉.\n\n` +
            `Merging this PR will trigger a release.\n\n`+
            `### Please bump up the version as part of this PR.\n\n`+
            `Instructions to bump the version can found at ` +
            `[CONTRIBUTING.md](https://github.com/${owner}/${repo}/blob/master/CONTRIBUTING.md)\n\n` +
            `If the CONTRIBUTING.md file does not exist or does not include instructions about bumping up the ` +
            `version, please looks previous commits in git history to see what changes need to be done.`
    }
}
