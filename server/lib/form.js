'use strict';

/**
 * Form handler. Use to retrieve and form data from the request for LPP dBase file upload.
 *
 * @constructor
 */
function Form() {

  /**
   * @type {
   *  {
   *    file: Object|null,
   *    type: string|null
   *    }
   *  }
   */
  this.data = {
    /**
     * Submitted file.
     * @type {Object|null}
     */
    file: null,
    /**
     * Type of the file.
     * @type {string|null}
     */
    type: null
  };

  /**
   * Error message returned by the form validation.
   * @type {string|null}
   */
  this.err = null;
}

/**
 * Retrieve the form data submitted in the request.
 *
 * Expect:
 *  {string}       req.files.uploadFile Path to uploaded file.
 *  {(string)0, 1} req.data.type        0 for LPP items, 1 for LPP history
 *
 * @param {!Object} req The Express Request object.
 * @returns {Form} instance
 */
Form.prototype.handleRequest = function(req) {

  this.data.file = req.files.uploadFile || null;

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
      this.data.type = null;
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
  this.err = null;

  //
  // Check if the required data is there.
  //
  // Check if the file is here.
  if (!this.data.file) {
    this.err = 'No file found.';

    return false;
  }
  // Check if the file type is specified.
  if (!this.data.type) {
    this.err = 'File type not specified.';

    return false;
  }

  // Check the file extension.
  if (this.data.file.extension !== 'dbf') {
    this.err = 'Expected dBase (.dbf) file.';

    return false;
  }

  // Form data is valid.
  return true;
};

module.exports = Form;
