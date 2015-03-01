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
 * @param {!Object} CodifiedLPPItem Model's class.
 */
module.exports = function(CodifiedLPPItem) {

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
  CodifiedLPPItem.sourceFile = __dirname + '/../../client/files/CodifiedLPP.dbf';

  /**
   * @static
   */
  CodifiedLPPItem.upsertAllHelper = {
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
        CodifiedLPPItem.upsertAllHelper.errors.push({
          record: data,
          error: err
        });
      }
      CodifiedLPPItem.upsertAllHelper.addUpsert();
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
   * @param {![CodifiedLPPItem]} lppList Array of codified LPP items.
   * @param {Function(number, Array)=} cb Callback.
   */
  CodifiedLPPItem.upsertAll = function(lppList, cb) {

    cb = (typeof cb === 'function')? cb: function() {};

    // Clear data of the previous upsert.
    CodifiedLPPItem.upsertAllHelper.reset();

    // Upsert all records.
    for (var k in lppList) {
      CodifiedLPPItem.upsert(lppList[k], CodifiedLPPItem.upsertAllHelper.upsertCb);
    }

    // Wait for all upsert to finish.
    // Check every given time if the number of records upserted is good the expected number.
    // An interval is used instead of a while because of concurrency problems.
    setInterval(function() {
      if (CodifiedLPPItem.upsertAllHelper.upserted === lppList.length && cb) {
        clearInterval(this);
        cb(CodifiedLPPItem.upsertAllHelper.upserted, CodifiedLPPItem.upsertAllHelper.errors);
      }
    }, 100);
  };

  /**
   * Import the LPP items from the source file.
   *
   * @param {!remoteMethodCallback} cb Callback.
   */
  CodifiedLPPItem.importSourceFile = function(cb) {

    cb = (typeof cb === 'function')? cb: function() {};

    // Create a parser and attach it to the source file.
    var parser = new Parser(CodifiedLPPItem.sourceFile);

    var lppList = [],
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

        // Extract LPP data from record.
        var lpp = new CodifiedLPPItem({
          code: record[this.header.fields[0].name],
          classification: record[this.header.fields[1].name]
        });

        lppList.push(lpp);
      })
      .on('end', function() {

        // Upsert the records retrieved and return a feedback object.
        console.log('[importSourceFile] Finished parsing the dBase file. Parsed ' + cpt + ' records. Update records.');

        CodifiedLPPItem.upsertAll(lppList, function(count, errors) {

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
  CodifiedLPPItem.getSourceFileInfo = function(cb) {

    cb = (typeof cb === 'function')? cb: function() {};

    fs.stat(CodifiedLPPItem.sourceFile, function(err, stats) {

      if (err) {
        cb(err);
      } else {
        cb(null, {
          name: path.basename(CodifiedLPPItem.sourceFile),
          mimeType: mime.lookup(CodifiedLPPItem.sourceFile),
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
  CodifiedLPPItem.getSourceFile = function(cb) {

    cb = (typeof cb === 'function')? cb: function() {};
    cb(null);
  };

  /**
   * Destroy all instances.
   *
   * @param {!remoteMethodCallback} cb
   */
  CodifiedLPPItem.destroyAllInstances = function(cb) {

    cb = (typeof cb === 'function')? cb: function() {};

    CodifiedLPPItem.destroyAll(null, function(err) {
      cb(null);
    });
  };

  /**
   * Overwrite the default get to provide relations data too.
   * @param cb
   */
  CodifiedLPPItem.getAllInstances = function(cb) {

    cb = (typeof cb === 'function')? cb: function() {};

    CodifiedLPPItem.find({
        limit: 2,
        include: {
          relation: 'prices',
          scope: {
            fields: ['id', 'price', 'dateBegin', 'dateEnd']
          }
        }
      },
      function(err, instances) {

        if (err) {
          cb(err);
        } else {
          cb(null, instances);
        }
      }
    );
  };

  /**
   * Remote hook: return the source file.
   */
  CodifiedLPPItem.afterRemote('getSourceFile', function(ctx, modelInstance, next) {

    ctx.res.download(CodifiedLPPItem.sourceFile);
  });

//
// Register remote methods.
//
  CodifiedLPPItem.remoteMethod('destroyAllInstances', {
    http: {path: '/', verb: 'delete'}
  });

  CodifiedLPPItem.remoteMethod('getAllInstances', {
    http: {path: '/test', verb: 'get'},
    returns: {arg: 'entities', type: 'Array'}
  });

  CodifiedLPPItem.remoteMethod('getSourceFileInfo', {
    returns: {root: true},
    http: {path: '/getSourceFileInfo', verb: 'get'}
  });

  CodifiedLPPItem.remoteMethod('getSourceFile', {
    http: {path: '/getSourceFile', verb: 'get'}
  });

  CodifiedLPPItem.remoteMethod('importSourceFile', {
    returns: {root: true},
    http: {path: '/synchronize', verb: 'get'}
  });
}
;
