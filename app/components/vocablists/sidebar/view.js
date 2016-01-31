var GelatoComponent = require('gelato/component');

/**
 * @class VocablistSideBar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistSideBar}
     */
    render: function() {
        this.renderTemplate();
        if (document.location.pathname === '/vocablists') {
            this.$('.options > a:first-child').addClass('active');
        } else {
            this.$('.options > a').each(function(index, element) {
                var $element = $(element);
                if ($element.attr('href') === document.location.pathname) {
                    $element.addClass('active');
                }
            });
        }
    }
});
