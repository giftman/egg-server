'use strict';

// app/extend/context.js
module.exports = {
  get isIOS() {
    const iosReg = /iphone|ipad|ipod/i;
    // console.log('isIOS');
    return iosReg.test(this.get('user-agent'));
  },
};
