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

    nightlyComment: function (date) {
        return 'The fix should be available in nightly >= ' + new Date().toLocaleDateString();
    }
}
