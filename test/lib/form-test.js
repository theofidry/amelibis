'use strict';

var serverPath = __dirname + '/../../server';

var Form = require(serverPath + '/lib/form.js'),
  HttpMocks = require('node-mocks-http'),
  test = require('unit.js');

describe('Test Form class.', function() {

  var form, requestsWithValidData, requestsWithInvalidData;

  beforeEach(function() {
    form = new Form();
    requestsWithValidData = requestsWithValidDataProvider();
    requestsWithInvalidData = requestsWithInvalidDataProvider();
  });

  describe('test Form properties', function() {

    it('implements fluent interface', function() {

      var returnedForm = form.handleRequest(HttpMocks.createRequest());
      test.assert.deepEqual(form, returnedForm, 'Expected handleRequest() to return this.');
    });

    describe('test Form.data.file property', function() {

      it('must be null if file not found', function() {

        var invalidFiles = invalidFilesProvider();

        for (var k in invalidFiles) {
          if (invalidFiles.hasOwnProperty(k)) {

            var files = invalidFiles[k];

            if (!files.uploadFile) {
              form.handleRequest(HttpMocks.createRequest({files: files}));
              test.assert(form.data.file === null, 'Expected property to be null.');
            }
          }
        }
      });

      it('must be an object if file found', function() {

        var validFiles = validFilesProvider();

        for (var k in validFiles) {
          if (validFiles.hasOwnProperty(k)) {
            form.handleRequest(HttpMocks.createRequest({files: validFiles[k]}));
            test.assert(typeof form.data.file === 'object', 'Expected property to be an object.');
          }
        }
      });

      it('must be null if file not found even if was previously not null', function() {

        for (var k in requestsWithValidData) {
          if (requestsWithValidData.hasOwnProperty(k)) {
            form.handleRequest(requestsWithValidData[k]);

            for (var l in requestsWithInvalidData) {
              if (requestsWithInvalidData.hasOwnProperty(l)) {
                var request = requestsWithInvalidData[l];
                delete request.files.uploadFile;
                form.handleRequest(request);
                test.assert(form.data.file === null, 'Expected null file property.');
              }
            }
          }
        }
      });
    });

    describe('test Form.data.type property', function() {

      it('must be null if type not acknowledge', function() {

        var invalidFileTypes = invalidFileTypesProvider();

        for (var k in invalidFileTypes) {
          if (invalidFileTypes.hasOwnProperty(k)) {
            form.handleRequest(HttpMocks.createRequest({body: {type: invalidFileTypes[k]}}));
            test.assert(form.data.type === null, 'Expected property to be null.');
          }
        }
      });

      it('must be non empty string if type correct', function() {

        for (var k in requestsWithValidData) {
          if (requestsWithValidData.hasOwnProperty(k)) {
            form.handleRequest(requestsWithValidData[k]);
            test.assert(typeof form.data.type === 'string' && form.data.type.length > 0,
              'Expected property to be a non empty string.');
          }
        }
      });

      it('must be null if type not correct even if was previously correct', function() {

        var invalidFileTypes = invalidFileTypesProvider();

        for (var k in requestsWithValidData) {
          if (requestsWithValidData.hasOwnProperty(k)) {
            form.handleRequest(requestsWithValidData[k]);

            for (var l in invalidFileTypes) {
              if (invalidFileTypes.hasOwnProperty(l)) {
                form.handleRequest(HttpMocks.createRequest({body: {type: invalidFileTypes[l]}}));
                test.assert(form.data.type === null, 'Expected property to be null.');
              }
            }
          }
        }
      });
    });
  });

  describe('test Form.handleRequest()', function() {

    var form;

    beforeEach(function() {
      form = new Form();
    });

    it('retrieves uploaded file named uploadedFile if exists', function() {

      var validFiles = validFilesProvider(),
        invalidFiles = invalidFilesProvider(),
        k;

      for (k in validFiles) {
        if (validFiles.hasOwnProperty(k)) {
          form.handleRequest(HttpMocks.createRequest({files: validFiles[k]}));
          test.assert(typeof form.data.file === 'object', 'Expected to find file in form data.');
        }
      }

      for (k in invalidFiles) {
        if (invalidFiles.hasOwnProperty(k)) {
          var files = invalidFiles[k];
          if (!files.uploadFile) {
            form.handleRequest(HttpMocks.createRequest({files: files}));
            test.assert(form.data.file === null, 'Did not expect to find file in form data.');
          }
        }
      }
    });

    it('retrieves file type', function() {

      var validFileTypes = validFileTypesProvider(),
        invalidFileTypes = invalidFileTypesProvider(),
        k;

      for (k in validFileTypes) {
        if (validFileTypes.hasOwnProperty(k)) {
          form.handleRequest(HttpMocks.createRequest({body: {type: validFileTypes[k]}}));
          test.assert(typeof form.data.type === 'string' && form.data.type.length > 0,
            'Expected to find type in form data.');
        }
      }

      for (k in invalidFileTypes) {
        if (invalidFileTypes.hasOwnProperty(k)) {
          form.handleRequest(HttpMocks.createRequest({body: {type: invalidFileTypes[k]}}));
          test.assert(form.data.type === null, 'Did not expected to find type in form data.');
        }
      }
    });
  });

  it('test Form.isValid()', function() {

    var k;

    for (k in requestsWithValidData) {
      if (requestsWithValidData.hasOwnProperty(k)) {
        form.handleRequest(requestsWithValidData[k]);
        test.assert(form.isValid() === true && form.err === null, 'Expected valid form with no errors.');
      }
    }

    for (k in requestsWithInvalidData) {
      if (requestsWithInvalidData.hasOwnProperty(k)) {
        form.handleRequest(requestsWithInvalidData[k]);
        test.assert(
          form.isValid() === false && typeof form.err === 'string' && form.err.length > 0,
          'Expected invalid form with errors.' + form.data.file + form.data.type);
      }
    }
  });
})
;


