/**
 * Parser class.
 *
 * @type {Parser|exports}
 */
var Parser = require('node-dbf');


/**
 *
 * @param {App} app LoopBackApplication object
 *
 * @return {Object}
 */
module.exports = function(app) {

  'use strict';

  // Get the model class
  var CodifiedLPP = app.models.CodifiedLPP;

  return {

    /**
     * @param {!Object} req Express request object.
     * @param {!Object} res Express response object.
     *
     */
    uploadLPPCodes: function(req, res) {

      var uploadedFile = req.files['upload-file'],
        lppList = [],
        cpt = 0; // number of records

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

          console.log('Finished parsing the dBase file. Parsed ' + cpt + ' records.');

          var cbCpt = 0,  // upsert counter
            errs = [];

          // Upsert all records.
          for (var k in lppList) {

            var lpp = lppList[k];

            console.log('Upsert record #' + cbCpt);
            cbCpt++;

            CodifiedLPP.upsert(lpp, function(err, data) {

              if (err) {
                errs.push({
                  data: data,
                  err: err
                });
              }
            });
          }

          while (cbCpt !== cpt) {
            //wait
          }

          res.json({
            file: uploadedFile.originalname,
            records: lppList.length,
            err: errs
          });
        });

      parser.parse();
    }
  };
};
