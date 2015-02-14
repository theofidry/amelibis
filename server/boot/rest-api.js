module.exports = function mountRestApi(server) {

  'use strict';

  var restApiRoot = server.get('restApiRoot');
  server.use(restApiRoot, server.loopback.rest());
};
