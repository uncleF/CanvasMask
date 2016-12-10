/* jshint browser:true */

'use strict';

let es6Promise = require('es6-promise');

es6Promise.polyfill();

/* Animation Stuff */

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
      drawMask(drawingContext, images, newValue);
      runAnimation(startTime, duration, startValue, deltaValue, drawingContext, images, task);
    } else {
      drawMask(drawingContext, images, (startValue + deltaValue));
    }
  });
}

/* Video Stuff */

function startVideo() {
  document.getElementById('video').play();
}

/* Canvas Stuff */

const DURATION = 2000;
const X = -120;
const Y = -200;
const WIDTH = 1280;
const HEIGHT = 720;
const SCALE = 9;

let currentScale = 0;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.addEventListener('load', _ => {
      resolve(image);
    });
    image.src = url;
  });
}

function calculateValues(factor) {
  return [
    X * factor,
    Y * factor,
    WIDTH * (factor + 1),
    HEIGHT * (factor + 1)
  ];
}

function drawMask(drawingContext, images, factor) {
  let [background, mask, overlay] = images;
  let [x, y, width, height] = calculateValues(factor);
  currentScale = factor;
  drawingContext.clearRect(0, 0, WIDTH, HEIGHT);
  drawingContext.drawImage(mask, x, y, width, height);
  drawingContext.globalCompositeOperation = 'source-in';
  drawingContext.drawImage(background, 0, 0, WIDTH, HEIGHT);
  drawingContext.globalCompositeOperation = 'source-over';
  drawingContext.drawImage(overlay, x, y, width, height);
  return images;
}

function animateMaskOut(drawingContext, images) {
  let duration = DURATION * ((SCALE - currentScale) / SCALE);
  cancelAnimationFrame(animation);
  runAnimation(Date.now(), duration, currentScale, (SCALE - currentScale), drawingContext, images, drawMask);
}

function animateMaskIn(drawingContext, images) {
  let duration = DURATION * (currentScale / SCALE);
  cancelAnimationFrame(animation);
  runAnimation(Date.now(), duration, currentScale, -currentScale, drawingContext, images, drawMask);
}

/* Interactions */

function subscribe(drawingContext, images) {
  let holder = document.getElementById('holder');
  holder.addEventListener('mouseover', _ => animateMaskOut(drawingContext, images));
  holder.addEventListener('mouseout', _ => animateMaskIn(drawingContext, images));
}

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

const BG_URL = 'res/images/background.png';
const MASK_URL = 'res/images/mask.png';
const OVERLAY_URL = 'res/images/overlay.png';

canvas.width = WIDTH;
canvas.height = HEIGHT;

Promise.all([loadImage(BG_URL), loadImage(MASK_URL), loadImage(OVERLAY_URL)])
  .then(images => drawMask(context, images, 0))
  .then(images => subscribe(context, images))
  .then(startVideo);

