var GelatoComponent = require('gelato/component');
var TimeStudiedBragraphComponent = require('components/stats/time-studied-bargraph/view');
/**
 * A component that is a composite of graphs which show user study statistics
 * over a certain range of time.
 * @class StatsTimelineComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this._views = {};
        this._views['bargraph'] = new TimeStudiedBragraphComponent({
            collection: this.collection
        });
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistSideBar}
     */
    render: function() {
        this.renderTemplate();
        this._views['bargraph'].setElement('#time-studied-bar-graph-container').render();
    },

    onTabVisible: function() {
        this._views['bargraph'].redrawGraph();
    }
});
