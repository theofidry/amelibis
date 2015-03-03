/**
 * Native synchronous boot script.
 *
 * @param {App} server StrongLoop application object.
 */
module.exports = function(server) {

  'use strict';

  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/status', server.loopback.status());
  server.use(router);
};
