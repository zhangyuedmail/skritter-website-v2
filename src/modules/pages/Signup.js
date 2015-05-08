/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/signup.html',
    'core/modules/GelatoPage'
], function(Template, GelatoPage) {

    /**
     * @class PageSignup
     * @extends GelatoPage
     */
    var PageSignup = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(options) {},
        /**
         * @property title
         * @type String
         */
        title: 'Signup - ' + i18n.global.title,
        /**
         * @method render
         * @returns {PageSignup}
         */
        render: function() {
            this.renderTemplate(Template);
            this.$('#trial-expire-date').text(Moment().add(7, 'days').format('MMMM Do YYYY'));
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick #login-submit': 'handleClickSignupSubmit'
        },
        /**
         * @method handleClickLoginSubmit
         * @param {Event} event
         */
        handleClickLoginSubmit: function(event) {
            event.preventDefault();
        }
    });

    return PageSignup;

});