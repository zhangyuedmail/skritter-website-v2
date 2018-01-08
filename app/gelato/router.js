/**
 * @class GelatoRouter
 * @extends {Backbone.Router}
 */
let GelatoRouter = Backbone.Router.extend({
  /**
   * @method go
   * @param {String} path
   * @param {Object} [options]
   * @returns {GelatoPage}
   */
  go: function (path, options) {
    this.trigger('page:navigate', path, options);
  },

  refresh: function () {
    const tmp = Backbone.history.fragment;
    this.navigate(tmp + (new Date).getTime());
    this.navigate(tmp, {
      trigger: true,
    });
  },

  /**
   * @method start
   * @param {Object} [options]
   * @returns {Boolean}
   */
  start: function (options) {
    options = _.defaults(
      options || {},
      {
        pushState: app.isWebsite(),
        root: '/',
      }
    );
    return Backbone.history.start({
      pushState: options.pushState,
      root: options.root,
    });
  },
});

module.exports = GelatoRouter;
