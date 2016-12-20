/* jshint browser:true */

'use strict';

module.exports = (options) => {

  let id;
  let background;
  let mask;
  let overlay;
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

  function drawMask(images) {
    const [backgroundImage, maskImage, overlayImage] = images;
    context.clearRect(0, 0, width, height);
    context.drawImage(maskImage, 0, 0, width, height);
    context.globalCompositeOperation = 'source-in';
    context.drawImage(backgroundImage, 0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
    if (overlayImage) {
      context.drawImage(overlayImage, 0, 0, width, height);
    }
  }

  ({id, background, mask, overlay, width, height} = options);

  container = document.getElementById(id);
  createCanvas();

  return Promise.all([loadImage(background), loadImage(mask), loadImage(overlay)])
    .then(drawMask);

};
