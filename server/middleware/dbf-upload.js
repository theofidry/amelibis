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
 * dBase source file form handler.
 * @type {Form}
 */
var Form = require(__dirname + '/../lib/form.js');

/**
 *
 * @param {!Object} req Express Request object.
 * @param {!Object} res Express Response object.
 * @param {!Function} next Express next() function.
 */
function dbfUpload(req, res, next) {

  console.log('[dbfUpload] Request to upload a file made.');

  // Get the data submitted by the form request.
  var form = new Form();
  form.handleRequest(req);

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
}

/**
 * Handle the upload of dBase files for populating the LPP items.
 *
 * @return {Function}
 */
module.exports = function() {

  return dbfUpload;
};
