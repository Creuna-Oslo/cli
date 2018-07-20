let commands = [
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
  },
  {
    name: 'applyForJob',
    args: '<name>',
    description: 'Apply for a job at Creuna'
  }
];

let supportedCommands = commands.map(item => ({ [item.name]: item.name }));

module.exports = { commands, supportedCommands };
