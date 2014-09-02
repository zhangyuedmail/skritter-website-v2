/**
 * @module Framework
 */
define([], function() {
    /**
     * @class BaseApplication
     * @extends Backbone.Model
     */
    return Backbone.Model.extend({
        /**
         * @method reload
         */
        reload: function() {
            if (app.router) {
                app.router.navigate('');
                location.reload(true);
            } else {
                location.href = '';
            }
        }
    });
});