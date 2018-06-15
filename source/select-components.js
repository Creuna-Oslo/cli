/* eslint-env node */
/* eslint-disable no-console */
const messages = require('./messages');

module.exports = function(componentNames) {
  // Has to be required when called, or else 'shell-select' will initialize early and make everything behave weirdly
  const list = require('select-shell')({
    pointer: ' ➤ ',
    checked: ' ● ',
    unchecked: ' ○ ',
    checkedColor: 'cyan',
    uncheckedColor: 'cyan',
    msgCancel: '',
    multiSelect: true,
    prepend: true
  });

  return new Promise(resolve => {
    messages.emptyLine();
    messages.selectComponents();

    componentNames.forEach(name => {
      list.option(name);
    });

    list.list();

    list.on('select', options => {
      return resolve(options.map(({ text }) => text));
    });

    list.on('cancel', () => {
      messages.emptyLine();
      messages.selectComponentsCancel();
      messages.emptyLine();
      process.exit(0);
    });
  });
};
