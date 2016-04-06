var GelatoComponent = require('gelato/component');

/**
 * @class StatsAllTimeComponent
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
        if (this.collection.length) {
            var totalCharactersLearned = this.collection.getAllTimeCharactersLearned();
            var totalWordsLearned = this.collection.getAllTimeWordsLearned();
            var totalItemsLearned = totalCharactersLearned + totalWordsLearned;
            
            this.$('#characters-learned').text(totalCharactersLearned);
            this.$('#words-learned').text(totalWordsLearned);
            this.$('#items-learned').text(totalItemsLearned);
        }
    }
});