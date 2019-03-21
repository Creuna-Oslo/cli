const fetch = require('node-fetch');
const prompt = require('@creuna/prompt');

const { jobApplyFail, jobApplySuccess } = require('./messages');

module.exports = (nameArg, contactArg, messageArg) => {
  const { name, contact, message } = prompt({
    name: { text: 'Your name', value: nameArg },
    contact: { text: 'Contact details', value: contactArg },
    message: { text: 'Message', value: messageArg }
  });

  fetch(
    'https://creuna-oslo-job-apply.azurewebsites.net/api/application/JobApplication/',
    {
      method: 'POST',
      body: JSON.stringify({ name, contact, message })
    }
  )
    .then(response => (response.ok ? jobApplySuccess() : jobApplyFail()))
    .catch(jobApplyFail);
};
