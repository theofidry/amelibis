var fs = require('fs');

module.exports = function() {

  'use strict';

  return function named(req, res, next) {

    /**
     * Uploaded file.
     * @type {Document.uploadFile|undefined}
     */
    var uploadedFile = req.files.uploadFile;

    // Check if there is a file present in the request.
    if (!uploadedFile) {

      res.status(400).json({
        error: 'No file found.'
      });

      return;
    }

    // uploadedFile != undefined

    //
    // Check if the file uploaded is valid.
    //
    // Check the format
    //TODO
    // Check the max size
    //TODO
    // Check the name
    //TODO

    /**
     * Uploaded new filename.
     * @type {string}
     */
    var filename = req.body.type + '.' + uploadedFile.extension;
    /**
     * Path to which the file is uploaded.
     * @type {string}
     */
    var tmpPath = uploadedFile.path;
    /**
     * Path to which the file will be moved.
     * @type {string}
     */
    var targetPath = __dirname + '/../files' + filename;


    //
    // Save the file.
    //

    // Move the file from the temporary location to the intended location.
    fs.rename(tmpPath, targetPath, function(err) {

      if (err) {
        res.json(err);
        return;
      }

      // Delete the temporary file
      fs.unlink(tmpPath, function() {

        if (err) {
          res.json(err);
          return;
        }

        res.json({
          name: filename,
          size: '',
          bytes: uploadedFile.size,
          mime_type: uploadedFile.mimetype
        });
      });
    });
  };
};
