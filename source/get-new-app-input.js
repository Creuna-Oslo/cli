const prompt = require('@creuna/prompt');

const emoji = require('./emoji');

module.exports = function() {
  return prompt({
    projectName: {
      text: `${emoji('🚀')} Project name (kebab-case)`
    },
    authorName: {
      text: `${emoji('😸')} Your full name`
    },
    authorEmail: {
      text: `${emoji('💌')} Your email address`
    },
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
