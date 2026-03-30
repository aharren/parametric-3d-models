'use strict';

const { primitives, booleans, transforms, measurements, geometries, extrusions, utils, hulls } = require('@jscad/modeling');
const { vectorText } = require('@jscad/modeling').text;

const arrays = require('./arrays');
const colors = require('./colors');
const grid = require('./grid');
const { runningInPreview, inPreviewOnly } = require('./internals/environment');

const lineThicknessThin = 0.1;

const visualColorAlphaMarker = 0.999;
const defaultVisualColor = [0, 0, 0];

// mark the given object as being a visual object
const markAsVisual = (object) => {
  if (!object.hasOwnProperty('color')) {
    object.color = defaultVisualColor;
  }
  object.color[3] = visualColorAlphaMarker;
  return object;
}

// returns true if the given object is a marked visual object
const isVisual = (object) => {
  if (!object.hasOwnProperty('color')) {
    return false;
  }
  if (!object.color.hasOwnProperty(3)) {
    return false;
  }
  return object.color[3] == visualColorAlphaMarker;
}

// cut the given object into halves and make one half transparent
const xRay = (options, obj) => {
  if (!runningInPreview) {
    // don't modify the object in non-preview
    return [obj];
  }

  const objectCenter = measurements.measureCenter(obj);
  const objectDimensions = measurements.measureDimensions(obj);

  // create aligned bounding boxes for the halves
  const cut1 = transforms.align({ modes: ['center', 'max', 'center'], relativeTo: objectCenter }, primitives.cuboid({ size: [objectDimensions[0] + 1, objectDimensions[1] + 1, (objectDimensions[2] + 1) * 2] }));
  const cut2 = transforms.align({ modes: ['center', 'min', 'center'], relativeTo: objectCenter }, primitives.cuboid({ size: [objectDimensions[0] + 1, objectDimensions[1] + 1, (objectDimensions[2] + 1) * 2] }));

  // cut the original object
  const half1 = booleans.intersect(cut1, obj);
  const half2 = booleans.intersect(cut2, obj);

  // copy color
  if (obj.color) {
    half1.color = obj.color;
    half2.color = obj.color;
  }

  return [colors.transparent(half1), half2];
}

// render the given text as a 3D object
const text = (options, txt) => {
  const height = options.height ?? 1.5;
  const center = options.center ?? [0, 0, 0];

  const segments = vectorText({ height }, String(txt));
  const corner = primitives.circle({ radius: lineThicknessThin })
  const geoms = segments.map(segment => {
    const corners = segment.map((point) => {
      return transforms.translate(point, corner);
    })
    return hulls.hullChain(corners);
  });
  const geoms3D = geoms.map(geom => {
    return extrusions.extrudeLinear({ height: lineThicknessThin }, geom);
  });
  const geom3D = booleans.union(geoms3D);
  return transforms.center({ axes: [true, true, false], relativeTo: center }, geom3D);
}

// render a 3D line with the given points
const line = (options, start, end) => {
  const height = options.height ?? lineThicknessThin;
  const size = options.size ?? lineThicknessThin;

  const geom = geometries.path2.fromPoints({}, [start ?? [0, 0], end ?? [0, 0]]);
  const line3D = extrusions.extrudeRectangular({ height, size }, geom);
  return line3D;
}

// create a length marker line |<---->|
const lengthMarkerLine = (options, length) => {
  const leftK = booleans.union(
    line({}, [-length / 2, 0], [-length / 2, -4]),
    line({}, [-length / 2, -2], [-length / 2 + 1, -1]),
    line({}, [-length / 2, -2], [-length / 2 + 1, -3])
  );
  const rightK = booleans.union(
    line({}, [length / 2, 0], [length / 2, -4]),
    line({}, [length / 2, -2], [length / 2 - 1, -1]),
    line({}, [length / 2, -2], [length / 2 - 1, -3])
  );
  const middle = line({}, [-length / 2, -2], [length / 2, -2]);

  return booleans.union(
    leftK,
    rightK,
    middle
  )
}

// create a length marker text
const lengthMarkerText = (options, length) => {
  return text({ center: [0, -5, 0] }, Number.parseFloat(length).toFixed(2));
}

// create three length marker lines and texts for the dimensions of the given object
const dimensions = (options, obj) => {
  const modes = arrays.extendTo3D(options.modes ?? ['default']);
  const dim = measurements.measureDimensions(obj);
  const bounds = measurements.measureBoundingBox(obj);

  const distance = 2;
  const objects = [];
  if (modes[0] === 'default') {
    objects.push(transforms.align({ grouped: true, modes: ['center', 'max', 'max'], relativeTo: [(bounds[0][0] + bounds[1][0]) / 2, bounds[0][1] - distance, bounds[0][2]] }, lengthMarkerLine({}, dim[0]), lengthMarkerText({}, dim[0])));
  }
  if (modes[1] === 'default') {
    objects.push(transforms.align({ grouped: true, modes: ['max', 'center', 'max'], relativeTo: [bounds[0][0] - distance, (bounds[0][1] + bounds[1][1]) / 2, bounds[0][2]] }, transforms.rotateZ(utils.degToRad(-90), lengthMarkerLine({}, dim[1]), lengthMarkerText({}, dim[1]))));
  }
  if (modes[2] === 'default') {
    objects.push(transforms.align({ grouped: true, modes: ['max', 'max', 'center'], relativeTo: [bounds[0][0] - distance, bounds[0][1] - distance, (bounds[0][2] + bounds[1][2]) / 2] }, transforms.rotate([0, utils.degToRad(90), utils.degToRad(-45)], lengthMarkerLine({}, dim[2]), lengthMarkerText({}, dim[2]))));
  }

  return markAsVisual(colors.black(booleans.union(objects)));
}

const main = (params) => {
  const objects = grid.distribute([20, null, null], [
    colors.red(transforms.align({}, primitives.cube({ size: 40 }))),
    colors.green(transforms.align({}, primitives.cube({ size: 30 }))),
    colors.blue(transforms.align({}, primitives.cube({ size: 20 })))
  ]);

  const numObjects = objects.length;

  // add dimensions markers
  objects[numObjects + 0] = dimensions({}, objects[0]);
  objects[numObjects + 1] = dimensions({ modes: ['default', 'none'] }, objects[1]);
  objects[numObjects + 2] = dimensions({ modes: ['default', 'none', 'default'] }, objects[2]);

  // add x-ray
  objects[2] = xRay({}, objects[2]);

  // check for marked visual object
  objects.push(colors.black(text({ center: [0, -45, 0] }, `${isVisual(objects[numObjects + 1])}, ${objects[numObjects + 1].color}`)));
  objects[numObjects + 1].color = isVisual(objects[numObjects + 1]) ? [0, 0.75, 0, 1] : [0.75, 0, 0, 1];

  return objects;
}

module.exports = {
  ...inPreviewOnly({ main }),
  line,
  text,
  xRay,
  dimensions,
  markAsVisual,
  isVisual,
};
