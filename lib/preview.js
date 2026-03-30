'use strict';

const { toArray } = require('./arrays');
const { xRay, dimensions } = require('./visuals');
const { runningInPreview } = require('./internals/environment');

// apply visual effects like x-ray in preview
// usage: module.exports = { ...preview.main( {}, main) };
//        module.exports = { ...preview.main( { xRay: false, ... }, main) };
const main = (settings, main) => {
  const fn = (params) => {
    // create objects via real main
    let originalObjects = toArray(main(params));

    // if not running in preview, just return the original objects
    if (!runningInPreview) {
      return originalObjects;
    }

    let objects = [...originalObjects];

    // apply x-ray to all objects
    if (settings.xRay ?? true) {
      objects = (() => {
        const objectsWithXRay = [];
        objects.forEach(object => {
          objectsWithXRay.push(...xRay({}, object));
        });
        return objectsWithXRay;
      })();
    }

    // add dimensions markers
    if (settings.dimensions ?? true) {
      originalObjects.forEach(object => {
        objects.push(...dimensions({}, object));
      });
    }

    return objects;
  }

  return {
    main: fn
  };
}

// return the given object if running in preview
const only = (object) => {
  return runningInPreview ? object : null;
};

module.exports = {
  main,
  only,
};
