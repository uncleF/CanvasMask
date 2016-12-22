/* jshint browser:true */

'use strict';

function downloadImage(href) {
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

module.exports = (urls) => {
  return urls.map(downloadImage);
};
