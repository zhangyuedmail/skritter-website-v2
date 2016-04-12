var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var MarketingFooter = require('components/marketing/footer/view');

/**
 * @class About
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
	/**
	 * Initializes a new About Us Page
	 * @constructor
	 */
	initialize: function () {
		this.footer = new MarketingFooter();
		this.navbar = new DefaultNavbar();
	},

	/**
	 * HTML Title text
	 * @type {String}
	 */
	title: 'About Us - Skritter',

	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),

	/**
	 * @method render
	 * @returns {About}
	 */
	render: function () {
		this.renderTemplate();
		if (app.user.isLoggedIn()) {
			this.$('#field-email').val(app.user.get('email'));
		}
		this.footer.setElement('#footer-container').render();
		this.navbar.setElement('#navbar-container').render();

		return this;
	},

	/**
	 * @method remove
	 * @returns {About}
	 */
	remove: function () {
		this.navbar.remove();
		this.footer.remove();

		return GelatoPage.prototype.remove.call(this);
	}
});
