'use strict';

const config = {
  deviceHeight: 26.5, // 26
  deviceWidth: 90, // 88
  deviceDepthEnclosed: 29,
  bottomBorderWidth: 19,

  wallThickness: 4,

  numBracketsX: 2,
  numBracketsY: 2,
  bracketWidth: 2,
  bracketDepth: 2,
};

module.exports = require('../../../lib/submodel').exports(require('../ikea-skadis-vertical-device-holder'), config);
