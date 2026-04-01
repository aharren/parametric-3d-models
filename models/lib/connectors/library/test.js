'use strict';

const construct = require('../construct');

const o30i25 = {
  plug:
    construct.plug({
      outerDiameterA: 30,
      outerDiameterB: 32,
      distanceAB: 31,
      innerDiameterA: 26,
      heightRingA: 10,
    }),
  socket:
    construct.socket({
      innerDiameterA: 25,
      innerDiameterB: 23,
      distanceAB: 26,
      outerDiameterA: 28,
      heightRingA: 5,
    }),
};

const o57 = {
  plug:
    construct.plug({
      outerDiameterA: 57,
      outerDiameterB: 59,
      distanceAB: 55,
      innerDiameterA: 53,
      heightRingA: 25,
    }),
};

const o50 = {
  socket:
    construct.socket({
      innerDiameterA: 50,
      innerDiameterB: 48,
      distanceAB: 55,
      outerDiameterA: 55,
      heightRingA: 5,
    }),
};

module.exports = {
  o30i25,
  o57,
  o50,
};
