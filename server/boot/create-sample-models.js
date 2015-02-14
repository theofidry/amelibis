///**
// * Migrates the models.
// *
// * Synchronous boot script.
// *
// * @param {Object} app StrongLoop application object.
// */
//module.exports = function (app) {
//
//  // Automigrate models
//  app.dataSources.amelibis.automigrate('CodifiedLPP', function (err) {
//
//    if (err) {
//      throw err;
//    }
//
//    // Date seeding
//    app.models.CodifiedLPP.create([
//      {
//        code:           90123495,
//        classification: 'Random LPP item.',
//        price:          '20',
//        dateBegin:      '2015-02-07',
//        dateEnd:        null
//      }
//    ], function (err, codifiedLPPList) {
//
//      if (err) {
//        throw err;
//      }
//
//      console.log('Models created: \n', codifiedLPPList);
//    });
//  });
//};
