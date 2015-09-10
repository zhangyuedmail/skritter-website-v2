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
        this.listenTo(app.user, 'state', this.render);
        app.user.fetch();
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
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
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
     * @method getSelectedParts
     * @returns {Array}
     */
    getSelectedParts: function() {
        var parts = [];
        this.$('#field-parts :checked').each(function() {
            parts.push($(this).val());
        });
        return parts;
    },
    /**
     * @method handleClickButtonSave
     * @param {Event} event
     */
    handleClickButtonSave: function(event) {
        event.preventDefault();
        app.user.set({
            addSimplified: this.$('#field-styles [value="simp"]').is(':checked'),
            addTraditional: this.$('#field-styles [value="trad"]').is(':checked'),
            autoAddComponentCharacters: this.$('#field-add-contained').is(':checked'),
            showHeisig: this.$('#field-heisig').is(':checked'),
            targetLang: this.$('#field-target-language').val()
        });
        app.user.set(app.isChinese() ? 'chineseStudyParts' : 'japaneseStudyParts', this.getSelectedParts());
        app.user.save();
    },
    /**
     * @method remove
     * @returns {SettingsStudy}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    }
});
