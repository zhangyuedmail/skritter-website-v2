var Component = require('base/component');

/**
 * @class WordsSideBar
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
     * @returns {WordsSideBar}
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
