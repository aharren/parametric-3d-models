'use strict';

const config = {
  height: 11,
  width: 60,
  depth: 11,
  holeDistance: 20,
  holeDiameter: 8,
  combineHoles: true,
};

module.exports = require('../../../lib/submodel').exports(require('../ikea-skadis-horizontal-cable-clip'), config);
