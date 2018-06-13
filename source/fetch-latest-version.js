const request = require('request');

const configstore = require('./configstore');

function fetchLatestVersion() {
  request(
    {
      url: 'https://registry.npmjs.org/@creuna/cli',
      headers: {
        Accept:
          'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8',
        'Content-Type': 'application/json'
      }
    },
    (error, response, body) => {
      if (error) {
        // NOTE: Noop because we don't really care and there is no graceful fallback
        return;
      }

      try {
        configstore.set('latestVersion', JSON.parse(body)['dist-tags'].latest);
      } catch (error) {
        // NOTE: Noop because we don't really care and there is no graceful fallback
      }
    }
  );
}

module.exports = fetchLatestVersion;
