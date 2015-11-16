/**
 * @class GelatoRouter
 * @extends {Backbone.Router}
 */
module.exports = Backbone.Router.extend({
    /**
     * @method constructor
     * @param {Object} [options]
     * @param {GelatoApplication} [application]
     */
    constructor: function(options, application) {
        this.app = application;
        Backbone.Router.prototype.constructor.call(this, options);
    },
    /**
     * @property app
     * @type {GelatoApplication}
     */
    app: null,
    /**
     * @property page
     * @type {String}
     */
    page: null,
    /**
     * @method createPage
     * @param {String} path
     * @param {Object} [options]
     * @returns {GelatoPage}
     */
    createPage: function(path, options) {
        return new (require(path + '/view'))(options, this.app);
    },
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
        this.page = this.createPage(path, options);
        return this.page.render();
    },
    /**
     * @method start
     * @returns {Boolean}
     */
    start: function() {
        return Backbone.history.start({
            pushState: location.protocol !== 'file:',
            root: '/'
        });
    }
});
