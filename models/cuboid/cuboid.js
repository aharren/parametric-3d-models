'use strict';

const { cuboid } = require('@jscad/modeling').primitives;
const { align } = require('@jscad/modeling').transforms;

const preview = require('../../lib/preview');

const main = (params) => {
  const object = cuboid({ size: [50, 40, 30] });
  return align({}, object);
}

module.exports = { ...preview.main({}, main) };
