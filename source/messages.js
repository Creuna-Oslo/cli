/* eslint-env node */
/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');
const termImg = require('term-img');

const logoFallback = require('./logo-fallback');

const blue = chalk.blueBright;
const bold = chalk.bold;
const cyan = chalk.cyan;

const errorReadingConfig = () => {
  console.log(
    `😱  ${chalk.redBright(
      'Error reading configuration file'
    )} ${chalk.blueBright('.creunarc.json')}${chalk.redBright(
      '. See https://github.com/Creuna-Oslo/cli'
    )}`
  );
};

const commands = [
  {
    name: 'new',
    args: '<path>',
    description: 'Create new project'
  },
  {
    name: 'lib',
    args: '',
    description: 'Add a component from the library'
  },
  {
    name: 'component',
    args: '<name>',
    description: 'Create new React component'
  },
  {
    name: 'page',
    args: '<name>',
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

const componentAlreadyExists = componentName => {
  console.log(
    `☠️  ${componentName} ${chalk.redBright('already exists. Skipping.')}`
  );
};

const componentsAdded = () => {
  console.log('🎉  Components added!');
};

const downloadingComponents = () => {
  console.log('⬇️  Downloading components');
};

const emptyLine = () => {
  console.log('');
};

const printLineCommand = ({ args, name, description }) => {
  const padding = new String(' ').repeat(
    longestCommandLength - (name.length + args.length)
  );

  return `👉  ${blue(name)} ${cyan(args)} ${padding}  ${description}\n`;
};

const gitHubReadError = () => {
  console.log(
    `🙀  ${chalk.redBright("Oh no! Couldn't get files!")}
This likely means that the hourly GitHub API quota has been exceeded.
You should let ${chalk.blueBright('asbjorn.hegdahl@creuna.no')} know ASAP.`
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
  console.log(`🌈  All command ${cyan('<arguments>')} are optional\n`);
};

const missingFile = () => {
  console.log(chalk.redBright('⁉️  Missing file'));
};

const noComponentsToWrite = () => {
  console.log(`😐  ${chalk.redBright('No components to write. Exiting')}`);
};

const searchingForComponents = () => {
  console.log('🕵  Searching for components');
};

const noComponentsSelected = () => {
  console.log(chalk.redBright('No components selected. Exiting.'));
};

const selectComponents = () => {
  console.log(chalk.bold('Select components'));
  console.log(chalk.dim('Spacebar to select, ESC to abort\n'));
};

const selectComponentsCancel = () => {
  console.log(chalk.redBright('Cancelled. Exiting.'));
};

const unrecognizedCommand = command => {
  console.log(`😱  Unrecognized command "${chalk.redBright(command)}".`);
};

const version = versionNumber => {
  console.log(versionNumber);
};

const versionConflict = (currentVersion, latestVersion) => {
  console.log(
    `🦄  ${chalk.greenBright(
      `You are using version ${chalk.blueBright(
        currentVersion
      )}, but the latest version is ${chalk.blueBright(latestVersion)}.`
    )}`
  );
  console.log(
    `👩‍💻  Run ${chalk.blueBright('yarn global add @creuna/cli')} or ${chalk.cyan(
      'npm i -g @creuna/cli'
    )} to get the latest version.`
  );
};

const writingFiles = () => {
  console.log('💾  Writing files');
};

module.exports = {
  componentAlreadyExists,
  componentsAdded,
  downloadingComponents,
  emptyLine,
  errorReadingConfig,
  gitHubReadError,
  help,
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
