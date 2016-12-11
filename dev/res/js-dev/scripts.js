/* jshint browser:true */

'use strict';

let es6Promise = require('es6-promise');
let mask = require('mask');

es6Promise.polyfill();

let firstFrameIDs = ['canvas', 'video'];
let firstFrameURLs = ['res/images/background.png', 'res/images/mask.png', 'res/images/overlay.png'];
let firstFramePosition = [-120, -200];

mask(firstFrameIDs, firstFrameURLs, firstFramePosition);
