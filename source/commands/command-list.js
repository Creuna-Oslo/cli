let lib = require("./handlers/lib");
let messages = require("../messages");
let createApp = require("./handlers/new");
let getConfig = require("../get-config");
const prompt = require("@creuna/prompt");
const {
  newComponent,
  newPage,
  rename,
  toStateful,
  toStateless
} = require("@creuna/react-scripts");

let compose = (f1, f2) => args => f1(f2(args));

let withConfig = f => (...args) => {
  f("my-config", ...args);
  // getConfig().then(config => f('5', ...args)).catch(() => {
  //   messages.errorReadingConfig();
  //   return;
  // });
};

let mkPrompt = description => arg => () => {
  return prompt({
    name: {
      text: description,
      optional: false,
      value: arg
    }
  });
};

let justValues = l => l.map(o => Object.values(o)[0]);

let serial = funcs =>
  funcs.reduce(
    (promise, func) =>
      promise
        .then(result => func().then(Array.prototype.concat.bind(result)))
        .catch(e => console.log(e)),
    Promise.resolve([])
  );

let withPrompts = prompts => f => (...args) => {
  serial(prompts).then(result => {
    return f(...justValues(result), ...args);
  });
};

let configThenPrompts = prompts =>
  compose(
    withPrompts(prompts),
    withConfig
  );

let commands = [
  {
    name: "new",
    config: [],
    args: ["<path>"],
    description: "Create new project",
    handler: createApp
  },
  {
    name: "lib",
    config: ["<componentsPath>"],
    args: [],
    prompts: [],
    description: "Add a component from the library",
    handler: lib
  },
  {
    name: "component",
    config: ["componentsPath", "eslintConfig"],
    args: ["<name>, <stateful>"],
    prompts: ["New name of component", "stateful"],
    description: "Create new React component",
    handler: (config, name, stateful) =>
      newComponent({
        componentsPath: config.componentsPath,
        eslintConfig: config.eslintConfig,
        pathOrName: name,
        shouldBeStateful: stateful
      })
  },
  {
    name: "page",
    config: [],
    args: ["<name>", "<human-readable-name>"],
    prompts: ["name: ", "human-readable-name"],
    description: "Create new mockup page component",
    handler: (config, name, humanName) => newPage({
        componentName: name,
        eslintConfig: config.eslintConfig,
        humanReadableName: humanName,
        mockupPath: config.mockupPath,
      })
  },
  {
    name: "rename",
    config: [],
    args: ["<old-name>", "<new-name>"],
    prompts: [],
    description: "Rename React component",
    handler: (config, oldName, newName) =>
      rename({
        componentsPath: config.componentsPath,
        eslintConfig: config.eslintConfig,
        pathOrName: oldName,
        newComponentName: newName
      })
  },
  {
    name: "stateful",
    config: ["componentsPath", "eslintConfig"],
    args: ["<component-name>"],
    prompts: ["component name?"],
    description: "Convert React component to stateful",
    handler: (config, componentName) =>
      toStateful({
        componentsPath: config.componentsPath,
        eslintConfig: config.eslintConfig,
        pathOrName: componentName
      })
  },
  {
    name: "stateless",
    config: [],
    args: ["<component-name>"],
    prompts: ["component name:"],
    description: "Convert React component to stateless",
    handler: (config, componentName) =>
      toStateless({
        componentsPath: config.componentsPath,
        eslintConfig: config.eslintConfig,
        pathOrName: componentName
      })
  },
  {
    name: "applyForJob",
    config: [],
    args: ["<name>"],
    prompts: ["first", "second"],
    description: "Apply for a job at Creuna",
    handler: (a, b, c) => console.log("a", a, "b", b, "c", c)
  }
];

let supportedCommands = commands.reduce((acc, current) => {
  return {
    ...acc,
    [current.name]: {
      ...current,
      handler: (...args) => {
        configThenPrompts(
          current.prompts.map((prompt, index) =>
            mkPrompt(prompt).call(this, args[index])
          )
        )(current.handler)(...args);
      }
    }
  };
}, {});

module.exports = { supportedCommands };
