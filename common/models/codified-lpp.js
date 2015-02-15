/**
 * Extend or override model's behavior.
 *
 * @param {!Object} CodifiedLPP Model's class.
 */
module.exports = function(CodifiedLPP) {

  'use strict';

  CodifiedLPP.importFromFile = function(cb) {


  };

  CodifiedLPP.remoteMethod('import', {
    //accepts: {arg: 'filter', type: 'object'},
    //returns: {arg: 'stats', type: 'object'},
    http: { path: '/import' }
  }, CodifiedLPP.importFromFile);
};
