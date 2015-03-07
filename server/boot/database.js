/**
 * Synchronous boot script.
 *
 * Update the database schema.
 *
 * @param {App} app StrongLoop application object.
 */
module.exports = function(app) {

  app.dataSources.amelibis.autoupdate(null, function(err) {

    if (err) {
      console.log(err);
    }
  });
};
