'use strict';

module.exports = {
  exports: (parentModelModuleExports, config) => {
    return {
      // copy parent model's module exports
      ...parentModelModuleExports,

      // redefine main to inject submodel's config via the params array and call parent model's main
      main: (params) => {
        params.config = config;
        return parentModelModuleExports.main(params);
      },

      // add config as __config for direct config
      __config: config,
    };
  },
}
