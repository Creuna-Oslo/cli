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

const errorReadingConfig = () => {
  console.log(
    `${emoji('😱', '×')} ${chalk.redBright(
      'Error reading configuration file'
    )} ${chalk.blueBright('.creunarc.json')}${chalk.redBright(
      '. See https://github.com/Creuna-Oslo/cli'
    )}`
  );
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

const help = commands => {
  const printLineCommand = commands => ({ args, name, description }) => {
    const longestCommandLength = commands =>
      commands.reduce(
        (accum, { args, name }) =>
          Math.max(accum, name.length + args.join(' ').length),
        0
      );

    const padding = new String(' ').repeat(
      longestCommandLength(commands) - (name.length + args.join(' ').length)
    );

    return `${emoji('👉', '•')} ${blue(name)} ${cyan(
      args.join(' ')
    )} ${padding}  ${description}\n`;
  };

  let cs = Object.values(commands);
  termImg(path.join(__dirname, 'creuna.png'), {
    fallback: () => {
      console.log(logoFallback);
    }
  });
  emptyLine();
  console.log(`${bold('Usage:')} creuna ${blue('<command>')}\n`);
  console.log(bold('Commands:'));
  console.log(cs.map(printLineCommand(cs)).join(''));
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
  console.log(`${emoji('🕵')} Searching for components`);
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

const tooManyArguments = args => {
  console.log('ARGH', args);
  console.log(`Too many arguments: `, args.length);
};

const tooFewArguments = args => {
  console.log('Too few arguments: ', args.length);
};

const expectingExactArguments = numberOfArgs => {
  console.log('expecting exactly ', numberOfArgs, ' arguments');
};

module.exports = {
  componentAlreadyExists,
  componentsAdded,
  downloadingComponents,
  emptyLine,
  error,
  errorReadingConfig,
  expectingExactArguments,
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
  tooFewArguments,
  tooManyArguments,
  unrecognizedCommand,
  version,
  versionConflict,
  writingFiles
};
