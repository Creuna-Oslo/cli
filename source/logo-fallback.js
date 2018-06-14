const gradientString = require('gradient-string');

const gradient = gradientString(['red', 'orange', 'green', 'blue', 'magenta'])
  .multiline;

module.exports = gradient(`
                                        _ _ 
  ___ _ __ ___ _   _ _ __   __ _    ___| (_)
 / __| '__/ _ \\ | | | '_ \\ / _' |  / __| | |
| (__| | |  __/ |_| | | | | (_| | | (__| | |
 \\___|_|  \\___|\\__,_|_| |_|\\__,_|  \\___|_|_|
                                              
    `);
