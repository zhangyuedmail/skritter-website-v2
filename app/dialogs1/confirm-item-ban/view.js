var GelatoDialog = require('base/gelato-dialog');

/**
 * @class ConfirmItemBanDialog
 * @extends {GelatoDialog}
 */
var Dialog = GelatoDialog.extend({
    /**
     * @method initialize
     * @param {Object} options
     */
    initialize: function(options) {
        this.item = options.item;
        this.vocab = options.vocab;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-cancel': 'handleClickButtonCancel',
        'vclick #button-confirm': 'handleClickButtonConfirm'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {ConfirmItemBanDialog}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method handleClickButtonCancel
     * @param {Event} event
     */
    handleClickButtonCancel: function(event) {
        event.preventDefault();
        this.close();
    },
    /**
     * @method handleClickButtonConfirm
     * @param {Event} event
     */
    handleClickButtonConfirm: function(event) {
        event.preventDefault();
        if (this.item) {
            this.vocab.banPart(this.item.get('part'));
        } else {
            this.vocab.banAll();
        }
        this.vocab.save();
        this.trigger('confirm');
        this.close()
    }
});

module.exports = Dialog;
