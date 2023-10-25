const gitLogParser = require("git-log-parser");
const oldParse = gitLogParser.parse;
const { execSync } = require("child_process");
const { wrap } = require("module");

let commitPaths = null;

// Copied from https://github.com/pmowrer/semantic-release-plugin-decorators/blob/master/src/wrapStep.js
// This executes the "stepName" method of all plugins and afterwards executes the "wrapFn" method
const wrapStep = (
  stepName,
  wrapFn,
  { defaultReturn = undefined, wrapperName = "" } = {}
) => {
  const wrapperFn = async function (globalPluginConfig, context) {
    const {
      options: { plugins },
    } = context;

    for (const pluginDefinition of plugins) {
      const [pluginName, pluginConfig] = Array.isArray(pluginDefinition)
        ? pluginDefinition
        : [pluginDefinition, {}];

      if (!pluginName) {
        // Still needed ?
        context.logger.log(`Falsy plugin name at index "${index}"`);
        continue;
      } else if (typeof pluginName !== "string") {
        throw new Error(
          `${
            wrapperName ? wrapperName : "semantic-release-plugin-decorators"
          }: Incorrect plugin name type. Expected string but was ${JSON.stringify(
            pluginName
          )}.`
        );
      }

      const plugin = await import(pluginName);
      const step = plugin && plugin[stepName];

      if (!step) {
        context.logger.log(
          `Plugin "${pluginName}" does not provide step "${stepName}"`
        );
        continue;
      }

      context.logger.log(`Start step "${stepName}" of plugin "${pluginName}"`);

      await step(globalPluginConfig, context);

      context.logger.log(
        `Completed step "${stepName}" of plugin "${pluginName}"`
      );
    }

    return await wrapFn(globalPluginConfig, context);
  };

  Object.defineProperty(wrapperFn, "name", { value: wrapperName });

  return wrapperFn;
};

// Wrapping the verifyConditions step to get the config so we can globally set the commitPaths for the git-log-parser
const verifyConditions = wrapStep(
  "verifyConditions",
  (globalPluginConfig) => {
    commitPaths = globalPluginConfig["commitPaths"];
  },
  {
    wrapperName: "get-commit-paths",
  }
);

gitLogParser.parse = function (config, options) {
  // get the git root and change the cwd so all the commitPaths are relative to the git root
  const newCwd = execSync("git rev-parse --show-toplevel", {
    encoding: "utf-8",
  }).trim();
  const configValue = config["_"];
  const newConfig = {
    _: [configValue, "--", ...commitPaths],
  };
  const newOptions = {
    ...options,
    cwd: newCwd,
  };
  return oldParse(newConfig, newOptions);
};

module.exports = {
  verifyConditions,
};
