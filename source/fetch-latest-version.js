const canConnect = require('./can-connect');
const checkVersion = require('./check-version');
const configstore = require('./configstore');

async function fetchLatestVersion() {
  const request = require('request');

  const canConnectToNPM = await canConnect('registry.npm.org');

  if (!canConnectToNPM) {
    return;
  }

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
        configstore.set('latestVersion', JSON.parse(body)['dist-tags'].latest);
        checkVersion();
      } catch (error) {
        // NOTE: Noop because we don't really care and there is no graceful fallback
      }
    }
  );
}

module.exports = fetchLatestVersion;
