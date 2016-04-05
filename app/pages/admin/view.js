var GelatoPage = require('gelato/page');
var AdminPayments = require('collections/admin-payments');
var DefaultNavbar = require('navbars/default/view');
var MarketingFooter = require('components/marketing/footer/view');

/**
 * @class Admin
 * @extends {GelatoPage}
 */
var Admin = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.footer = new MarketingFooter();
        this.navbar = new DefaultNavbar();
        this.payments = new AdminPayments();
        this.listenTo(this.payments, 'sync', this.render);
        this.payments.fetch({
            data: {
                dateStart: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                limit: 5000
            }
        });
    },
    /**
     * @property title
     * @type {String}
     */
    title: 'Admin - Skritter',
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {Admin}
     */
    render: function() {
        this.renderTemplate();
        this.footer.setElement('#footer-container').render();
        this.navbar.setElement('#navbar-container').render();
        this.payments.getTotalByDate();
        return this;
    },
    /**
     * @method remove
     * @returns {Admin}
     */
    remove: function() {
        this.navbar.remove();
        this.footer.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});

module.exports = Admin;
