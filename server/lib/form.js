'use strict';

/**
 * Form handler. Use to retrieve and form data from the request for LPP dBase file upload.
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
     * Type of the file.
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
 * @returns {Form}
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

  return this;
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

module.exports = Form;
