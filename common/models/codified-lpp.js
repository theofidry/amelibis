/**
 * Bytes Parser & Formatter.
 * @type {exports}
 */
var bytes = require('bytes');

/**
 * File System object.
 * @type {exports}
 */
var fs = require('fs');

/**
 * MIME type mapping API.
 * @type {Mime|exports}
 */
var mime = require('mime');

/**
 * dBase file parser class.
 * @type {Parser|exports}
 */
var Parser = require('node-dbf');

/**
 * Contains utilities for handling and transforming file paths.
 * @type {exports}
 */
var path = require('path');

/**
 * Extend or override model's behavior.
 *
 * @param {!Object} CodifiedLPP Model's class.
 */
module.exports = function(CodifiedLPP) {

  'use strict';

  /**
   * @callback remoteMethodCallback
   * @param {?Object} Error object.
   * @param {Object=} Returned data object.
   */

  /**
   * LPP source file.
   * @type {string}
   */
  CodifiedLPP.sourceFile = __dirname + '/../../client/files/CodifiedLPP.dbf';

  /**
   * @static
   */
  CodifiedLPP.upsertAllHelper = {
    /**
     * Number of records upserted during the last call.
     * @type {number}
     */
    upserted: 0,
    /**
     * List of errors that may have occurred during the last upsert.
     * @type {Array}
     */
    errors: [],
    /**
     * Increment the number of record upserted by one.
     */
    addUpsert: function() {
      this.upserted++;
    },
    /**
     * Function used as a callback for updated the upserted and errors objects after an upsert.
     * @param {?Object} err
     * @param {!Object} data
     */
    upsertCb: function(err, data) {
      if (err) {
        CodifiedLPP.upsertAllHelper.errors.push({
          record: data,
          error: err
        });
      }
      CodifiedLPP.upsertAllHelper.addUpsert();
    },
    /**
     * Reset.
     */
    reset: function() {
      this.upserted = 0;
      this.errors = [];
    }
  };

  /**
   * Upsert all the elements of the given list.
   * The callback function takes two parameters:
   *  The number of upserted element.
   *  An array of errors that occurred.
   * @param {![CodifiedLPP]} lppList Array of codified LPP items.
   * @param {Function(number, Array)=} cb Callback.
   */
  CodifiedLPP.upsertAll = function(lppList, cb) {

    // Clear data of the previous upsert.
    CodifiedLPP.upsertAllHelper.reset();

    // Upsert all records.
    for (var k in lppList) {
      CodifiedLPP.upsert(lppList[k], CodifiedLPP.upsertAllHelper.upsertCb);
    }

    // Wait for all upsert to finish.
    // Check every given time if the number of records upserted is good the expected number.
    // An interval is used instead of a while because of concurrency problems.
    setInterval(function() {
      if (CodifiedLPP.upsertAllHelper.upserted === lppList.length && cb) {
        if (cb) {
          clearInterval(this);
          cb(CodifiedLPP.upsertAllHelper.upserted, CodifiedLPP.upsertAllHelper.errors);
        }
      }
    }, 100);
  };

  /**
   * Import the LPP items from the source file.
   *
   * @param {!remoteMethodCallback} cb Callback.
   */
  CodifiedLPP.importSourceFile = function(cb) {

    // Create a parser and attach it to the source file
    var parser = new Parser(CodifiedLPP.sourceFile);

    var lppList = [],
      cpt = 0; // counter; number of records

    parser
      .on('start', function() {
        console.log('[importSourceFile] dBase file parsing has started. Start parsing the file header.');
      })
      .on('header', function() {
        console.log('[importSourceFile] dBase file header has been parsed. Start parsing the records.');
      })
      .on('record', function(record) {

        // Increment counter
        cpt++;

        // Extract LPP data from record
        var lpp = new CodifiedLPP();
        lpp.code = record[this.header.fields[0].name];
        lpp.classification = record[this.header.fields[1].name];

        lppList.push(lpp);
      })
      .on('end', function() {

        // Upsert the records retrieved and return a feedback object.
        console.log('[importSourceFile] Finished parsing the dBase file. Parsed ' + cpt + ' records. Update records.');

        CodifiedLPP.upsertAll(lppList, function(count, errors) {

          console.log('[importSourceFile] Records updated');
          cb(null, {
            records: count,
            errors: errors
          });
        });
      });

    parser.parse();
  };

  /**
   * Return data about the source file.
   *
   * @param {!remoteMethodCallback} cb Callback.
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
   * @param {!remoteMethodCallback} cb Callback.
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

  //
  // Register remote methods.
  //
  CodifiedLPP.remoteMethod('importSourceFile', {
    returns: {root: true},
    http: {path: '/synchronize', verb: 'get'}
  });

  CodifiedLPP.remoteMethod('getSourceFileInfo', {
    returns: {root: true},
    http: {path: '/getSourceFileInfo', verb: 'get'}
  });

  CodifiedLPP.remoteMethod('getSourceFile', {
    http: {path: '/getSourceFile', verb: 'get'}
  });
};
