var GelatoView = require('gelato/modules/view');

/**
 * @class GelatoPage
 * @extends {GelatoView}
 */
module.exports = GelatoView.extend({
    /**
     * @property title
     * @type {String}
     */
    title: null,
    /**
     * @property el
     * @type {String}
     */
    el: 'gelato-application',
    /**
     * @property $page
     * @type {jQuery}
     */
    $page: null,
    /**
     * @method renderTemplate
     * @param {Object} [options]
     * @returns {GelatoView}
     */
    renderTemplate: function(options) {
        GelatoView.prototype.renderTemplate.call(this, options);
        this.$page = $(this.$('gelato-page').get(0));
        this.adjustNavbarPadding();
        return this;
    },
    /**
     * @method adjustNavbarPadding
     * @returns {GelatoPage}
     */
    adjustNavbarPadding: function() {
        var navbarFixedBottom = this.$('.fixed-bottom');
        var navbarFixedTop = this.$('.fixed-top');
        if (navbarFixedBottom.length) {
            $('body').css('padding-bottom', navbarFixedBottom.height());
        } else {
            $('body').css('padding-bottom', '');
        }
        if (navbarFixedTop.length) {
            $('body').css('padding-top', navbarFixedTop.height());
        } else {
            $('body').css('padding-top', '');
        }
        return this;
    },
    /**
     * @method getName
     * @returns {String}
     */
    getName: function() {
        return this.$('gelato-page').data('name');
    },
    /**
     * @method hide
     * @returns {GelatoComponent}
     */
    hide: function() {
        this.$page.hide();
        return this;
    },
    /**
     * @method remove
     * @returns {GelatoPage}
     */
    remove: function() {
        return GelatoView.prototype.remove.call(this);
    },
    /**
     * @method show
     * @returns {GelatoComponent}
     */
    show: function() {
        this.$page.show();
        return this;
    }
});
