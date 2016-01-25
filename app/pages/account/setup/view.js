var GelatoPage = require('gelato/page');
var Navbar = require('navbars/default/view');

/**
 * @class AccountConfigure
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.countries = require('data/country-codes');
        this.navbar = new Navbar();
        this.timezones = require('data/country-timezones');
    },
    /**
     * @property events
     * @type Object
     */
    events: {
        'change #field-country': 'handleChangeFieldCountry',
        'change #field-language': 'handleChangeFieldLanguage',
        'vclick #button-continue': 'handleClickButtonContinue'
    },
    /**
     * @property settings
     * @type {Object}
     */
    settings: {
        addSimplified: true,
        addTraditional: false,
        country: 'US',
        targetLang: 'zh',
        timezone: 'America/New_York'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'Account Configure - Skritter',
    /**
     * @method render
     * @returns {Scratchpad}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        return this;
    },
    /**
     * @method handleChangeFieldCountry
     * @param {Event} event
     */
    handleChangeFieldCountry: function(event) {
        event.preventDefault();
        this.settings.country = this.$('#field-country :selected').val() || 'US';
        this.render();
    },
    /**
     * @method handleChangeFieldLanguage
     * @param {Event} event
     */
    handleChangeFieldLanguage: function(event) {
        event.preventDefault();
        this.settings.targetLang = this.$('#field-language').val() || 'zh';
        this.render();
    },
    /**
     * @method handleClickButtonContinue
     * @param {Event} event
     */
    handleClickButtonContinue: function(event) {
        event.preventDefault();
        this.state = 'saving';
        this.settings = {
            addSimplified: this.$('#field-styles [value="simplified"]').is(':checked'),
            addTraditional: this.$('#field-styles [value="traditional"]').is(':checked'),
            country: this.$('#field-country :selected').val(),
            targetLang: this.$('#field-language').val(),
            timezone: this.$('#field-timezone :selected').val()
        };
        app.user.save(
            this.settings,
            {
                error: function(error) {
                    console.error(error);
                },
                success: function() {
                    app.router.navigate('dashboard');
                    app.reload();
                }
            }
        );
        this.render();
    },
    /**
     * @method remove
     * @returns {Study}
     */
    remove: function() {
        this.navbar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
