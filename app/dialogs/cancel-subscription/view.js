var BootstrapDialog = require('base/bootstrap-dialog');
var CancellationReasons = require('collections/cancellation-reasons');
var Cancellation = require('models/cancellation');

/**
 * @class CancelSubscriptionDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
	/**
	 * @property events
	 * @type {Object}
	 */
	events: {
		'click #go-on-vacation-link': 'handleClickGoOnVacationLink',
		'click #continue-cancel-btn': 'handleClickContinueCancelButton',
		'click #submit-btn': 'handleClickSubmitButton'
	},
	/**
	 * @method initialize
	 * @param {Object} options
	 */
	initialize: function (options) {
		this.choseVacation = false;
		this.subscription = options.subscription;
		this.reasons = new CancellationReasons();
		this.reasons.fetch();
		this.listenToOnce(this.reasons, 'sync', this.renderReasonsForm);
	},
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @method render
	 * @returns {ListSettingsDialog}
	 */
	render: function () {
		this.renderTemplate();
		return this;
	},
	/**
	 * @method handleClickContinueCancelButton
	 */
	handleClickContinueCancelButton: function () {
		this.$('#page-1').addClass('hide');
		this.$('#page-2').removeClass('hide');
	},
	/**
	 * @method handleClickGoOnVacationLink
	 */
	handleClickGoOnVacationLink: function () {
		this.choseVacation = true;
		this.close();
	},
	/**
	 * @method handleClickSubmitButton
	 */
	handleClickSubmitButton: function () {
		var service = this.subscription.get('subscribed');
		if (!_.includes(['stripe', 'gplay'], service)) {
			return false;
		}
		$.when(
			this.requestUnsubscribe(),
			this.requestUpdateReceiveNewsletter(),
			this.requestSaveCancelReason()
		).done(app.reload);
	},
	/**
	 * @method renderSectionContent
	 */
	renderReasonsForm: function () {
		var context = require('globals');
		context.view = this;
		var rendering = $(this.template(context));
		this.$('#reasons-form').replaceWith(rendering.find('#reasons-form'));
	},
	/**
	 * @method requestUnsubscribe
	 * @return {jqxhr}
	 */
	requestUnsubscribe: function () {
		var service = this.subscription.get('subscribed');
		var url = app.getApiUrl() + this.subscription.url() + '/' + service + '/cancel';
		var headers = app.user.session.getHeaders();
		this.$('#submit-btn *').toggleClass('hide');
		return $.ajax({
			url: url,
			headers: headers,
			method: 'POST'
		});
	},
	/**
	 * @method requestUpdateReceiveNewsletter
	 */
	requestUpdateReceiveNewsletter: function () {
		var input = this.$('input[name="receive-newsletters"]');
		var receiveNewsletters = input.is(':checked');
		if (receiveNewsletters === app.user.get('allowEmailsFromSkritter')) {
			return;
		}
		var attrs = {
			id: app.user.id,
			allowEmailsFromSkritter: receiveNewsletters
		};
		var options = {
			patch: true,
			method: 'PUT'
		};
		return app.user.save(attrs, options);
	},
	/**
	 * @method requestSaveCancelReason
	 */
	requestSaveCancelReason: function () {
		var cancellation = new Cancellation({
			'reason': $('input[name="reason"]:checked').val(),
			'message': $('#notes-textarea').val()
		})
		return cancellation.save();
	}
});
