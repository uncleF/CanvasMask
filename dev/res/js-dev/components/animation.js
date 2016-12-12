/* jshint browser:true */

'use strict';

let animation;

function cubicInOut(fraction) {
  return fraction < 0.5 ? 4 * Math.pow(fraction, 3) : (fraction - 1) * (2 * fraction - 2) * (2 * fraction - 2) + 1;
}

function runAnimation(startTime, duration, startValue, deltaValue, drawingContext, images, task) {
  animation = requestAnimationFrame(_ => {
    let fraction = (Date.now() - startTime) / duration;
    if (fraction < 1) {
      let adjustedFraction = cubicInOut(fraction);
      let newValue = startValue + deltaValue * adjustedFraction;
      task(drawingContext, images, newValue);
      runAnimation(startTime, duration, startValue, deltaValue, drawingContext, images, task);
    } else {
      task(drawingContext, images, (startValue + deltaValue));
    }
  });
}

exports.run = runAnimation;
