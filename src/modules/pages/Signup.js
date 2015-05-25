/**
 * @module Application
 * @submodule Pages
 */
define([
    'require.text!templates/signup.html',
    'core/modules/GelatoPage',
    'modules/components/Footer'
], function(Template, GelatoPage, Footer) {

    /**
     * @class PageSignup
     * @extends GelatoPage
     */
    var PageSignup = GelatoPage.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.footer = new Footer();
        },
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
            this.footer.setElement(this.$('#footer-container')).render();
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
        },
        /**
         * @method remove
         * @returns {PageHome}
         */
        remove: function() {
            this.footer.remove();
            return GelatoPage.prototype.remove.call(this);
        },
        /**
         * @method select
         * @param {String} price
         * @returns {PageSignup}
         */
        select: function(price) {
            this.$('#signup-plan option[value="' + price + '"]').prop('selected', 'selected');
            return this;
        }
    });

    return PageSignup;

});