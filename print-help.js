/* eslint-env node */
/* eslint-disable no-console */
/* eslint-disable no-useless-escape */
const chalk = require('chalk');

const blue = chalk.blueBright;
const bold = chalk.bold;
const cyan = chalk.cyan;

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

const printLineCommand = ({ args, name, description }) => {
  const padding = new String(' ').repeat(
    longestCommandLength - (name.length + args.length)
  );

  return ` • ${blue(name)} ${cyan(args)} ${padding}  ${description}\n`;
};

module.exports = function() {
  console.log(`
   ___                        
  / __|_ _ ___ _  _ _ _  __ _ 
 | (__| '_/ -_) || | ' \\/ _' |
  \\___|_| \\___|\\_,_|_||_\\__,_|


${bold('Usage:')} creuna ${blue('<command>')}

${bold('Commands:')}
${commands.map(printLineCommand).join('')}

🌈  All command ${cyan('arguments')} are optional
`);
  process.exit(0);
};
