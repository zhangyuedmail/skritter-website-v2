var GelatoDialog = require('gelato/modules/dialog');

/**
 * @class LoadingDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
    /**
     * @property template
     * @type {Function}
     */
    template: require('dialogs/loading/template'),
    /**
     * @method render
     * @returns {LoadingDialog}
     */
    render: function() {
        this.renderTemplate();
        return this;
    }
});
