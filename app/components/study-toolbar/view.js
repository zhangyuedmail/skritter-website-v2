var GelatoComponent = require('gelato/component');
var ProgressStats = require('collections/progress-stats');

/**
 * @class StudyToolbar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.stats = new ProgressStats();
        this.listenTo(this.stats, 'state:standby', this.render);
        this.stats.fetchToday();
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
        return this;
    }
});
