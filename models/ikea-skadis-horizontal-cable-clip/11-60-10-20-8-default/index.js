'use strict';

const config = {
  height: 11,
  width: 60,
  depth: 10,
  holeDistance: 20,
  holeDiameter: 8,
  combineHoles: false,
};

module.exports = require('../../../lib/submodel').exports(require('../ikea-skadis-horizontal-cable-clip'), config);
