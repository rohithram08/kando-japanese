/**
 * Authentic Kanji Stroke Evaluator & Shape Recognizer
 * 
 * Accurately compares user-drawn strokes against authentic KanjiVG SVG path references.
 * Evaluates:
 * 1. Stroke count and order
 * 2. Direction vector & reverse stroke detection
 * 3. Local curvature and segment tangent angles
 * 4. Spatial path distance (average and max deviation)
 * 5. Stroke placement & centroid alignment
 */

const parsedPathCache = new Map();

/**
 * Resample a point sequence along its path arc length into N equidistant points.
 */
export function resampleStroke(points, numPoints = 16) {
  if (!points || points.length === 0) return [];
  if (points.length === 1) {
    return Array(numPoints).fill({ x: points[0].x, y: points[0].y });
  }

  let totalLength = 0;
  const dists = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalLength += Math.hypot(dx, dy);
    dists.push(totalLength);
  }

  if (totalLength === 0) {
    return Array(numPoints).fill({ x: points[0].x, y: points[0].y });
  }

  const resampled = [{ x: points[0].x, y: points[0].y }];
  const step = totalLength / (numPoints - 1);
  let currentDist = step;
  let segIdx = 0;

  for (let i = 1; i < numPoints - 1; i++) {
    while (segIdx < dists.length - 1 && dists[segIdx + 1] < currentDist) {
      segIdx++;
    }
    const p1 = points[segIdx];
    const p2 = points[segIdx + 1] || p1;
    const segLen = dists[segIdx + 1] - dists[segIdx];
    const t = segLen > 0 ? (currentDist - dists[segIdx]) / segLen : 0;
    resampled.push({
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
    });
    currentDist += step;
  }

  resampled.push({ x: points[points.length - 1].x, y: points[points.length - 1].y });
  return resampled;
}

/**
 * Parse an SVG path command string into absolute points on the 109x109 grid.
 */
export function parseSvgPathToPoints(d, sampleBezierSteps = 8) {
  if (!d) return [];
  if (parsedPathCache.has(d)) {
    return parsedPathCache.get(d);
  }

  const points = [];
  let curX = 0, curY = 0;
  let startX = 0, startY = 0;
  const commandRegex = /([a-df-z])([^a-df-z]*)/gi;
  let match;

  while ((match = commandRegex.exec(d)) !== null) {
    const cmd = match[1];
    const args = match[2]
      .trim()
      .split(/[\s,]+|(?=-)/)
      .filter(Boolean)
      .map(Number);

    switch (cmd) {
      case 'M':
        for (let i = 0; i < args.length; i += 2) {
          curX = args[i]; curY = args[i + 1];
          if (i === 0) { startX = curX; startY = curY; }
          points.push({ x: curX, y: curY });
        }
        break;
      case 'm':
        for (let i = 0; i < args.length; i += 2) {
          curX += args[i]; curY += args[i + 1];
          if (i === 0) { startX = curX; startY = curY; }
          points.push({ x: curX, y: curY });
        }
        break;
      case 'L':
        for (let i = 0; i < args.length; i += 2) {
          curX = args[i]; curY = args[i + 1];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'l':
        for (let i = 0; i < args.length; i += 2) {
          curX += args[i]; curY += args[i + 1];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'H':
        for (let i = 0; i < args.length; i++) {
          curX = args[i]; points.push({ x: curX, y: curY });
        }
        break;
      case 'h':
        for (let i = 0; i < args.length; i++) {
          curX += args[i]; points.push({ x: curX, y: curY });
        }
        break;
      case 'V':
        for (let i = 0; i < args.length; i++) {
          curY = args[i]; points.push({ x: curX, y: curY });
        }
        break;
      case 'v':
        for (let i = 0; i < args.length; i++) {
          curY += args[i]; points.push({ x: curX, y: curY });
        }
        break;
      case 'C':
        for (let i = 0; i < args.length; i += 6) {
          const x0 = curX, y0 = curY;
          const x1 = args[i], y1 = args[i + 1];
          const x2 = args[i + 2], y2 = args[i + 3];
          const x3 = args[i + 4], y3 = args[i + 5];
          for (let step = 1; step <= sampleBezierSteps; step++) {
            const t = step / sampleBezierSteps;
            const cx = Math.pow(1 - t, 3) * x0 + 3 * Math.pow(1 - t, 2) * t * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) * x3;
            const cy = Math.pow(1 - t, 3) * y0 + 3 * Math.pow(1 - t, 2) * t * y1 + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3) * y3;
            points.push({ x: cx, y: cy });
          }
          curX = x3; curY = y3;
        }
        break;
      case 'c':
        for (let i = 0; i < args.length; i += 6) {
          const x0 = curX, y0 = curY;
          const x1 = curX + args[i], y1 = curY + args[i + 1];
          const x2 = curX + args[i + 2], y2 = curY + args[i + 3];
          const x3 = curX + args[i + 4], y3 = curY + args[i + 5];
          for (let step = 1; step <= sampleBezierSteps; step++) {
            const t = step / sampleBezierSteps;
            const cx = Math.pow(1 - t, 3) * x0 + 3 * Math.pow(1 - t, 2) * t * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) * x3;
            const cy = Math.pow(1 - t, 3) * y0 + 3 * Math.pow(1 - t, 2) * t * y1 + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3) * y3;
            points.push({ x: cx, y: cy });
          }
          curX = x3; curY = y3;
        }
        break;
      case 'S':
      case 's':
        for (let i = 0; i < args.length; i += 4) {
          curX = cmd === 'S' ? args[i + 2] : curX + args[i + 2];
          curY = cmd === 'S' ? args[i + 3] : curY + args[i + 3];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'Z':
      case 'z':
        curX = startX; curY = startY;
        points.push({ x: curX, y: curY });
        break;
    }
  }

  parsedPathCache.set(d, points);
  return points;
}

