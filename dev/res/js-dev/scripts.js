/* jshint browser:true */

'use strict';

const es6Promise = require('es6-promise');
const mask = require('mask');

es6Promise.polyfill();

const options = {
  id: 'holder',
  background: 'res/images/background.png',
  mask: 'res/images/mask.png',
  overlay: 'res/images/overlay.png',
  width: 1920,
  height: 1080
};

mask(options);