//
// DATA PROVIDERS
//
/**
 * @returns {string[]}
 */
function validFileTypesProvider() {

  return ['0', '1'];
}

/**
 * @returns {Object[]}
 */
function invalidFileTypesProvider() {

  return [null, 0, 1, undefined, '', 'null', 'random'];
}

/**
 * @returns {Object[]}
 */
function validFilesProvider() {

  return [
    {
      uploadFile: {
        path: 'path/to/file',
        extension: 'dbf'
      }
    },
    {
      uploadFile: {
        path: 'path/to/file',
        extension: 'dbf'
      },
      anotherFile: {
        path: 'path/to/anotherFile',
        extension: 'csv'
      }
    }
  ];
}

/**
 * @returns {Object[]}
 */
function invalidFilesProvider() {

  var validFiles = validFilesProvider(),
    list = [];

  // files with wrong name
  list.push({
    wrongFile: {
      path: 'path/to/anotherFile',
      extension: 'dbf'
    }
  });

  // files with wrong extension
  for (var k in validFiles) {
    if (validFiles.hasOwnProperty(k)) {

      var file = validFiles[k];
      file.uploadFile.extension = 'dBase';
      list.push(file);

      file.uploadFile.extension = 'DBF';
      list.push(file);

      file.uploadFile.extension = 'dBF';
      list.push(file);

      file.uploadFile.extension = 'csv';
      list.push(file);

      file.uploadFile.extension = 'pdf';
      list.push(file);

      file.uploadFile.extension = 'jpeg';
      list.push(file);
    }
  }

  return list;
}

/**
 * Provides requests expected to be valid.
 *
 * @returns {*[]}
 */
function requestsWithValidDataProvider() {

  var types = validFileTypesProvider(),
    files = validFilesProvider(),
    requests = [];

  for (var k in types) {
    if (types.hasOwnProperty(k)) {
      for (var l in files) {
        if (files.hasOwnProperty(l)) {
          requests.push(HttpMocks.createRequest({
            body: {type: types[k]},
            files: files[l]
          }));
        }
      }
    }
  }

  return requests;
}

/**
 * Provides requests expected to be invalid.
 *
 * @returns {*[]}
 */
function requestsWithInvalidDataProvider() {

  var validTypes = validFileTypesProvider(),
    invalidTypes = invalidFileTypesProvider(),
    validFiles = validFilesProvider(),
    invalidFiles = invalidFilesProvider(),
    list = [HttpMocks.createRequest()];

  var pushRequestsByLists = function(typeList, filesList) {

    getListValues(typeList, filesList, function(type, files) {
      list.push(HttpMocks.createRequest({
        body: {type: type},
        files: files
      }));
    });
  };

  pushRequestsByLists(null, validFiles);
  pushRequestsByLists(null, invalidFiles);

  pushRequestsByLists(validTypes, null);
  pushRequestsByLists(validTypes, invalidFiles);

  pushRequestsByLists(invalidTypes, null);
  pushRequestsByLists(invalidTypes, validFiles);
  pushRequestsByLists(invalidTypes, invalidFiles);

  return list;
}

/**
 * Helper to retrieve all the values given by the combinaison of two list.
 *
 * @param {[]} list1
 * @param {[]} list2
 * @param {Function(*, *)} [cb] Callback function which takes as parameters a value of each list.
 */
function getListValues(list1, list2, cb) {

  var k, l;

  list1 = list1 || [];
  list2 = list2 || [];
  cb = (typeof cb === 'function')? cb: function(v1, v2) {};

  if (list1.length > 0 && list2.length > 0) {
    for (k in list1) {
      if (list1.hasOwnProperty(k)) {
        for (l in list2) {
          if (list2.hasOwnProperty(l)) {
            cb(list1[k], list2[l]);
          }
        }
      }
    }
  } else if (list1.length > 0) {
    for (k in list1) {
      if (list1.hasOwnProperty(k)) {
        cb(list1[k], null);
      }
    }
  } else if (list2.length > 0) {
    for (k in list2) {
      if (list2.hasOwnProperty(k)) {
        cb(null, list2[k]);
      }
    }
  }
}
