var GelatoPage = require('gelato/page');

var AccountSidebar = require('components/account/sidebar/view');
var DefaultNavbar = require('navbars/default/view');

/**
 * @class AccountSettingsStudy
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new AccountSidebar();
        this.sourceLanguages = require('data/source-languages');
        this.listenTo(app.user, 'state', this.render);
        app.user.fetch();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'change #field-target-language': 'handleChangeTargetLanguage',
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
     * @returns {AccountSettingsStudy}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#sidebar-container').render();
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
     * @method handleChangeTargetLanguage
     * @param {Event} event
     */
    handleChangeTargetLanguage: function(event) {
        event.preventDefault();
        app.user.set('targetLang', this.$('#field-target-language').val());
        this.render();
    },
    /**
     * @method handleClickButtonSave
     * @param {Event} event
     */
    handleClickButtonSave: function(event) {
        event.preventDefault();
        app.user.set({
            autoAddComponentCharacters: this.$('#field-add-contained').is(':checked'),
            showHeisig: this.$('#field-heisig').is(':checked'),
            sourceLang: this.$('#field-source-language').val(),
            targetLang: this.$('#field-target-language').val()
        });
        if (app.isChinese()) {
            app.user.set({
                addSimplified: this.$('#field-styles [value="simp"]').is(':checked'),
                addTraditional: this.$('#field-styles [value="trad"]').is(':checked'),
                chineseStudyParts: this.getSelectedParts()
            });
        } else if (app.isJapanese()) {
            app.user.set({
                japaneseStudyParts: this.getSelectedParts(),
                studyKana: this.$('#field-study-kana').is(':checked'),
                studyRareWritings: this.$('#field-study-rare-writings').is(':checked'),
                studyAllListWritings: this.$('#field-study-all-list-writings').is(':checked')
            });
        }
        app.user.save();
    },
    /**
     * @method remove
     * @returns {AccountSettingsStudy}
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
