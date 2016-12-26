/* jshint browser:true */

'use strict';

const es6Promise = require('es6-promise');
const mask = require('mask');
const downloadImages = require('downloadImages');
const animateMatrix = require('animateMatrix');

es6Promise.polyfill();

const images = [
  'res/images/background.png',
  'res/images/mask.png',
  'res/images/overlay.png'
];

const matrix = [1, 0.5, -0.5, 1, 30, 10];

function initMask(downloadedImages) {
  return mask({
    id: 'holder',
    width: 1920,
    height: 1080,
    backgroundImage: downloadedImages[0],
    maskImage: downloadedImages[1],
    overlayImage: downloadedImages[2]
  });
}

function animateMask(maskedContent) {
  animateMatrix.go(2000, matrix, maskedContent.transform);
}

Promise.all(downloadImages(images))
  .then(initMask)
  .then(animateMask);
