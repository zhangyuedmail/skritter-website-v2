/**
 * @class GelatoRouter
 * @extends {Backbone.Router}
 */
var GelatoRouter = Backbone.Router.extend({

  /**
   * @property page
   * @type {String}
   */
  page: null,

  /**
   * @method go
   * @param {String} path
   * @param {Object} [options]
   * @returns {GelatoPage}
   */
  go: function(path, options) {
    if (this.page) {
      this.page.remove();
    }
    window.scrollTo(0, 0);
    this.page = new (require(path))(options);
    return this.page.render();
  },

  /**
   * @method start
   * @param {Object} [options]
   * @returns {Boolean}
   */
  start: function(options) {
    options = _.defaults(
      options || {},
      {
        pushState: app.isWebsite(),
        root: '/'
      }
    );
    return Backbone.history.start({
      pushState: options.pushState,
      root: options.root
    });
  }
});

module.exports = GelatoRouter;
