var GelatoComponent = require('gelato/component');

/**
 * @class AccountSidebar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @method render
	 * @returns {AccountSidebar}
	 */
	render: function() {
		this.renderTemplate();
		$.each(this.$('.options a'), function(i, el) {
			if ($(el).attr('href') === document.location.pathname) {
				$(el).addClass('active');
			}
		});
	}
});
