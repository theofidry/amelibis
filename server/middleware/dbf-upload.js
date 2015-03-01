/**
 * File System object.
 * @type {exports}
 */
var fs = require('fs');

/**
 * Bytes Parser & Formatter.
 * @type {exports}
 */
var bytes = require('bytes');

/**
 * Handle the upload of dBase files for populating the LPP items.
 *
 * @return {Function}
 */
module.exports = function() {

  'use strict';

  /**
   * Form handler. Use to retrieve and form data from the request.
   *
   * @constructor
   */
  function Form() {

    /**
     * @type {{file: Document.uploadFile|undefined, type: *}}
     */
    this.data = {
      /**
       * Submitted file.
       * @type {Document.uploadFile|undefined}
       */
      file: undefined,
      /**
       * Type of the form.
       * @type {string}
       */
      type: ''
    };

    /**
     * Error message returned by the form validation.
     * @type {string}
     */
    this.err = '';
  }

  /**
   * Retrieve the form data submitted in the request.s
   *
   * @param {!Object} req The Express Request object.
   */
  Form.prototype.handleRequest = function(req) {

    this.data.file = req.files.uploadFile;

    switch (req.body.type) {

      // List of all LPP items.
      case '0':
        this.data.type = 'CodifiedLPP';
        break;

      // List of prices with period validity.
      case '1':
        this.data.type = 'CodifiedLPPHistory';
        break;

      default:
      //do nothing
    }
  };

  /**
   * Validates the form data. If the data is invalid, the form error message is updated.
   *
   * @return {boolean} True if the data is valid, false otherwise.
   */
  Form.prototype.isValid = function() {

    // Reset form error field.
    this.err = '';

    //
    // Check if the required data is there.
    //
    // Check if the file is here.
    if (this.data.file === undefined) {
      this.err = 'No file found.';

      return false;
    }
    // Check if the file type is specified.
    if (this.data.type === '') {
      this.err = 'File type not specified.';

      return false;
    }

    // Check the file extension.
    if (this.data.file.extension !== 'dbf') {
      return false;
    }

    // Form data is valid.
    return true;
  };

  return function dbfUpload(req, res, next) {

    console.log('[dbfUpload] Request to upload a file made.');

    var form = new Form();

    // Get the data submitted by the form request.
    form.handleRequest(req);

    // Check if there is a file present in the request.
    if (!form.data.file) {
      res.status(400).json({
        error: 'No file found.'
      });

      return;
    }

    //
    // Check if the file uploaded is valid.
    //
    if (!form.isValid()) {

      console.log('[dbfUpload] Data invalid.');
      res.status(400).json({
        error: form.err
      });

      return;
    }

    console.log('[dbfUpload] Data valid.');
    /**
     * Uploaded new filename.
     * @type {string}
     */
    var filename = form.data.type + '.' + form.data.file.extension;
    /**
     * Path to which the file is uploaded.
     * @type {string}
     */
    var tmpPath = form.data.file.path;
    /**
     * Path to which the file will be moved.
     * @type {string}
     */
    var targetPath = __dirname + '/../../client/files/' + filename;

    //
    // Save the file.
    //
    console.log('[dbfUpload] Save the file.');

    // Move the file from the temporary location to the intended location.
    fs.rename(tmpPath, targetPath, function(err) {

      if (err) {
        res.json(err);
        return;
      }

      console.log('[dbfUpload] Moved file from ' + tmpPath + ' to ' + targetPath);

      // Delete the temporary file.
      fs.unlink(tmpPath, function() {

        if (err) {
          res.json(err);
          return;
        }

        console.log('[dbfUpload] Temporary file deleted.');
        res.json({
          name: filename,
          size: bytes(form.data.file.size),
          bytes: form.data.file.size,
          mimeType: form.data.file.mimetype
        });
      });
    });
  };
};
