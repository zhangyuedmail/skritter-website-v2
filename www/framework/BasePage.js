/**
 * @module Framework
 */
define([
    'framework/BaseView',
], function(BaseView) {
    /**
     * @class BasePage
     * @extends BaseView
     */
    return BaseView.extend({
        /**
         * @property el
         * @type String
         */
        el: "#application",
        /**
         * @property title
         * @type String
         */
        title: undefined,
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BaseView.prototype.events, {
                'vclick .content-container': 'handleContentContainerClicked',
                'vclick .navbar-item': 'handleNavbarItemClicked',
                'vclick .navbar-menu.toggle': 'handleSidebarToggleClicked'
            }
        ),
        /**
         * @method disableForm
         * @param {String} [selector]
         * @returns {BasePage}
         */
        disableForm: function(selector) {
            this.$((selector ? selector + ' ': '') + ':input').prop('disabled', true);
            return this;
        },
        /**
         * @method enableForm
         * @param {String} [selector]
         * @returns {BasePage}
         */
        enableForm: function(selector) {
            this.$((selector ? selector: ' ') + ':input').prop('disabled', false);
            return this;
        },
        /**
         * @method getContentHeight
         * @returns {Number}
         */
        getContentHeight: function() {
            return this.$('#content').height();
        },
        /**
         * @method getContentWidth
         * @returns {Number}
         */
        getContentWidth: function() {
            return this.$('#content').width();
        },
        /**
         * @method handleContentContainerClicked
         */
        handleContentContainerClicked: function(event) {
            if (app.sidebars && app.sidebars.isExpanded()) {
                event.stopPropagation();
                app.sidebars.hide();
            }
        },
        /**
         * @method handleSidebarToggleClicked
         * @param {Event} event
         */
        handleSidebarToggleClicked: function(event) {
            if (app.sidebars) {
                app.sidebars.toggle();
            } else {
                event.preventDefault();
            }
        }

    });
});
