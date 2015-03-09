/**
 * StrongLoop application object.
 * @type {exports}
 */
var app = require('../../server/server');

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
 * @param {!Object} Price Model's class.
 */
module.exports = function(Price) {

  'use strict';

  /**
   * @callback remoteMethodCallback
   * @param {?Object} Error object.
   * @param {Object=} Returned data object.
   */

  /**
   * LPP history source file.
   * @type {string}
   */
  Price.sourceFile = __dirname + '/../../client/files/CodifiedLPPHistory.dbf';

  /**
   * Helper to extract a Date object from the string date given by AMELI.
   *
   * @param {string=} date
   * @returns {?Date}
   */
  Price.parseAmeliDate = function(date) {

    // Expect string date in format YYYYMMDD
    if (typeof date !== 'string' || date.length !== 8) {
      return null;
    }

    return new Date(date.substring(0, 4), date.substring(4, 6), date.substring(6));
  };

  /**
   * @static
   */
  Price.upsertAllHelper = {
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
        Price.upsertAllHelper.errors.push({
          record: data,
          error: err
        });
      }
      Price.upsertAllHelper.addUpsert();
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
   * @param {![Price]} lppHistoList Array of codified LPP items.
   * @param {Function(number, Array)=} cb Callback.
   */
  Price.upsertAll = function(lppHistoList, cb) {

    cb = (typeof cb === 'function')? cb: function() {};

    // Clear data of the previous upsert.
    Price.upsertAllHelper.reset();

    // Upsert all records.
    for (var k in lppHistoList) {
      Price.upsert(lppHistoList[k], Price.upsertAllHelper.upsertCb);
    }

    // Wait for all upsert to finish.
    // Check every given time if the number of records upserted is good the expected number.
    // An interval is used instead of a while because of concurrency problems.
    setInterval(function() {
      if (Price.upsertAllHelper.upserted === lppHistoList.length && cb) {
        clearInterval(this);
        cb(Price.upsertAllHelper.upserted, Price.upsertAllHelper.errors);
      }
    }, 100);
  };

  /**
   * Import the LPP history items from the source file.
   *
   * @param {!remoteMethodCallback} cb Callback.
   */
  Price.importSourceFile = function(cb) {

    cb = (typeof cb === 'function')? cb: function() {};

    // Create a parser and attach it to the source file.
    var parser = new Parser(Price.sourceFile);

    var lppHistoList = [],
      cpt = 0; // counter; number of records.

    parser
      .on('start', function() {
        console.log('[importSourceFile] dBase file parsing has started. Start parsing the file header.');
      })
      .on('header', function() {
        console.log('[importSourceFile] dBase file header has been parsed. Start parsing the records.');
      })
      .on('record', function(record) {

        // Increment counter.
        cpt++;

        // Extract LPP history data from record.
        var lppHisto = new Price({
          codifiedLPPItemId: record[this.header.fields[0].name],
          price: record[this.header.fields[8].name],
          dateBegin: Price.parseAmeliDate(record[this.header.fields[1].name]),
          dateEnd: Price.parseAmeliDate(record[this.header.fields[2].name])
        });

        lppHistoList.push(lppHisto);
      })
      .on('end', function() {

        // Upsert the records retrieved and return a feedback object.
        console.log('[importSourceFile] Finished parsing the dBase file. Parsed ' + cpt + ' records. Update records.');

        Price.upsertAll(lppHistoList, function(count, errors) {

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
  Price.getSourceFileInfo = function(cb) {

    cb = (typeof cb === 'function')? cb: function() {};

    fs.stat(Price.sourceFile, function(err, stats) {

      if (err) {
        cb(err);
      } else {
        cb(null, {
          name: path.basename(Price.sourceFile),
          mimeType: mime.lookup(Price.sourceFile),
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
  Price.getSourceFile = function(cb) {

    cb = (typeof cb === 'function')? cb: function() {};
    cb(null);
  };

  /**
   * Destroy all instances.
   *
   * @param {Object=} params Optional where filter.
   * @param {!remoteMethodCallback} cb
   */
  Price.destroyAllInstances = function(params, cb) {

    Price.destroyAll(params, function(err) {
      cb(err, null);
    });
  };

  /**
   * Remote hook: return the source file.
   */
  Price.afterRemote('getSourceFile', function(ctx, modelInstance, next) {

    ctx.res.download(Price.sourceFile);
  });

  //
  // Register remote methods.
  //
  Price.remoteMethod('destroyAllInstances', {
    description: 'Delete all matching records',
    accessType: 'WRITE',
    http: {path: '/', verb: 'delete'}
  });

  Price.remoteMethod('getSourceFileInfo', {
    description: 'Get source file data',
    accessType: 'READ',
    returns: {root: true},
    http: {path: '/getSourceFileData', verb: 'get'}
  });

  Price.remoteMethod('getSourceFile', {
    description: 'Get the source file',
    accessType: 'READ',
    http: {path: '/getSourceFile', verb: 'get'}
  });

  Price.remoteMethod('importSourceFile', {
    description: 'Import all prices from the source file',
    accessType: 'WRITE',
    returns: {root: true},
    http: {path: '/synchronize', verb: 'get'}
  });
};
