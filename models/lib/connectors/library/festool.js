'use strict';

const construct = require('../construct');

const hoseConnector34 = {
  plug:
    construct.plug({
      outerDiameterA: 34,
      outerDiameterB: 36,
      distanceAB: 30,
      innerDiameterA: 30,
      heightRingA: 10,
    }),
}

module.exports = {
  hoseConnector34,
};
