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
 * @returns {{myMiddleware: Function}}
 */
module.exports = function (app) {

  return {

    /**
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     */
    myMiddleware: function (req, res) {

      // Get the model class
      var CodifiedLPP = app.models.CodifiedLPP;

      var file = req.files['upload-file'],
          records = [],
          cpt = 0;

      // Create a parser and attach it to the uploaded file
      var parser = new Parser(file.path);

      parser
        .on('start', function () {
          console.log('dBase file parsing has started. Start parsing the file header.');
        })
        .on('header', function () {
          console.log('dBase file header has been parsed. Start parsing the records.');
        })
        .on('record', function (record) {

          cpt++;

          var lpp = new CodifiedLPP();

          lpp.code = record[this.header.fields[0].name];
          lpp.classification = record[this.header.fields[1].name];

          records.push(lpp);
        })
        .on('end', function (p) {
          console.log('Finished parsing the dBase file. Parsed ' + cpt + ' records.');

          var errs = [];

          var cpt2 = 0;

          for (var k in records) {

            var record = records[k];

            console.log('Upsert record #' + cpt2);
            cpt2++;

            CodifiedLPP.upsert(record, function (err) {

              if (err) {
                errs.push({
                  record: record,
                  err:    err
                });
              }
            });
          }

          while (cpt2 !== cpt) {
            //wait
          }

          res.json({
            file:    file.originalname,
            date:    Date.now(),
            records: records,
            err:     errs
          });
        });
      parser.parse();
    }
  }
};
