'use strict';

// Ubiquiti U-PoE++ adapter
const config = {
  deviceHeight: 34.7,
  deviceWidth: 63.5,
  deviceDepthEnclosed: 25,
  bottomBorderWidth: 5,

  wallThickness: 4,

  numBracketsX: 2,
  numBracketsY: 2,
  bracketWidth: 2,
  bracketDepth: 2,
};

module.exports = require('../../../lib/submodel').exports(require('../ikea-skadis-vertical-device-holder'), config);
