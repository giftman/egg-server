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

exports.writeFile = function(filename, data, encode = 'utf8') {
   // or promise
  return new Promise(function(resolve) {
    fs.writeFile(filename, data, encode, function(err) {
      console.log(err);
      resolve(!err);
    });
  });
};
