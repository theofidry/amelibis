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

      // Get the model
      var CodifiedLPP = app.models.CodifiedLPP;

      var lpp = new CodifiedLPP();

      lpp.code = 90123492;
      lpp.classification = 'Insert #1.';

      lpp.save(function (err, obj) {
        res.send(err);
      });

      ////CodifiedLPP.create([
      ////  {
      ////    code:           90123495,
      ////    classification: 'Random LPP item.',
      ////    price:          '20',
      ////    dateBegin:      '2015-02-07',
      ////    dateEnd:        null
      ////  }
      ////], function (err, codifiedLPPList) {
      ////
      ////  if (err) {
      ////    throw err;
      ////  }
      ////
      ////  console.log('Models created: \n', codifiedLPPList);
      ////});
      //
      //res.json(CodifiedLPP);
      //console.log(CodifiedLPP);
      //var records = [];
      //
      //var parser = new Parser(req.files['upload-file'].path);
      //
      //parser.on('start', function(p) {
      //  console.log('dBase file parsing has started');
      //});
      //
      //parser.on('header', function(h) {
      //  console.log('dBase file header has been parsed');
      //});
      //
      //parser.on('record', function(record) {
      //  console.log('Record:\n');
      //  console.log(record);
      //  records.push(record);
      //});
      //
      //parser.on('end', function(p) {
      //  console.log('Finished parsing the dBase file');
      //  res.json(records);
      //});
      //
      //parser.parse();


    }
  }
};
