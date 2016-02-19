var GelatoModel = require('gelato/model');

var ReviewData = GelatoModel.extend( /** @lends ReviewData.prototype */ {
    /**
     * @class ReviewData
     * @param {Object} [attributes]
     * @param {Object} [options]
     * @augments {GelatoModel}
     */
    initialize: function(attributes, options) {
        this.review = options.review;
    },
    /**
     * @returns {Function|Object}
     */
    defaults: function() {
        return {
            itemId: null,
            vocabId: null,
            complete: false,
            filler: false,
            kana: false,
            reading: null,
            root: false,
            showContained: false,
            showDefinition: false,
            showMnemonic: false,
            showReading: false,
            showTeaching: false
        };
    },
    /**
     * @property {PromptCharacter}
     */
    character: null,
    /**
     * @property {Item}
     */
    item: null,
    /**
     * @property {Vocab}
     */
    vocab: null,
    /**
     * Is the definition hidden?
     * @returns {Boolean}
     */
    isDefinitionHidden: function() {
        if (this.get('showDefinition')) {
            return false;
        }
        if (this.review.get('part') === 'rdng' && !this.get('complete')) {
            return true;
        }
        if (this.isJapanese()) {
            return app.user.get('hideDefinition') && !this.review.isComplete();
        } else {
            return app.user.get('hideDefinition') && !this.get('complete');
        }
    },
    /**
     * Is the reading hidden?
     * @returns {Boolean}
     */
    isReadingHidden: function() {
        if (this.get('showReading')) {
            return false;
        }
        if (this.review.get('part') === 'defn' && !this.get('complete')) {
            return true;
        }
        if (this.review.isJapanese()) {
            return app.user.get('hideReading') && !this.review.isComplete();
        } else {
            return app.user.get('hideReading') && !this.get('complete');
        }
    }
});

module.exports = ReviewData;
