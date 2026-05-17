'use strict';

const config = {
  x: 25,
  y: 50,
  z: 75,
};

module.exports = require('../../../lib/submodel').exports(require('../template.js'), config);
