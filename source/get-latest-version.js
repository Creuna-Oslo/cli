const configstore = require('./configstore');
const fetchLatestVersion = require('./fetch-latest-version');

fetchLatestVersion();

module.exports = configstore.get('latestVersion');
