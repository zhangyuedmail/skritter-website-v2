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
        this.navbar.render();
        this.renderFields();
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
