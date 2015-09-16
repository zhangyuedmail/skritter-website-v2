var GelatoComponent = require('gelato/component');

/**
 * @class SettingsSideBar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {SettingsSideBar}
     */
    render: function() {
        this.renderTemplate();
        this.$('[data-toggle="tooltip"]').tooltip();
        $.each(this.$('.options a'), function(i, el) {
            if ($(el).attr('href') === document.location.pathname) {
                $(el).addClass('active');
            }
        });
    }
});
