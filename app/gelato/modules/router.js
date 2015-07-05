/**
 * @class GelatoRouter
 * @extends {Backbone.Router}
 */
module.exports = Backbone.Router.extend({
    /**
     * @property page
     * @type {String}
     */
    page: null,
    /**
     * @method after
     */
    after: function() {
        if (this.page) {
            document.title = this.page.title || app.get('name');
        }
    },
    /**
     * @method before
     */
    before: function() {
        if (this.page) {
            this.page.remove();
        }
    }
});