function calculateAngleDiff(a1, a2) {
  let diff = Math.abs(a1 - a2);
  while (diff > Math.PI) diff = Math.abs(diff - 2 * Math.PI);
  return diff;
}

/**
 * Evaluate a single user stroke against a reference stroke.
 * User coordinates are normalized from canvas space to the reference 109x109 grid.
 */
export function evaluateSingleStroke(userPoints, refSvgOrPoints, options = {}) {
  const { canvasWidth = 109, canvasHeight = 109 } = options;

  if (!userPoints || userPoints.length < 2) {
    return { score: 0, isMatch: false, reason: 'Stroke is too short or empty' };
  }

  // Normalize user points to 109x109 space
  const scaleX = 109 / (canvasWidth || 109);
  const scaleY = 109 / (canvasHeight || 109);
  const normalizedUserPts = userPoints.map(p => ({
    x: p.x * scaleX,
    y: p.y * scaleY,
  }));

  const refPts = typeof refSvgOrPoints === 'string'
    ? parseSvgPathToPoints(refSvgOrPoints)
    : refSvgOrPoints;

  if (!refPts || refPts.length < 2) {
    return { score: 80, isMatch: true, reason: 'Reference path unavailable' };
  }

  const uSample = resampleStroke(normalizedUserPts, 16);
  const rSample = resampleStroke(refPts, 16);

  // 1. Overall direction vector & angle
  const uStart = uSample[0];
  const uEnd = uSample[uSample.length - 1];
  const rStart = rSample[0];
  const rEnd = rSample[rSample.length - 1];

  const uDx = uEnd.x - uStart.x;
  const uDy = uEnd.y - uStart.y;
  const rDx = rEnd.x - rStart.x;
  const rDy = rEnd.y - rStart.y;

  const uLen = Math.hypot(uDx, uDy);
  const rLen = Math.hypot(rDx, rDy);

  if (uLen < 5) {
    return { score: 0, isMatch: false, reason: 'Stroke is just a dot' };
  }

  const overallDot = (uDx * rDx + uDy * rDy) / (uLen * rLen);

  // Severe direction penalty (wrong orientation or reverse stroke)
  if (overallDot < 0.25) {
    const isReverse = overallDot < -0.3;
    return {
      score: 0,
      isMatch: false,
      reason: isReverse ? 'Drawn in reverse direction' : 'Wrong stroke direction',
      details: { dot: overallDot.toFixed(2), avgDist: 0, avgAngleErrorDeg: 180 },
    };
  }

  // 2. Local segment tangent angles (catches wavy, arched, or hooked strokes)
  let totalAngleError = 0;
  for (let i = 0; i < 15; i++) {
    const uSegAngle = Math.atan2(uSample[i + 1].y - uSample[i].y, uSample[i + 1].x - uSample[i].x);
    const rSegAngle = Math.atan2(rSample[i + 1].y - rSample[i].y, rSample[i + 1].x - rSample[i].x);
    totalAngleError += calculateAngleDiff(uSegAngle, rSegAngle);
  }
  const avgAngleErrorDeg = (totalAngleError / 15) * (180 / Math.PI);

  // 3. Point-to-point spatial deviation
  let sumDist = 0;
  let maxDist = 0;
  for (let i = 0; i < 16; i++) {
    const d = Math.hypot(uSample[i].x - rSample[i].x, uSample[i].y - rSample[i].y);
    sumDist += d;
    if (d > maxDist) maxDist = d;
  }
  const avgDist = sumDist / 16;

  // 4. Centroid & endpoint distance
  let uCentroid = { x: 0, y: 0 }, rCentroid = { x: 0, y: 0 };
  for (let i = 0; i < 16; i++) {
    uCentroid.x += uSample[i].x; uCentroid.y += uSample[i].y;
    rCentroid.x += rSample[i].x; rCentroid.y += rSample[i].y;
  }
  uCentroid.x /= 16; uCentroid.y /= 16;
  rCentroid.x /= 16; rCentroid.y /= 16;
  const centroidDist = Math.hypot(uCentroid.x - rCentroid.x, uCentroid.y - rCentroid.y);

  // Scoring
  let score = 100;

  // Curvature / tangent error penalty
  if (avgAngleErrorDeg > 18) {
    score -= (avgAngleErrorDeg - 18) * 1.5;
  }

  // Spatial distance penalty
  if (avgDist > 8) {
    score -= (avgDist - 8) * 2.5;
  }

  // Max deviation penalty (catches arches/hooks that stray far from target)
  if (maxDist > 16) {
    score -= (maxDist - 16) * 1.8;
  }

  // Centroid/position penalty
  if (centroidDist > 14) {
    score -= (centroidDist - 14) * 1.3;
  }

  score = Math.round(Math.max(0, Math.min(100, score)));

  let reason = 'Good';
  if (score < 50) {
    if (avgAngleErrorDeg > 40) reason = 'Shape or curvature does not match stroke';
    else if (centroidDist > 25) reason = 'Stroke placed in the wrong position';
    else reason = 'Stroke deviates from target path';
  } else if (score < 75) {
    reason = 'Check stroke position and curvature';
  }

  return {
    score,
    isMatch: score >= 50,
    reason,
    details: {
      avgDist: Math.round(avgDist),
      maxDist: Math.round(maxDist),
      avgAngleErrorDeg: Math.round(avgAngleErrorDeg),
      centroidDist: Math.round(centroidDist),
      dot: overallDot.toFixed(2),
    },
  };
}

