'use strict';

const runningInPreview = typeof process == 'undefined';

// return the given object if running in preview
const inPreviewOnly = (object) => {
  return runningInPreview ? object : null;
};

module.exports = {
  runningInPreview,
  inPreviewOnly,
};
