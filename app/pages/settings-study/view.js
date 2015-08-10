var GelatoPage = require('gelato/page');

/**
 * @class SettingsStudy
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property title
     * @type {String}
     */
    title: 'Study Settings - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/settings-study/template'),
    /**
     * @method render
     * @returns {SettingsStudy}
     */
    render: function() {
        this.renderTemplate();
        this.renderFields();
        app.user.settings.fetch();
        return this;
    },
    /**
     * @method renderFields
     * @returns {SettingsStudy}
     */
    renderFields: function() {
        return this;
    },
    /**
     * @method remove
     * @returns {SettingsStudy}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    }
});
