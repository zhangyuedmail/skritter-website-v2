var GelatoPage = require('gelato/page');
var SettingsSidebar = require('components/settings-sidebar/view');
var DefaultNavbar = require('navbars/default/view');
var Subscription = require('models/subscription');
var Coupon = require('models/coupon');

/**
 * @class BillingSubscription
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @property bodyClass
     * @type {String}
     */
    bodyClass: 'background1',
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #redeem-code-btn': 'handleClickRedeemCodeButton'
    },
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.navbar = new DefaultNavbar();
        this.sidebar = new SettingsSidebar();
        this.subscription = new Subscription({ id: app.user.id });
        this.subscription.fetch();
        this.listenTo(this.subscription, 'state', this.renderMainContent);
        this.coupon = new Coupon({ code: '' });
        this.listenTo(this.coupon, 'sync', function(model, response) {
            this.subscription.set(response.Subscription);
            this.coupon.unset('code');
        });
        this.listenTo(this.coupon, 'state', this.renderMainContent);
    },
    /**
     * @method remove
     */
    remove: function() {
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    },
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.navbar.render();
        this.sidebar.setElement('#settings-sidebar-container').render();
        return this;
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'Subscription - Skritter',
    /**
     * @method handleClickRedeemCodeButton
     */
    handleClickRedeemCodeButton: function() {
        this.coupon.set('code', this.$('#code-input').val());
        this.coupon.use();
        this.renderMainContent();
    },
    /**
     * @method renderSectionContent
     */
    renderMainContent: function() {
        var context = require('globals');
        context.view = this;
        var rendering = $(this.template(context));
        this.$('.main-content').replaceWith(rendering.find('.main-content'));
    }
});
