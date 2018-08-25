/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');
const termImg = require('term-img');

const emoji = require('./emoji');
const logoFallback = require('./logo-fallback');

const blue = chalk.blueBright;
const bold = chalk.bold;
const cyan = chalk.cyan;

const commands = [
  {
    name: 'new',
    args: '<relative-path>',
    description: 'Create new project in current directory'
  },
  {
    name: 'lib',
    args: '',
    description: 'Add a component from the library'
  },
  {
    name: 'logout',
    args: '',
    description: 'Remove local GitHub credentials'
  },
  {
    name: 'component',
    args: '<name>',
    description: 'Create new React component'
  },
  {
    name: 'page',
    args: '<name> <human-readable-name>',
    description: 'Create new mockup page component'
  },
  {
    name: 'rename',
    args: '<old-name> <new-name>',
    description: 'Rename React component'
  },
  {
    name: 'stateful',
    args: '<component-name>',
    description: 'Convert React component to stateful'
  },
  {
    name: 'stateless',
    args: '<component-name>',
    description: 'Convert React component to stateless'
  }
];

const longestCommandLength = commands.reduce(
  (accum, { args, name }) => Math.max(accum, name.length + args.length),
  0
);

const clearedGitHubCredentials = () => {
  console.log('GitHub credentials removed');
};

const componentAlreadyExists = componentName => {
  console.log(
    `${emoji('☠️', '×')} ${componentName} ${chalk.redBright(
      'already exists. Skipping.'
    )}`
  );
};

const componentsAdded = () => {
  console.log(`${emoji('🎉', '♥')} Components added!`);
};

const downloadingComponents = () => {
  console.log(`${emoji('⬇️')}  Downloading components`);
};

const emptyLine = () => {
  console.log('');
};

const error = text => {
  emptyLine();
  console.log(`${emoji('❌', '✖︎')} ${chalk.redBright(text)}`);
  emptyLine();
};

const messageList = messages => {
  messages.forEach(message => {
    console.log(`${emoji(message.emoji)} ${message.text}`);
  });
};

const printLineCommand = ({ args, name, description }) => {
  const padding = new String(' ').repeat(
    longestCommandLength - (name.length + args.length)
  );

  return `${emoji('👉', '•')} ${blue(name)} ${cyan(
    args
  )} ${padding}  ${description}\n`;
};

const connectingToGitHub = () => {
  console.log(`${emoji('🌎')} Connecting go GitHub...`);
};

const githubRateLimitExceeded = resetTime => {
  const resetTimeMs = resetTime * 1000;
  const remainingMinutes = Math.round(
    (resetTimeMs - new Date().getTime()) / (1000 * 60)
  );
  const sparkleRainbow5000 =
    emoji('✨') +
    chalk.redBright('5') +
    chalk.yellowBright('0') +
    chalk.greenBright('0') +
    chalk.cyan('0') +
    emoji('✨');

  console.log(
    `${emoji('😭', '×')} ${chalk.redBright(
      'Uh oh! GitHub API usage limit exceeded.'
    )}

${chalk.bold('Here are some things you can do:')}
• Run ${chalk.cyan(
      'creuna lib'
    )} again and log in to Github. This will increase your API usage limit from 60 to ${sparkleRainbow5000} requests per hour.
• Download components directly from ${chalk.cyan(
      'https://github.com/Creuna-Oslo/react-components'
    )}
• Try again in ${remainingMinutes} minutes.

The 60 requests per hour limit is shared between all non-authenticated users on the same network.\n`
  );
};

const gitHubLoginError = tokenName => {
  error(`Failed to log in. Things to try:
• Try again! You might've had a typo.
• If you have previously logged in on this computer, try going to ${chalk.blueBright(
    'https://github.com/settings/tokens'
  )} and deleting the token called ${chalk.cyan(tokenName)}`);
};

const gitHubReadError = error => {
  console.log(
    `${emoji('🙀', '×')} ${chalk.redBright("Oh no! Couldn't get files!")}
You should let ${chalk.blueBright(
      'asbjorn.hegdahl@creuna.no'
    )} know ASAP.\n${error}`
  );
};

const gitHubRequestTimeout = () => {
  console.log(
    `${emoji('😩', '×')} ${chalk.redBright(
      "Couldn't connect to GitHub. Make sure you're connected to the interwebs!"
    )}`
  );
};

const help = () => {
  termImg(path.join(__dirname, 'creuna.png'), {
    fallback: () => {
      console.log(logoFallback);
    }
  });
  emptyLine();
  console.log(`${bold('Usage:')} creuna ${blue('<command>')}\n`);
  console.log(bold('Commands:'));
  console.log(commands.map(printLineCommand).join(''));
  console.log(
    `${emoji('🌈', '♥')} All command ${cyan('<arguments>')} are optional\n`
  );
};

const missingFile = () => {
  console.log(chalk.redBright(`${emoji('⁉️', '×')} Missing file`));
};

const noComponentsToWrite = () => {
  console.log(
    `${emoji('😐', '×')} ${chalk.redBright('No components to write. Exiting')}`
  );
};

const searchingForComponents = () => {
  console.log(`${emoji('🕵')} Searching for components...`);
};

const noComponentsSelected = () => {
  console.log(chalk.redBright('No components selected. Exiting.'));
};

const selectComponents = () => {
  console.log(chalk.bold('Select components'));
  console.log(
    `Use ${blue('[Spacebar]')} to select and deselect, ${blue(
      '[Enter]'
    )} to download selected, ${blue('[ESC]')} to abort\n`
  );
};

const selectComponentsCancel = () => {
  console.log(chalk.redBright('Cancelled. Exiting.'));
};

const unrecognizedCommand = command => {
  console.log(
    `${emoji('😱', '×')} Unrecognized command "${chalk.redBright(command)}".`
  );
};

const version = versionNumber => {
  console.log(versionNumber);
};

const versionConflict = (currentVersion, latestVersion) => {
  console.log(
    `${emoji('🦄', '︎︎♥')} ${chalk.greenBright(
      `You are using version ${chalk.blueBright(
        currentVersion
      )}, but the latest version is ${chalk.blueBright(latestVersion)}.`
    )}`
  );
  console.log(
    `${emoji('👩‍💻')} Run ${chalk.blueBright(
      'yarn global add @creuna/cli'
    )} or ${chalk.cyan('npm i -g @creuna/cli')} to get the latest version.`
  );
};

const writingFiles = () => {
  console.log(`${emoji('💾')} Writing files`);
};

module.exports = {
  clearedGitHubCredentials,
  componentAlreadyExists,
  componentsAdded,
  connectingToGitHub,
  downloadingComponents,
  emptyLine,
  error,
  gitHubLoginError,
  githubRateLimitExceeded,
  gitHubReadError,
  gitHubRequestTimeout,
  help,
  messageList,
  missingFile,
  noComponentsSelected,
  noComponentsToWrite,
  searchingForComponents,
  selectComponents,
  selectComponentsCancel,
  unrecognizedCommand,
  version,
  versionConflict,
  writingFiles
};
