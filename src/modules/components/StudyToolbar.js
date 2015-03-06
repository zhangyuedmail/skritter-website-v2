/**
 * @module Application
 * @submodule Components
 */
define([
    'require.text!templates/components/study-toolbar.html',
    'core/modules/GelatoView'
], function(Template, GelatoView) {

    /**
     * @class StudyToolbar
     * @extends GelatoView
     */
    var StudyToolbar = GelatoView.extend({
        /**
         * @method initialize
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(options) {
            options = options || {};
            this.prompt = options.prompt;
            this.on('resize', this.resize);
        },
        /**
         * @method render
         * @returns {StudyToolbar}
         */
        render: function() {
            this.renderTemplate(Template);
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .option-collapse': 'handleClickOptionCollapse'
        },
        /**
         * @method handleClickOptionCollapse
         * @param {Event} event
         */
        handleClickOptionCollapse: function(event) {
            event.preventDefault();
            var target = $(event.currentTarget);
            var navbar = $('.gelato-navbar .navbar');
            var page = $('.gelato-page');
            if (navbar.is(':visible')) {
                navbar.hide('slide', {direction: 'up'}, 500);
                page.animate({'padding-top': 0}, 500);
                target.addClass('flip-180');
            } else {
                navbar.show('slide', {direction: 'up'}, 500);
                page.animate({'padding-top': 50}, 500);
                target.removeClass('flip-180');
            }
        },
        /**
         * @method hide
         * @returns {StudyToolbar}
         */
        hide: function() {
            this.$el.hide();
            return this;
        },
        /**
         * @method resize
         * @returns {StudyToolbar}
         */
        resize: function() {
            return this;
        },
        /**
         * @method show
         * @returns {StudyToolbar}
         */
        show: function() {
            this.$el.show();
            return this;
        }
    });

    return StudyToolbar;

});