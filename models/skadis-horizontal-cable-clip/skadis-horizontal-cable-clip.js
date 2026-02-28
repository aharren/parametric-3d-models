'use strict';

const { cuboid, cylinder } = require('@jscad/modeling').primitives;
const { union, subtract } = require('@jscad/modeling').booleans;
const { align } = require('@jscad/modeling').transforms;

const hooks = require('../lib/skadis-hooks');

const grid = require('../../lib/grid');
const preview = require('../../lib/preview');

const main = (params) => {
  const height = hooks.sizes.hook.height;
  const width = 60;
  const depth = 10;
  const holeDistance = 20;
  const holeDiameter = 8;
  const combineHoles = false;

  const hole = (width, height) => {
    const cyl = grid.at([0, 0, 0], cylinder({ radius: width / 2, height }));
    const cub = grid.at([0, width / 2, 0], cuboid({ size: [width, width / 2, height] }));
    return union(cyl, cub);
  }

  const base = () => {
    const body = grid.at([0, 0, 0], cuboid({ size: [width, depth, height] }));

    const holes = [];
    holes.push(grid.at([holeDistance, depth - holeDiameter, 0], hole(holeDiameter, height)));
    holes.push(grid.at([width - holeDistance - holeDiameter, depth - holeDiameter, 0], hole(holeDiameter, height)));
    if (combineHoles) {
      holes.push(grid.at([holeDistance + holeDiameter / 2, depth - holeDiameter, 0], cuboid({ size: [width - holeDistance * 2 - holeDiameter, holeDiameter, height] })));
    }

    const object = subtract(
      body,
      holes
    );
    return object;
  };

  const model = union(
    grid.distribute([null, 0, null],
      align({ grouped: true },
        align({ modes: ['center', 'center', 'max'] }, base()),
        align({ modes: ['center', 'center', 'max'] }, hooks.grid(width, height))
      )
    ));
  return model;
}

module.exports = { ...preview.main({ xRay: false }, main) };
