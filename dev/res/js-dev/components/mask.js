/* jshint browser:true */

'use strict';

module.exports = (options) => {

  let id;

  let backgroundImage;
  let maskImage;
  let overlayImage;

  let canvas;
  let context;
  let width;
  let height;

  let container;

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'mask-canvas';
    container.appendChild(canvas);
    context = canvas.getContext('2d');
  }

  function drawMask() {
    context.drawImage(maskImage, 0, 0, width, height);
  }

  function drawBackground() {
    context.globalCompositeOperation = 'source-out';
    context.drawImage(backgroundImage, 0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
  }

  function drawOverlay() {
    context.drawImage(overlayImage, 0, 0, width, height);
  }

  function clear() {
    context.clearRect(0, 0, width, height);
  }

  function draw() {
    clear();
    drawMask();
    drawBackground();
    drawOverlay();
  }

  function transformMask(matrix) {
    context.save();
    context.fillStyle = '#000000';
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'destination-atop';
    context.setTransform(...matrix);
    drawMask();
    context.restore();
  }

  function transformOverlay(matrix) {
    if (overlayImage) {
      context.save();
      context.setTransform(...matrix);
      drawOverlay();
      context.restore();
    }
  }

  function transform(matrix) {
    clear();
    transformMask(matrix);
    drawBackground();
    transformOverlay(matrix);
  }

  ({id, backgroundImage, maskImage, overlayImage, width, height} = options);
  container = document.getElementById(id);
  createCanvas();
  draw();

  return {
    draw: draw,
    transform: transform
  };

};
