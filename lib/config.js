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
    const directConfig = options.config ? options.config : {};
    const commandLineConfig = options.params.config ? require(path.resolve(options.params.config)) : {};
    return {
      ...options.defaults ?? {},
      ...options.params ?? {},
      ...directConfig,
      ...commandLineConfig,
    };
  }

  return {};
}

module.exports = config;
