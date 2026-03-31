'use strict';

const { rotate, translate, align, mirrorZ } = require('@jscad/modeling').transforms;
const { degToRad } = require('@jscad/modeling/src').utils;

const { tubeElliptic, tubeCurved } = require('../../lib/tubes');
const visuals = require('../../lib/visuals');
const preview = require('../../lib/preview');

const connectors = require('../lib/connectors');

const main = (params) => {
  const connectTo1 = connectors.bosch.vacuumConnectorOrbitalSanderGSS12V13.plug;
  const connectTo2 = connectors.festool.hoseConnector34.plug;
  //const connectTo1 = connectors.test.o30i25.plug;
  //const connectTo2 = connectors.test.o30i25.socket;

  const bendAngle = degToRad(30);
  const wallThickness = 2;
  const segments = 64;

  const connector = (c) => {
    const r = {};
    r.outerRadiusA = c.isPlug ? c.outerDiameterA / 2 + wallThickness : c.innerDiameterA / 2;
    r.innerRadiusA = r.outerRadiusA - wallThickness;
    r.outerRadiusB = c.isPlug ? c.outerDiameterB / 2 + wallThickness : c.innerDiameterB / 2;
    r.innerRadiusB = r.outerRadiusB - wallThickness;
    r.distanceAB = c.distanceAB;
    r.outerRadiusRingA = c.isPlug ? c.outerDiameterA / 2 + wallThickness : c.outerDiameterA / 2;
    r.innerRadiusRingA = c.isPlug ? c.innerDiameterA / 2 : c.innerDiameterA / 2 - wallThickness;
    r.heightRingA = c.heightRingA ?? 5;
    return r;
  }
  const connector1 = connector(connectTo1);
  const connector2 = connector(connectTo2);

  const bendOuterRadius = Math.min(connector1.outerRadiusRingA, connector2.outerRadiusRingA);
  const bendInnerRadius = Math.min(connector1.innerRadiusRingA, connector2.innerRadiusRingA);
  const bendCurveRadius = bendOuterRadius * 2;

  const segmentBA = (c, mirror) => {
    const tube = {
      startOuterRadius: c.outerRadiusB,
      startInnerRadius: c.innerRadiusB,
      endOuterRadius: c.outerRadiusA,
      endInnerRadius: c.innerRadiusA,
      height: c.distanceAB,
    };

    const objects = [];
    objects.push(tubeElliptic({ ...tube, segments }));

    objects.push(preview.only(visuals.dimensions({ modes: ['none', 'none', 'right'], distance: [2, 7.5], dimensions: [0, 0, tube.height], mirror: [false, false, !mirror] }, objects[0])));
    objects.push(preview.only(visuals.dimensions({ modes: ['bottom', 'none', 'none'], distance: 7.5, dimensions: [tube.startOuterRadius * 2, 0, 0] }, objects[0])));
    objects.push(preview.only(visuals.dimensions({ modes: ['bottom', 'none', 'none'], distance: 2, dimensions: [tube.startOuterRadius * 2, 0, 0], types: 'guards' }, objects[0])));
    objects.push(preview.only(visuals.dimensions({ modes: ['bottom', 'none', 'none'], distance: 2, dimensions: [tube.startInnerRadius * 2, 0, 0] }, objects[0])));
    objects.push(preview.only(visuals.dimensions({ modes: ['top', 'none', 'none'], distance: 7.5, dimensions: [tube.endOuterRadius * 2, 0, 0] }, objects[0])));
    objects.push(preview.only(visuals.dimensions({ modes: ['top', 'none', 'none'], distance: 2, dimensions: [tube.endOuterRadius * 2, 0, 0], types: 'guards' }, objects[0])));
    objects.push(preview.only(visuals.dimensions({ modes: ['top', 'none', 'none'], distance: 2, dimensions: [tube.endInnerRadius * 2, 0, 0] }, objects[0])));

    return align({ modes: ['none', 'none', 'min'], grouped: true }, mirror ? mirrorZ(objects) : objects);
  }

  const segmentRingA = (c, mirror) => {
    const tube = {
      startOuterRadius: c.outerRadiusRingA,
      startInnerRadius: c.innerRadiusRingA,
      endOuterRadius: bendOuterRadius,
      endInnerRadius: bendInnerRadius,
      height: c.heightRingA,
    };

    const objects = [];
    objects.push(tubeElliptic({ ...tube, segments }));

    return align({ modes: ['none', 'none', 'min'], grouped: true }, mirror ? mirrorZ(objects) : objects);
  }

  const segmentCurve = () => {
    const tube = {
      outerRadius: bendOuterRadius,
      innerRadius: bendInnerRadius,
      curveRadius: bendCurveRadius,
      angle: -bendAngle,
    };

    const objects = [];
    objects.push(tubeCurved({ ...tube, segments }));

    return objects;
  }

  const objects = [];
  objects.push(rotate([0, -bendAngle, 0], translate([-bendCurveRadius, 0, 0 - connector1.distanceAB - connector1.heightRingA], segmentBA(connector1, false))));
  objects.push(rotate([0, -bendAngle, 0], translate([-bendCurveRadius, 0, 0 - connector1.heightRingA], segmentRingA(connector1, false))));
  if (bendAngle > 0) {
    objects.push(rotate([0, -bendAngle, 0], translate([-bendCurveRadius, 0, 0], segmentCurve())));
  }
  objects.push(translate([-bendCurveRadius, 0, 0], segmentRingA(connector2, true)));
  objects.push(translate([-bendCurveRadius, 0, connector2.heightRingA], segmentBA(connector2, true)));

  return align({ grouped: true }, rotate([0, bendAngle, 0], objects));
}

module.exports = { ...preview.main({ xRay: true, dimensions: false }, main) };
