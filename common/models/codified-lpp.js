/**
 * File System object.
 * @type {exports}
 */
var fs = require('fs');

/**
 * Bytes Parser & Formatter.
 * @type {exports}
 */
var bytes = require('bytes');

/**
 * Contains utilities for handling and transforming file paths.
 * @type {exports}
 */
var path = require('path');

/**
 * MIME type mapping API.
 * @type {Mime|exports}
 */
var mime = require('mime');

/**
 * Extend or override model's behavior.
 *
 * @param {!Object} CodifiedLPP Model's class.
 */
module.exports = function(CodifiedLPP) {

  'use strict';

  //CodifiedLPP.importFromFile = function(cb) {
  //
  //
  //};
  //
  CodifiedLPP.getSourceFileInfo = function(cb) {

    var file = __dirname + '/../../server/files/CodifiedLPP.dbf';

    fs.stat(file, function(err, stats) {

      if (err) {
        cb(err);
      } else {
        cb(null, {
          name: path.basename(file),
          mimeType: mime.lookup(file),
          size: bytes(stats.size),
          bytes: stats.size,
          uploaded: stats.ctime
        });
      }
    });
  };

  //CodifiedLPP.getFile = function(cb) {
  //
  //};
  //
  //CodifiedLPP.remoteMethod('synchronize', {
  //  http: {path: '/synchronize', verb: 'get'}
  //}, CodifiedLPP.importFromFile);
  //
  CodifiedLPP.remoteMethod('getSourceFileInfo', {
    returns: {root: true},
    http: {path: '/getSourceFileInfo', verb: 'get'}
  });

  CodifiedLPP.remoteMethod('getSourceFile', {
    http: {path: '/getSourceFile', verb: 'get'}
  }, CodifiedLPP.getFile);

  //
  //CodifiedLPP.greet = function(cb) {
  //  cb(null, {
  //    content: 'Greetings... '
  //  });
  //};
  //
  //CodifiedLPP.remoteMethod(
  //  'greet',
  //  {
  //    http: {path: '/getSourceFile', verb: 'get'},
  //    returns: {root: true}
  //  }
  //);
};
