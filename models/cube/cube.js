'use strict';

const { cube } = require('@jscad/modeling').primitives;
const { align } = require('@jscad/modeling').transforms;

const preview = require('../../lib/preview');

const main = (params) => {
  const object = cube({ size: 50 });
  return align({}, object);
}

module.exports = { ...preview.main({}, main) };
