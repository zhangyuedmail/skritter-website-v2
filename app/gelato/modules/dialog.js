var GelatoView = require('gelato/modules/view');

/**
 * @class GelatoDialog
 * @extends {GelatoView}
 */
module.exports = GelatoView.extend({
    /**
     * @property el
     * @type {String}
     */
    el: 'gelato-dialogs',
    /**
     * @property dialog
     * @type {jQuery}
     */
    dialog: null,
    /**
     * @property $dialog
     * @type {jQuery}
     */
    $dialog: null,
    /**
     * @method renderTemplate
     * @param {Object} [options]
     * @returns {GelatoView}
     */
    renderTemplate: function(options) {
        GelatoView.prototype.renderTemplate.call(this, options);
        this.$dialog = $(this.$('gelato-dialog').get(0));
        return this;
    },
    /**
     * @method close
     * @returns {GelatoDialog}
     */
    close: function() {
        this.dialog.modal('hide');
        return this;
    },
    /**
     * @method open
     * @param {Object} [options]
     * @returns {GelatoDialog}
     */
    open: function(options) {
        options = options || {};
        options.backdrop = options.backdrop || 'static';
        options.keyboard = options.keyboard || false;
        options.show = options.show || true;
        options.remote = options.remote || false;
        this.dialog = this.$('[role="dialog"]');
        this.dialog.modal(options);
        return this;
    }
});
