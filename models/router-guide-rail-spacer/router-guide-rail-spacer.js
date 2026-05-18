'use strict';

const { cuboid } = require('@jscad/modeling').primitives;
const { union } = require('@jscad/modeling').booleans;
const { measureDimensions } = require('@jscad/modeling').measurements;

const grid = require('../../lib/grid');
const config = require('../../lib/config');
const preview = require('../../lib/preview');
const visuals = require('../../lib/visuals');

// create a spacer for an aluminium profile guide rail to be used with a router copy ring
const main = (params) => {
  const { space, width } = config({
    params,
    defaults: {
      space: (30 - 8) / 2, // e.g. (router copy ring diameter - router bit diameter) / 2
      width: 20,
    },
  });

  const l0 = space;
  const h0 = 15;

  const l1 = 11;
  const h1 = 4;

  const l2 = 8;
  const h2 = 4;

  const l3 = l1;

  const objects = [];
  objects.push(grid.at([0, 0, h1], cuboid({ size: [l0, width, h0] })));
  objects.push(grid.at([0, 0, 0], cuboid({ size: [l0 + l1 + l2 + l3, width, h1] })));
  objects.push(grid.at([l0 + l1, 0, h1], cuboid({ size: [l2, width, h2] })));

  preview.only(() => {
    objects.push(visuals.dimensions({}, objects[0]));
    objects.push(visuals.dimensions({ modes: ['bottom', 'none', 'none'] }, objects[1]));
    objects.push(visuals.dimensions({ modes: ['bottom', 'none', 'none'] }, grid.at([l0, 0, h1], cuboid({ size: [l1, width, h1] }))));
    objects.push(visuals.dimensions({ modes: ['bottom', 'none', 'right'], mirror: [false, false, true] }, objects[2]));
    objects.push(visuals.dimensions({ modes: ['bottom', 'none', 'none'] }, grid.at([l0 + l1 + l2, 0, h1], cuboid({ size: [l3, width, h1] }))));
    objects.push(visuals.dimensions({ modes: ['none', 'none', 'right'], mirror: [false, false, true] }, union(objects[1], objects[2])));
  });

  return grid.center(objects);
}

module.exports = { ...preview.main({ xRay: false, dimensions: false }, main), ...config() };
