/**
 * Middleware to handle upload of dBase file.
 */
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

  // Disable the header 'X-Powered-By Express'.
  app.disable('x-powered-by');
  app.use(function(req, res, next) {
    res.removeHeader('x-powered-by');
    next();
  });

  // Get Express Router middleware.
  var router = app.loopback.Router();

  //
  // Custom routes
  //
  router.post('/upload', dbfUpload);

  // Set the application Router.
  app.use(router);
};
