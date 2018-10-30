const os = require('os');
const prompt = require('@creuna/prompt');

const messages = require('./messages');
const configStore = require('./configstore');

const storageKeys = {
  id: 'gitHubId',
  secret: 'gitHubSecret'
};

const getGitHubClient = () =>
  new Promise((resolve, reject) => {
    const github = require('octonode');
    const secret = configStore.get(storageKeys.secret);

    if (secret) {
      const client = github.client(secret);

      // Make request to github to verify credentials
      client.get('', error => {
        if (error) {
          configStore.delete(storageKeys.id);
          configStore.delete(storageKeys.secret);
          reject(
            'Failed to log in. You have been logged out. Please try logging in again.'
          );
          return;
        }

        resolve(client);
      });

      return;
    }

    const { shouldLogIn } = prompt({
      shouldLogIn: {
        text: 'Log in to GitHub?',
        type: Boolean
      }
    });

    if (!shouldLogIn) {
      resolve(github.client());
      return;
    }

    const { username, password, otp } = prompt({
      username: 'Username',
      password: { text: 'Password', obfuscate: true },
      otp: '2 factor authentication code'
    });

    const tokenName = `creuna-cli_${os.hostname()}`;

    github.auth.config({ username, password, otp }).login(
      {
        scopes: ['public_repo'],
        note: tokenName
      },
      (error, id, token) => {
        if (error) {
          configStore.delete(storageKeys.id);
          configStore.delete(storageKeys.secret);

          messages.gitHubLoginError(tokenName);
          reject(error);
          return;
        }

        // According to the octonode docs, both the 'id' and the 'secret' are needed to authenticate the client in order to increase rate limits. In practice, this seemed not to work, but authenticating the client using only the 'secret' seems to work. The 'id' is kept in storage in case it's needed in the future. (it seems this response is the only time this 'id' is accessible ever, and if it turns out we need it after all, everyone would have to manually delete the 'creuna-cli' token from their accounts and log in again).
        configStore.set(storageKeys.id, String(id));
        configStore.set(storageKeys.secret, String(token));

        return resolve(github.client(secret));
      }
    );
  });

module.exports = {
  getGitHubClient,
  storageKeys
};
