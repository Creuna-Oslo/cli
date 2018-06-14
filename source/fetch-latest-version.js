const request = require('request');
const semver = require('semver');

const configstore = require('./configstore');
const currentVersion = require('./get-this-version');

function fetchLatestVersion(onNewVersion) {
  request(
    {
      url: 'https://registry.npmjs.org/@creuna/cli',
      headers: {
        Accept: 'application/vnd.npm.install-v1+json'
      }
    },
    (error, response, body) => {
      if (error || response.statusCode < 200 || response.statuscode >= 400) {
        // NOTE: Noop because we don't really care and there is no graceful fallback
        return;
      }

      try {
        const latestVersion = JSON.parse(body)['dist-tags'].latest;
        configstore.set('latestVersion', latestVersion);

        if (
          typeof onNewVersion === 'function' &&
          semver.gt(latestVersion, currentVersion)
        ) {
          onNewVersion(latestVersion);
        }
      } catch (error) {
        // NOTE: Noop because we don't really care and there is no graceful fallback
      }
    }
  );
}

module.exports = fetchLatestVersion;
