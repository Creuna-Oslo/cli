const appCreator = require('@creuna/create-react-app');
const prompt = require('@creuna/prompt');

const emoji = require('./emoji');

const getNewAppInput = () => {
  return prompt({
    projectName: `${emoji('🚀')} Project name (kebab-case)`,
    authorName: `${emoji('😸')} Your full name`,
    authorEmail: `${emoji('💌')} Your email address`,
    useApiHelper: {
      text: `${emoji('☁️')} Include API-helper?`,
      type: Boolean
    },
    useMessenger: {
      text: `${emoji('💬')} Include message helper for API?`,
      type: Boolean
    },
    useAnalyticsHelper: {
      text: `${emoji('📈')} Include Analytics helper?`,
      type: Boolean
    },
    useResponsiveImages: {
      text: `${emoji('🖼️')} Include responsive images helper?`,
      type: Boolean
    }
  });
};

module.exports = projectPath =>
  appCreator
    .canWriteFiles(projectPath)
    .then(() => getNewAppInput())
    .then(answers =>
      appCreator.writeFiles(Object.assign({}, answers, { projectPath }))
    );
