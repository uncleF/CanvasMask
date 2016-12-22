/* jshint browser:true */

'use strict';

const BASELINE_MATRIX = [1, 0, 0, 1, 0, 0];

let animation;

/* Easing */

function cubicInOut(fraction) {
  return fraction < 0.5 ? 4 * Math.pow(fraction, 3) : (fraction - 1) * (2 * fraction - 2) * (2 * fraction - 2) + 1;
}

/* Utilities */

function calculateNewMatrix(matrix, fraction) {
  return matrix.map((value, index) => BASELINE_MATRIX[index] + value * fraction);
}

/* Animation */

function progressAnimation(startTime, duration, matrix, fraction, task) {
  let adjustedFraction = cubicInOut(fraction);
  let newMatrix = calculateNewMatrix(matrix, adjustedFraction);
  task(newMatrix);
  runAnimation(startTime, duration, matrix, task);
}

function completeAnimation(matrix, task) {
  let newMatrix = calculateNewMatrix(matrix, 1);
  task(newMatrix);
}

function runAnimation(startTime, duration, matrix, task) {
  animation = requestAnimationFrame(_ => {
    let fraction = (Date.now() - startTime) / duration;
    if (fraction < 1) {
      progressAnimation(startTime, duration, matrix, fraction, task);
    } else {
      completeAnimation(matrix, task);
    }
  });
}

/* Actions */

function stop() {
  if (animation) {
    cancelAnimationFrame(animation);
  }
}

function go(duration, matrix, task) {
  stop();
  runAnimation(Date.now(), duration, matrix, task);
}

/* Interface */

exports.stop = stop;
exports.go = go;

