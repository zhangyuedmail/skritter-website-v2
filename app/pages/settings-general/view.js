var GelatoPage = require('gelato/page');

/**
 * @class SettingsGeneral
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
    title: 'General Settings - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/settings-general/template'),
    /**
     * @method render
     * @returns {SettingsGeneral}
     */
    render: function() {
        this.renderTemplate();
        this.renderFields();
        app.user.settings.fetch();
        return this;
    },
    /**
     * @method renderFields
     * @returns {SettingsGeneral}
     */
    renderFields: function() {
        return this;
    },
    /**
     * @method remove
     * @returns {SettingsGeneral}
     */
    remove: function() {
        return GelatoPage.prototype.remove.call(this);
    }
});
