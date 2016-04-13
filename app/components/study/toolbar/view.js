var GelatoComponent = require('gelato/component');

var ProgressStats = require('collections/progress-stats');
var StudySettings = require('dialogs/study-settings/view');
var Timer = require('components/study/toolbar/timer/view');

/**
 * @class StudyToolbar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
	/**
	 * @method initialize
	 * @constructor
	 */
	initialize: function(options) {
		this.page = options.page;
		this.stats = new ProgressStats();
		this.timer = new Timer();
		this.listenTo(this.stats, 'state:standby', this.updateTimerOffset);
		this.stats.fetchToday();
	},
	/**
	 * @property events
	 * @type {Object}
	 */
	events: {
		'click #button-add-item': 'handleClickAddItem',
		'click #button-study-settings': 'handleClickStudySettings'
	},
	/**
	 * @property template
	 * @type {Function}
	 */
	template: require('./template'),
	/**
	 * @method render
	 * @returns {StudyToolbar}
	 */
	render: function() {
		this.renderTemplate();
		this.timer.setElement('#timer-container').render();
		return this;
	},
	/**
	 * @method handleClickAddItem
	 * @param {Event} event
	 */
	handleClickAddItem: function(event) {
		event.preventDefault();
		this.page.schedule.addItems(
			{
				lang: app.getLanguage(),
				lists: this.page.vocablist ? this.page.vocablist.id : null
			},
			function(error, result) {
				var added = result.numVocabsAdded;
				$.notify(
					{
						title: 'Update',
						message: added + (added > 1 ? ' words have ' : ' word has ') + 'been added.'
					},
					{
						type: 'pastel-info',
						animate: {
							enter: 'animated fadeInDown',
							exit: 'animated fadeOutUp'
						},
						delay: 5000,
						icon_type: 'class'
					}
				);
			}
		);
	},
	/**
	 * @method handleClickStudySettings
	 * @param {Event} event
	 */
	handleClickStudySettings: function(event) {
		event.preventDefault();
		var self = this;
		var dialog = new StudySettings();
		dialog.open();
		dialog.on('save', function(settings) {
			ScreenLoader.show();
			ScreenLoader.post('Saving study settings');
			app.user.set(settings, {merge: true});
			app.user.cache();
			app.user.save(
				null,
				{
					error: function() {
						//TODO: show some kind of error message
						ScreenLoader.hide();
						dialog.close();
					},
					success: function() {
						self.page.schedule.reset();
						self.page.prompt.reset();
						self.page.loadSchedule();
						dialog.close();
					}
				}
			);
		});
	},
	/**
	 * @function remove
	 * @returns {StudyToolbar}
	 */
	remove: function() {
		this.timer.remove();
		return this;
	},
	/**
	 * @method updateTimerOffset
	 */
	updateTimerOffset: function(stats) {
		this.timer.setServerOffset(stats.getDailyTimeStudied());
	}
});
