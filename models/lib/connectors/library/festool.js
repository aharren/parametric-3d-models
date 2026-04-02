'use strict';

const construct = require('../construct');

const hoseConnector34 = {
  plug:
    construct.plug({
      outerDiameterA: 34,
      innerDiameterA: 30,
      distanceAB: 30,
      outerDiameterB: 36,
      heightRingA: 10,
    }),
}

module.exports = {
  hoseConnector34,
};
