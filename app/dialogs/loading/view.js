var GelatoDialog = require('gelato/bootstrap/dialog');

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
