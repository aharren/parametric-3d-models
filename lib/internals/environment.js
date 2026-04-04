'use strict';

const runningInPreview = typeof process == 'undefined';

// return the given object if running in preview
const inPreviewOnly = (object) => {
  if (typeof object === "function") {
    return runningInPreview ? object() : null;
  }
  return runningInPreview ? object : null;
};

module.exports = {
  runningInPreview,
  inPreviewOnly,
};
