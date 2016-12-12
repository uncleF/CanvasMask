/* jshint browser:true */

'use strict';

let animation = require('animation');

module.exports = (elementIDs, imageURLs, positionShift) => {

  const DURATION = 2000;

  const WIDTH = 1280;
  const HEIGHT = 720;
  const SCALE = 9;

  const [SHIFT_X, SHIFT_Y] = positionShift;

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
      SHIFT_X * factor,
      SHIFT_Y * factor,
      WIDTH * (factor + 1),
      HEIGHT * (factor + 1),
      1 - factor / SCALE
    ];
  }

  function drawMask(drawingContext, images, factor) {
    let [background, mask, overlay] = images;
    let [x, y, width, height, opacity] = calculateValues(factor);
    currentScale = factor;
    drawingContext.globalAlpha = 1;
    drawingContext.clearRect(0, 0, WIDTH, HEIGHT);
    drawingContext.drawImage(mask, x, y, width, height);
    drawingContext.globalCompositeOperation = 'source-in';
    drawingContext.drawImage(background, 0, 0, WIDTH, HEIGHT);
    drawingContext.globalCompositeOperation = 'source-over';
    drawingContext.globalAlpha = opacity;
    drawingContext.drawImage(overlay, x, y, width, height);
    return images;
  }

  /* Events */

  function animateMaskOut(drawingContext, images) {
    let delta = (SCALE - currentScale);
    let duration = DURATION * (delta / SCALE);
    cancelAnimationFrame(animation);
    animation.run(Date.now(), duration, currentScale, delta, drawingContext, images, drawMask);
  }

  function animateMaskIn(drawingContext, images) {
    let duration = DURATION * (currentScale / SCALE);
    cancelAnimationFrame(animation);
    animation.run(Date.now(), duration, currentScale, -currentScale, drawingContext, images, drawMask);
  }

  function subscribe(id, drawingContext, images) {
    let holder = document.getElementById(id);
    holder.addEventListener('mouseover', _ => animateMaskOut(drawingContext, images));
    holder.addEventListener('mouseout', _ => animateMaskIn(drawingContext, images));
  }

  /* Initialization */

  let [canvasID, holderID] = elementIDs;

  let canvas = document.getElementById(canvasID);
  let context = canvas.getContext('2d');

  const [BG_URL, MASK_URL, OVERLAY_URL] = imageURLs;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  return Promise.all([loadImage(BG_URL), loadImage(MASK_URL), loadImage(OVERLAY_URL)])
    .then(images => drawMask(context, images, 0))
    .then(images => subscribe(holderID, context, images));

};
