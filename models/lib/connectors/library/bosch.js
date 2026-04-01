'use strict';

const construct = require('../construct');

const vacuumConnectorOrbitalSanderGSS12V13 = {
  plug:
    construct.plug({
      outerDiameterA: 28,
      outerDiameterB: 28,
      distanceAB: 24,
      innerDiameterA: 24,
      heightRingA: 5,
    }),
};

module.exports = {
  vacuumConnectorOrbitalSanderGSS12V13,
};
