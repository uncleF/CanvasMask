/* jshint browser:true */

'use strict';

module.exports = (options) => {

  let id;

  let backgroundImage;
  let backgroundURL;

  let maskImage;
  let maskURL;

  let overlayImage;
  let overlayURL;

  let width;
  let height;

  let container;

  let canvas;
  let context;

  function loadImage(href) {
    return new Promise((resolve, reject) => {
      if (href) {
        let image = new Image();
        image.addEventListener('load', _ => {
          resolve(image);
        });
        image.src = href;
      } else {
        resolve(false);
      }
    });
  }

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'mask-canvas';
    container.appendChild(canvas);
    context = canvas.getContext('2d');
  }

  function saveImages(images) {
    [backgroundImage, maskImage, overlayImage] = images;
  }

  function drawMask(matrix) {
    context.save();
    if (matrix) {
      context.transform(matrix);
    }
    context.drawImage(maskImage, 0, 0, width, height);
    context.restore();
  }

  function drawBackground() {
    context.globalCompositeOperation = 'source-in';
    context.drawImage(backgroundImage, 0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
  }

  function drawOverlay(matrix) {
    if (overlayImage) {
      context.save();
      if (matrix) {
        context.transform(matrix);
      }
      context.drawImage(overlayImage, 0, 0, width, height);
      context.restore();
    }
  }

  function draw(matrix) {
    context.clearRect(0, 0, width, height);
    drawMask(matrix);
    drawBackground();
    drawOverlay(matrix);
  }

  ({id, backgroundURL, maskURL, overlayURL, width, height} = options);
  container = document.getElementById(id);
  createCanvas();

  Promise.all([loadImage(backgroundURL), loadImage(maskURL), loadImage(overlayURL)])
    .then(saveImages);

  return {
    draw: draw
  };

};
