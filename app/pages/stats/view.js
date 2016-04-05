var GelatoPage = require('gelato/page');
var DefaultNavbar = require('navbars/default/view');
var StatsSummaryComponent = require('components/stats/summary/view');
var StatsTimelineComponent = require('components/stats/timeline/view');
var ProgressStats = require('collections/progress-stats');

/**
 * @class Stats
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.statsCollection = new ProgressStats();

        // TODO: better this
        this.statsCollection.fetchMonth();

        this._views = {};
        this._views['navbar'] = new DefaultNavbar();
        this._views['summary'] = new StatsSummaryComponent({
            collection: this.statsCollection
        });
        this._views['timeline'] = new StatsTimelineComponent({
            collection: this.statsCollection
        });

        this.activeSection = 'summary';
    },

    events: {
        'vclick .stats-section-selector': 'handleStatsSectionSelectorClicked'
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
    title: 'Stats - Skritter',

    /**
     * @method render
     * @returns {Home}
     */
    render: function() {
        this.renderTemplate();
        this._views['navbar'].setElement('#navbar-container').render();
        this._views['summary'].setElement('#stats-summary-container').render();
        this._views['timeline'].setElement('#stats-timeline-container').render();

        this.showStatsSection();

        return this;
    },

    /**
     * @method remove
     * @returns {Home}
     */
    remove: function() {
        for (var view in this._views) {
            this._views[view].remove();
        }
        return GelatoPage.prototype.remove.call(this);
    },

    /**
     *
     * @param {String} [section] the section to show. Defaults to activeSection.
     */
    showStatsSection: function(section) {
        var toShowSection = section || this.activeSection;
        var toHideSection = toShowSection === 'summary' ? 'timeline' : 'summary';

        this._views[toHideSection].hide();
        this._views[toShowSection].show();
    },
    
    /**
     * 
     * @param {jQuery.Event} event a click event
     */
    handleStatsSectionSelectorClicked: function(event) {
        event.preventDefault();
        var newSection = event.target.id.split('-')[0];

        if (newSection === this.activeSection) {
            return;
        }

        this.$('#' + this.activeSection + '-selector').removeClass('active');
        this.$('#' + newSection + '-selector').addClass('active');
        this.activeSection = newSection;

        this.showStatsSection();
    }
});
