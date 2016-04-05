var GelatoComponent = require('gelato/component');

/**
 * @class StatsHeatmapComponent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     *
     * @method initialize
     * @constructor
     */
    initialize: function(options) {
        this.listenTo(this.collection, 'state:standby', this.update);
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
    },
    
    update: function() {
        
    }
});