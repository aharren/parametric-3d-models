'use strict';

const construct = require('./construct');
const library = require('./library');

module.exports = {
  construct: {
    plug: construct.plug,
    socket: construct.socket,
  },
  invert: construct.invert,
  library,
};
