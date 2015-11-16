var Component = require('base/component');

/**
 * @class AccountSideBar
 * @extends {Component}
 */
module.exports = Component.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {AccountSideBar}
     */
    render: function() {
        this.renderTemplate();
        $.each(this.$('.options a'), function(i, el) {
            if ($(el).attr('href') === document.location.pathname) {
                $(el).addClass('active');
            }
        });
    }
});
