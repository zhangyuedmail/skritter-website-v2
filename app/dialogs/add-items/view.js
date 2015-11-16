var BootstrapDialog = require('base/bootstrap-dialog');

/**
 * @class AddItemsDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick .button-add': 'handleClickButtonAdd',
        'vclick #button-cancel': 'handleClickButtonCancel'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {AddItemsDialog}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickButtonAdd
     * @param {Event} event
     */
    handleClickButtonAdd: function(event) {
        event.preventDefault();
        var $button = $(event.target);
        this.trigger('add', parseInt($button.data('value'), 10));
    },
    /**
     * @method handleClickButtonCancel
     * @param {Event} event
     */
    handleClickButtonCancel: function(event) {
        event.preventDefault();
        this.close();
    }
});
