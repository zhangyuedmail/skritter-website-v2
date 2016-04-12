var GelatoDialog = require('base/gelato-dialog');

/**
 * @class DemoLanguageSelectDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
    /**
     * @method initialize
     * @param {Object} options
     */
    initialize: function(options) {},
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'click #button-select-chinese': 'handleClickButtonSelectChinese',
        'click #button-select-japanese': 'handleClickButtonSelectJapanese'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {DemoLanguageSelectDialog}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickButtonSelectChinese
     * @param {Event} event
     */
    handleClickButtonSelectChinese: function(event) {
        event.preventDefault();
        this.trigger('select', null, 'zh');
        this.close();
    },
    /**
     * @method handleClickButtonSelectJapanese
     * @param {Event} event
     */
    handleClickButtonSelectJapanese: function(event) {
        event.preventDefault();
        this.trigger('select', null, 'ja');
        this.close();
    }
});
