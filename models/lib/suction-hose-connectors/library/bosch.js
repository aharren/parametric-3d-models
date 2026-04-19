'use strict';

const construct = require('../construct');

const OrbitalSander_GSS12V13_O28 = {
  plug:
    construct.plug({
      outerDiameterA: 28,
      innerDiameterA: 24,
      distanceAB: 24,
      outerDiameterB: 28,
      heightRingA: 5,
    }),
};

const MiterSaw_GCM8SJL_I45 = {
  socket:
    construct.socket({
      outerDiameterA: 47,
      innerDiameterA: 46.5,
      distanceAB: 25,
      innerDiameterB: 45,
      heightRingA: 5,
    }),
};

module.exports = {
  OrbitalSander_GSS12V13_O28,
  MiterSaw_GCM8SJL_I45,
};
