var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');

/**
 * @class SettingsStudy
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.listenTo(app.user.settings, 'state', this.render);
        app.user.settings.fetch();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-save': 'handleClickButtonSave'
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Study Settings - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {SettingsStudy}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.render();
        return this;
    },
    /**
     * @method handleClickButtonSave
     * @param {Event} event
     */
    handleClickButtonSave: function(event) {
        event.preventDefault();
        app.user.settings.set({
            autoAddComponentCharacters: this.$('#field-add-contained').is(':checked'),
            showHeisig: this.$('#field-heisig').is(':checked')
        }).save();
    },
    /**
     * @method remove
     * @returns {SettingsStudy}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    }
});
