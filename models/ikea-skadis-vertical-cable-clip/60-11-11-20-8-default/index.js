'use strict';

const config = {
  height: 60,
  width: 11,
  depth: 11,
  holeDistance: 20,
  holeDiameter: 8,
  combineHoles: false,
};

module.exports = require('../../../lib/submodel').exports(require('../ikea-skadis-vertical-cable-clip'), config);
