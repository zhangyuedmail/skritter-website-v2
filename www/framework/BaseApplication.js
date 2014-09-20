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
         * @method initialize
         * @constructor
         */
        initialize: function() {
            var resize = null;
            $(window).resize(_.bind(function(event) {
                clearTimeout(resize);
                resize = setTimeout(_.bind(function() {
                    this.trigger('resize', event);
                }, this), 100);
            }, this));
        },
        /**
         * @method isLandscape
         * @returns {Boolean}
         */
        isLandscape: function() {
            return $(window).width() > $(window).height();
        },
        /**
         * @method isPortrait
         * @returns {Boolean}
         */
        isPortrait: function() {
            return $(window).height() >= $(window).width();
        },
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
        },
        /**
         * @method triggerResize
         * @param {Event} event
         */
        triggerResize: function(event) {
            this.trigger('resize', event);
        }
    });
});