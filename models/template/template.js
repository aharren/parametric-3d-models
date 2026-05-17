'use strict';

const { cuboid } = require('@jscad/modeling').primitives;

const grid = require('../../lib/grid');
const config = require('../../lib/config');
const preview = require('../../lib/preview');

const main = (params) => {
  const { x, z, y } = config({
    params,
    defaults: {
      x: 10,
      y: 20,
      z: 30,
    },
  });

  const model = cuboid({ size: [x, y, z] });

  return grid.center(model);
}

module.exports = { ...preview.main({ xRay: true, dimensions: true }, main), ...config() };
