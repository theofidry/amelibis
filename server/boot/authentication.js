/**
 * Native synchronous boot script.
 *
 * @param {App} server StrongLoop application object.
 */
module.exports = function enableAuthentication(server) {

  'use strict';

  // enable authentication
  server.enableAuth();
};
