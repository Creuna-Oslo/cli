const github = require('octonode');
const prompt = require('@creuna/prompt');

const configStore = require('./configstore');

const storageKeys = {
  id: 'gitHubId',
  secret: 'gitHubSecret'
};

module.exports = () =>
  new Promise(async (resolve, reject) => {
    const id = configStore.get(storageKeys.id);
    const secret = configStore.get(storageKeys.secret);
    console.log(id, secret);

    if (!id || !secret) {
      const { username, password, otp } = await prompt({
        username: {
          text: 'Username'
        },
        password: {
          text: 'Password'
        },
        otp: {
          text: 'One Time Password'
        }
      });

      github.auth.config({ username, password, otp }).login(
        {
          scopes: ['repo'],
          note: 'script'
        },
        (error, id, token) => {
          if (error) {
            reject(error);
            return;
          }

          if (!id || !token) {
            reject('Auth failed');
            return;
          }

          console.log(configStore.get('test'));
          configStore.set(storageKeys.id, id);
          configStore.set(storageKeys.secret, token);
          console.log(configStore.get(storageKeys.id));
          console.log(configStore.get(storageKeys.secret));

          const client = github.client({ id, secret });
          const repo = client.repo('Creuna-Oslo/react-components');

          return resolve({ client, repo });
        }
      );

      return;
    }

    const client = github.client({ id, secret });
    const repo = client.repo('Creuna-Oslo/react-components');

    resolve({ client, repo });
  });
