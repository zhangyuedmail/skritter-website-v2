/**
 * @module Framework
 */
define([], function() {
    return Backbone.Model.extend({
        /**
         * @class Gelato
         * @extends Backbone.Model
         * @constructor
         */
        initialize: function() {
            var resize = null;
            $.getJSON("framework/package.json", _.bind(this.set, this));
            $(window).resize(_.bind(function(event) {
                clearTimeout(resize);
                resize = setTimeout(_.bind(function() {
                    this.trigger("resize", event);
                }, this), 100);
            }, this));
        },
        /**
         * @method getVersion
         * @return {String}
         */
        getVersion: function() {
            return this.get("version");
        },
        /**
         * @method isLocal
         * @returns {Boolean}
         */
        isLocal: function() {
            return document.location.hostname === "localhost" ? true : false;
        },
        /**
         * @method isNative
         * @returns {Boolean}
         */
        isNative: function() {
            return document.location.protocol === "file:" ? true : false;
        }
    });
});
