'use strict';

const construct = require('../construct');

const vacuumConnectorOrbitalSanderGSS12V13 = {
  plug:
    construct.plug({
      outerDiameterA: 28,
      innerDiameterA: 24,
      distanceAB: 24,
      outerDiameterB: 28,
      heightRingA: 5,
    }),
};

module.exports = {
  vacuumConnectorOrbitalSanderGSS12V13,
};
