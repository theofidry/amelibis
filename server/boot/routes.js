var dbfUpload = require('../middleware/dbf-upload.js')();

/**
 * Synchronous boot script.
 *
 * Custom routes must be added here instead of in the server.js file.
 *
 * @param {App} app StrongLoop application object.
 */
module.exports = function(app) {

  'use strict';

  // Get Express router middleware
  var router = app.loopback.Router();

  router.post('/upload', dbfUpload);

  app.use(router);
};
