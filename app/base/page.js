var View = require('./view');

/**
 * @class Page
 * @extends {View}
 */
module.exports = View.extend({
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: null,
    /**
     * @property el
     * @type {String}
     */
    el: 'gelato-application',
    /**
     * @property title
     * @type {String}
     */
    title: null,
    /**
     * @method renderTemplate
     * @param {Object} [context]
     * @returns {Page}
     */
    renderTemplate: function(context) {
        if (this.bodyClass) {
            $('body').addClass(this.bodyClass);
        }
        if (this.title) {
            document.title = this.title;
        }
        return View.prototype.renderTemplate.call(this, context);
    },
    /**
     * @method remove
     * @returns {Page}
     */
    remove: function() {
        if (this.bodyClass) {
            $('body').removeClass(this.bodyClass);
        }
        if (this.title) {
            document.title = '';
        }
        return View.prototype.remove.call(this);
    },
    /**
     * @method setTitle
     * @param {String} value
     * @returns {Page}
     */
    setTitle: function(value) {
        document.title = value;
        this.title = value;
        return this;
    }
});
