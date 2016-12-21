/* jshint browser:true */

'use strict';

const es6Promise = require('es6-promise');
const mask = require('mask');

es6Promise.polyfill();

const options = {
  id: 'holder',
  backgroundURL: 'res/images/background.png',
  maskURL: 'res/images/mask.png',
  overlayURL: 'res/images/overlay.png',
  width: 1920,
  height: 1080
};

let maskedContent = mask(options);

setTimeout(_ => {
  console.log(maskedContent);
  maskedContent.draw();
}, 100);

