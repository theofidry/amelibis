'use strict';

var app = require(__dirname + '/../../server/server.js'),
  request = require('supertest'),
  test = require('unit.js');

describe('Test Form class.', function() {

  it('implements fluent interface', function() {
    //TODO
  });

  describe('test Form.handleRequest()', function() {

    it('retrieves uploaded file if any', function() {
      //TODO
    });

    it('expect one uploaded file at most', function() {
      //TODO
    });

    it('retrieves file type', function() {
      //TODO
    });

    it('retrieves does not consider unacknowledged file type', function() {
      //TODO
    });
  });

  describe('test Form.isValid()', function() {

    it('has no errors if is valid', function() {
      //TODO
    });

    it('has errors if is not valid', function() {
      //TODO
    });

    it('the file is required', function() {
      //TODO
    });

    it('the file type is required', function() {
      //TODO
    });
  });
});
