/**
 * Parser class.
 *
 * @type {Parser|exports}
 */
var Parser = require('node-dbf');

/**
 * Helper for handing the LPP dBase files.
 *
 * @returns {{uploadLPPCodes: Function}}
 */
module.exports = function() {

  'use strict';

  return {

    /**
     * Extract all the records from the uploaded file and upsert the LPP items accordingly.
     *
     * @param {!Object} req Express request object.
     * @param {!Object} res Express response object.
     * @param {function({
            file: string,
            records: number,
            err: Array.string
          })=} cb Callback function (optional).
     */
    uploadLPPCodes: function(req, res, cb) {

      var uploadedFile = req.files['upload-file'],
        lppList = [],
        cpt = 0; // number of records

      // Get the model class
      var CodifiedLPP = req.app.models.CodifiedLPP;

      // Create a parser and attach it to the uploaded file
      var parser = new Parser(uploadedFile.path);

      parser
        .on('start', function() {console.log('dBase file parsing has started. Start parsing the file header.');})
        .on('header', function() {console.log('dBase file header has been parsed. Start parsing the records.');})
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
          console.log('Finished parsing the dBase file. Parsed ' + cpt + ' records.');

          var cbCpt = 0,  // upsert counter
            errs = [];  // array of errors caused by upsert for each instance

          /**
           * Upsert the instance passed and increment the counter passed.
           *
           * If an error occurred, the error is pushed to the error array passed.
           *
           * @private
           *
           * @param {!CodifiedLPP} lpp Class instance.
           * @param {!Array} errs Array of errors.
           * @param {!number} cpt Counter.
           */
          var upsert = function(lpp, errs, cpt) {

            CodifiedLPP.upsert(lpp, function(err, data) {

              cpt++;

              if (err) {
                errs.push({
                  data: data,
                  err: err
                });
              }
            });
          };

          // Upsert all records.
          for (var k in lppList) {

            var lpp = lppList[k];
            console.log('Upsert record #' + k);
            upsert(lpp, errs, cbCpt);
          }

          // Wait for all upsert to finish
          while (cbCpt !== cpt) {
            //wait
          }

          return cb({
            file: uploadedFile.originalname,
            records: lppList.length,
            err: errs
          });
        });

      parser.parse();
    }
  };
};
