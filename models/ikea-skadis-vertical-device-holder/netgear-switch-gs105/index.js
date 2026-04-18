'use strict';

const bracketDepth = 2;

// Netgear Switch GS105
const config = {
  deviceHeight: 29 - bracketDepth, // 29 incl. feet, minus bracketDepth for the feet side
  deviceWidth: 94.3, // 94
  deviceDepthEnclosed: 25,
  bottomBorderWidth: 5,

  wallThickness: 4,

  numBracketsX: 2,
  numBracketsY: 2,
  bracketWidth: 2,
  bracketDepth,
};

module.exports = require('../../../lib/submodel').exports(require('../ikea-skadis-vertical-device-holder'), config);
