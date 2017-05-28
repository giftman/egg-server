'use strict';
const fs = require('fs');
const Promise = require('any-promise');
exports.exists = function(filename) {
  // or promise
  return new Promise(function(resolve) {
    fs.stat(filename, function(err) {
      resolve(!err);
    });
  });
};

exports.stat = function(filename) {
  // or promise
  return new Promise(function(resolve) {
    fs.stat(filename, function(err, stat) {
      resolve(stat);
    });
  });
};
