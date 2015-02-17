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

  CodifiedLPP.sourceFile = __dirname + '/../../client/files/CodifiedLPP.dbf';

  //CodifiedLPP.importFromFile = function(cb) {
  //
  //
  //};

  /**
   * Return data about the source file.
   * @param {Function} cb Callback.
   */
  CodifiedLPP.getSourceFileInfo = function(cb) {

    fs.stat(CodifiedLPP.sourceFile, function(err, stats) {

      if (err) {
        cb(err);
      } else {
        cb(null, {
          name: path.basename(CodifiedLPP.sourceFile),
          mimeType: mime.lookup(CodifiedLPP.sourceFile),
          size: bytes(stats.size),
          bytes: stats.size,
          uploaded: stats.ctime
        });
      }
    });
  };

  /**
   * Return the source file.
   *
   * This requires to access to the context, so this method is empty and the rest is handled in the remote hook.
   *
   * @param {Function} cb Callback.
   */
  CodifiedLPP.getSourceFile = function(cb) {
    cb(null);
  };

  /**
   * Remote hook: return the source file.
   */
  CodifiedLPP.afterRemote('getSourceFile', function(ctx, modelInstance, next) {

    ctx.res.download(CodifiedLPP.sourceFile);
  });

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
  });

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