/**
 * Evaluate complete kanji drawing with multiple strokes against reference data.
 * 
 * @param {Array<Array<{x: number, y: number}>>} userStrokes - User drawn stroke points
 * @param {Object|Array<string>} targetDataOrStrokes - Kanji stroke data with .strokes or array of SVG paths
 * @param {Object} options - { canvasWidth, canvasHeight, targetCount }
 * @returns {Object} { status, score, isValid, message, strokeFeedback }
 */
export function evaluateKanjiDrawing(userStrokes, targetDataOrStrokes, options = {}) {
  const refStrokes = Array.isArray(targetDataOrStrokes)
    ? targetDataOrStrokes
    : targetDataOrStrokes?.strokes || [];

  const targetCount = options.targetCount || refStrokes.length || 0;
  const drawnCount = userStrokes?.length || 0;
  const canvasWidth = options.canvasWidth || options.canvasSize || 109;
  const canvasHeight = options.canvasHeight || options.canvasSize || 109;

  // 1. Empty state
  if (drawnCount === 0) {
    return {
      status: 'empty',
      score: 0,
      isValid: false,
      message: targetCount > 0 ? `0 / ${targetCount} strokes` : 'Draw the strokes above',
      strokeFeedback: [],
    };
  }

  // 2. Over stroke count
  if (targetCount > 0 && drawnCount > targetCount) {
    return {
      status: 'over',
      score: 0,
      isValid: false,
      message: `${drawnCount} / ${targetCount} strokes — Too many strokes! Target is ${targetCount}`,
      strokeFeedback: [],
    };
  }

  // Evaluate strokes drawn so far
  const strokeFeedback = userStrokes.map((uStroke, idx) => {
    const refSvg = refStrokes[idx];
    if (!refSvg) return { score: 70, isMatch: true, reason: 'Good' };
    return evaluateSingleStroke(uStroke, refSvg, { canvasWidth, canvasHeight });
  });

  // Calculate average score of drawn strokes
  const totalScore = strokeFeedback.reduce((acc, f) => acc + (f.score || 0), 0);
  const avgScore = drawnCount > 0 ? Math.round(totalScore / drawnCount) : 0;
  const allMatch = strokeFeedback.every(f => f.isMatch);

  // 3. Incomplete state (user still drawing)
  if (targetCount > 0 && drawnCount < targetCount) {
    const lastFeedback = strokeFeedback[drawnCount - 1];
    let msg = `${drawnCount} / ${targetCount} strokes`;
    if (lastFeedback && !lastFeedback.isMatch) {
      msg = `${drawnCount} / ${targetCount} strokes — ⚠️ Stroke ${drawnCount} needs correction (${lastFeedback.reason})`;
    } else {
      msg = `${drawnCount} / ${targetCount} strokes — Keep going!`;
    }

    return {
      status: 'incomplete',
      score: avgScore,
      isValid: false,
      message: msg,
      strokeFeedback,
    };
  }

  // 4. Exact stroke count reached: final assessment
  if (allMatch && avgScore >= 75) {
    return {
      status: 'perfect',
      score: avgScore,
      isValid: true,
      message: `${targetCount} / ${targetCount} strokes ✓ Perfect! (${avgScore}%)`,
      strokeFeedback,
    };
  }

  if (avgScore >= 50) {
    return {
      status: 'warning',
      score: avgScore,
      isValid: false,
      message: `${targetCount} / ${targetCount} strokes — ⚠️ Check stroke shape & position (${avgScore}%)`,
      strokeFeedback,
    };
  }

  return {
    status: 'incorrect',
    score: avgScore,
    isValid: false,
    message: `${targetCount} / ${targetCount} strokes — ❌ Strokes do not match. Follow the guide!`,
    strokeFeedback,
  };
}
