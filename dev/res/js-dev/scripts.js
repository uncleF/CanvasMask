/* jshint browser:true */

'use strict';

const es6Promise = require('es6-promise');
const mask = require('mask');
const downloadImages = require('downloadImages');
const animateMatrix = require('animateMatrix');

es6Promise.polyfill();

let maskedContent;

const images = [
  'res/images/background.png',
  'res/images/mask.png',
  'res/images/overlay.png'
];

const matrix = [1, .15, .15, 1, -300, -400];

function initMask(downloadedImages) {
  const options = {
    id: 'holder',
    width: 1920,
    height: 1080,
    backgroundImage: downloadedImages[0],
    maskImage: downloadedImages[1],
    overlayImage: downloadedImages[2]
  };
  maskedContent = mask(options);
}

function animateMask() {
  animateMatrix.go(2000, matrix, maskedContent.transform);
}

Promise.all(downloadImages(images))
  .then(initMask)
  .then(animateMask);
