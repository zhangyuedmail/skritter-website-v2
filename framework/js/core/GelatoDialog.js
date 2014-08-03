/**
 * @module Framework
 */
define([
    "framework/GelatoView",
    "requirejs.text!templates/dialogs.html"
], function(GelatoView, template) {
    return GelatoView.extend({
        /**
         * @class GelatoDialog
         * @extends GelatoView
         * @constructor
         */
        initialize: function() {
            this.id = undefined;
            this.options = {};
            this.render();
        },
        /**
         * @property el
         * @type String
         */
        el: "#dialog",
        /**
         * @method render
         * @returns {GelatoDialog}
         */
        render: function() {
            this.$el.html(this.compile(template));
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method element
         * @param {String} selector
         * @returns {jQuery}
         */
        element: function(selector) {
            return this.$el.find("#" + this.id + (selector ? " " + selector : ""));
        },
        /**
         * @method hide
         * @param {Function} callback
         * @returns {GelatoDialog}
         */
        hide: function(callback) {
            this.element().modal("hide").one("hidden.bs.modal", function() {
                if (typeof callback === "function") {
                    callback();
                }
            });
            this.id = undefined;
            return this;
        },
        /**
         * @method show
         * @param {String} dialogId
         * @param {Function} callback
         * @param {Object} options
         * @returns {GelatoDialog}
         */
        show: function(dialogId, callback, options) {
            this.id = dialogId ? "dialog-" + dialogId : "dialog-default";
            options = options ? options : this.options;
            options.backdrop = options.backdrop ? options.backdrop : "static";
            options.keyboard = options.keyboard ? options.keyboard : false;
            options.show = options.show ? options.show : true;
            options.remote = options.remote ? options.remote : false;
            this.element().modal(options).one("shown.bs.modal", function() {
                if (typeof callback === "function") {
                    callback();
                }
            });
            return this;
        }
    });
});