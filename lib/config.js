'use strict';

const path = (() => {
  try {
    return require('path');
  } catch (e) {
    // preview doesn't have path module
    return {
      resolve: (path) => path,
    };
  }
})();

// get configuration from given object's config field
const getConfig = (object) => {
  // no config field, return empty configuration
  if (!object.hasOwnProperty('config')) {
    return {};
  }
  let config = object.config;

  // config is a non-empty string? interpret as module path and load module
  if (typeof config === 'string' && config !== '') {
    config = require(path.resolve(config));
    // fall through
  }

  // take __config field if it exists (used by submodel mechanism)
  if (config.hasOwnProperty('__config') && typeof config.__config === 'object') {
    config = config.__config;
  }

  return config;
};

// get model configuration or define model parameters function
// usage:
//   - const main = (params) => {
//       const { p1, p2, p3 } = config({
//         params,
//         //config: require('<module>'),
//         defaults: {
//           p1: value1,
//           p2: value2,
//           p3: value3,
//         }
//       });
//       ..
//     }
//   - module.exports = { ...config() };
//   - module.exports = { ...config(getParameterDefinitions) };

const config = (options = (() => [])) => {
  // config() or config(getParameterDefinitions)
  if (typeof options === 'function') {
    return {
      getParameterDefinitions: () => {
        return [
          { name: 'config', type: 'string', initial: '', caption: "configuration file" },
          ...options(),
        ];
      }
    }
  }

  // config({ params, config, defaults })
  if (typeof options === 'object') {
    const directConfig = getConfig(options);
    const commandLineConfig = getConfig(options.params);;
    return {
      ...options.defaults ?? {},
      ...directConfig,
      ...commandLineConfig,
      ...options.params ?? {},
    };
  }

  return {};
}

module.exports = config;
