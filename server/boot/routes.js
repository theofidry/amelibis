

/**
 * Synchronous boot script.
 *
 * Add custom routes.
 *
 * @param {App} app StrongLoop application object.
 */
module.exports = function(app) {

  var dbfImport = require('../middleware/dbf-import.js')(app);

  // Get Express router middleware
  var router = app.loopback.Router();

  router.post('/upload', dbfImport.myMiddleware);

  app.use(router);
};