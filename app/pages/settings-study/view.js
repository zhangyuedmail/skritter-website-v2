var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var SettingsSidebar = require('components/settings-sidebar/view');

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
        this.listenTo(app.user, 'state', this.renderSectionContent);
        this.sidebar = new SettingsSidebar();
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
        this.sidebar.setElement(this.$('#settings-sidebar-container')[0]).render();
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
            autoAddComponentCharacters: this.$('#field-add-contained').is(':checked'),
            showHeisig: this.$('#field-heisig').is(':checked'),
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
                studyKana: this.$('#field-study-kana').is(':checked')
            });
        }

        app.user.save();
    },
    /**
     * @method remove
     * @returns {SettingsStudy}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method renderSectionContent
     */
    renderSectionContent: function() {
        var context = require('globals');
        context.view = this;
        var rendering = $(this.template(context));
        this.$('#section-content').replaceWith(rendering.find('#section-content'));
    }
});
