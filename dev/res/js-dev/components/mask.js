/* jshint browser:true */

'use strict';

module.exports = (elementIDs, imageURLs, position) => {

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

  function startVideo(id) {
    document.getElementById(id).play();
  }

  /* Canvas Stuff */

  const DURATION = 2000;
  const WIDTH = 1280;
  const HEIGHT = 720;
  const SCALE = 9;

  const [X, Y] = position;

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
    runAnimation(Date.now(), duration, currentScale, delta, drawingContext, images, drawMask);
  }

  function animateMaskIn(drawingContext, images) {
    let duration = DURATION * (currentScale / SCALE);
    cancelAnimationFrame(animation);
    runAnimation(Date.now(), duration, currentScale, -currentScale, drawingContext, images, drawMask);
  }

  function subscribe(drawingContext, images) {
    let holder = document.getElementById('holder');
    holder.addEventListener('mouseover', _ => animateMaskOut(drawingContext, images));
    holder.addEventListener('mouseout', _ => animateMaskIn(drawingContext, images));
  }

  /* Initialization */

  let [canvasID, videoID] = elementIDs;

  let canvas = document.getElementById(canvasID);
  let context = canvas.getContext('2d');

  const [BG_URL, MASK_URL, OVERLAY_URL] = imageURLs;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  return Promise.all([loadImage(BG_URL), loadImage(MASK_URL), loadImage(OVERLAY_URL)])
    .then(images => drawMask(context, images, 0))
    .then(images => subscribe(context, images))
    .then(_ => startVideo(videoID));

};
