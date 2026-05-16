'use strict';

const { cuboid, cylinder } = require('@jscad/modeling').primitives;
const { union, subtract } = require('@jscad/modeling').booleans;
const { align } = require('@jscad/modeling').transforms;
const { hullChain } = require('@jscad/modeling').hulls;

const hooks = require('../lib/ikea-skadis-hooks');

const grid = require('../../lib/grid');
const config = require('../../lib/config');
const preview = require('../../lib/preview');

const main = (params) => {
  const {
    cupDiameter, cupHeightEnclosed, wallThickness, drainHoleDiameter, closed, segments } = config({
      params,
      defaults: {
        cupDiameter: 58.5,
        cupHeightEnclosed: 64,
        wallThickness: 4,
        drainHoleDiameter: 8,
        closed: true,
        segments: 256,
      },
    });

  const outerCylinderDiameter = cupDiameter + 2 * wallThickness;
  const outerCylinder = grid.at([0, 0, 0], cylinder({ radius: outerCylinderDiameter / 2, height: cupHeightEnclosed, segments }));

  const mountingPlate = grid.at([0, outerCylinderDiameter - wallThickness, 0], cuboid({ size: [outerCylinderDiameter, wallThickness, cupHeightEnclosed] }));
  const outerCylinderWithMountingPlate = closed ? hullChain(outerCylinder, mountingPlate) : union(outerCylinder, mountingPlate);

  const innerCylinder = grid.at([wallThickness, wallThickness, wallThickness], cylinder({ radius: cupDiameter / 2, height: cupHeightEnclosed, segments }));

  const drainHoleCenter = (outerCylinderDiameter - drainHoleDiameter) / 2;
  const drainHole = grid.at([drainHoleCenter, drainHoleCenter, 0], cylinder({ radius: drainHoleDiameter / 2, height: wallThickness, segments }));

  const holder = subtract(
    outerCylinderWithMountingPlate,
    innerCylinder,
    drainHole
  );

  const model = union(
    align({ modes: ['center', 'max', 'max'] }, holder),
    align({ modes: ['center', 'min', 'max'] }, hooks.grid(outerCylinderDiameter, cupHeightEnclosed)),
  );

  return grid.center(model);
};

module.exports = { ...preview.main({ xRay: false }, main), ...config() };
