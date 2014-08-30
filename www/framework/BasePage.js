/**
 * @module Framework
 */
define([
    'framework/BaseView',
], function(BaseView) {
    /**
     * @class BasePage
     * @extends BaseView
     */
    return BaseView.extend({
        /**
         * @property el
         * @type String
         */
        el: "#application",
        /**
         * @property title
         * @type String
         */
        title: undefined,
        /**
         * @method events
         * @returns {Object}
         */
        events: function(){
            return _.extend({}, BaseView.prototype.events, {});
        },
        /**
         * @method compile
         * @param {String} template
         * @returns {String}
         */
        compile: function(template) {
            return Handlebars.compile(template)(app.strings);
        },
        /**
         * @method disableForm
         * @param {String} selector
         */
        disableForm: function(selector) {
            this.$((selector ? selector + ' ': '') + ':input').prop('disabled', true);
        },
        /**
         * @method enableForm
         * @param {String} selector
         */
        enableForm: function(selector) {
            this.$((selector ? selector: ' ') + ':input').prop('disabled', false);
        }
    });
});
