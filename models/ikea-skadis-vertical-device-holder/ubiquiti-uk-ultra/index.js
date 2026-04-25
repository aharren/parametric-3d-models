'use strict';

// Ubiquiti UK Ultra / Swiss Army Knife Access Point
const config = {
  deviceHeight: 33.2,
  deviceWidth: 84,
  deviceDepthEnclosed: 29,
  bottomBorderWidth: 20,

  wallThickness: 4,

  numBracketsX: 2,
  numBracketsY: 2,
  bracketWidth: 2,
  bracketDepth: 2,
};

module.exports = require('../../../lib/submodel').exports(require('../ikea-skadis-vertical-device-holder'), config);
