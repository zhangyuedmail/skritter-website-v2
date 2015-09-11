var SkritterModel = require('base/skritter-model');

/**
 * @class Item
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id',
    /**
     * @property urlRoot
     */
    urlRoot: 'items',
    /**
     * @method getBaseWriting
     * @returns {String}
     */
    getBaseWriting: function() {
        return this.id.split('-')[2];
    },
    getReadiness: function(now) {
        if (this.get('active')) {
            var itemLast = this.get('last') || 0;
            var itemNext = this.get('next') || 0;
            var actualAgo = now - itemLast;
            var scheduledAgo = itemNext - itemLast;
            return itemLast ? actualAgo / scheduledAgo : 9999;
        }
        return Number.NEGATIVE_INFINITY;
    },
    /**
     * @method isChinese
     * @returns {Boolean}
     */
    isChinese: function() {
        return this.get('lang') === 'zh';
    },
    /**
     * @method isJapanese
     * @returns {Boolean}
     */
    isJapanese: function() {
        return this.get('lang') === 'ja';
    },
    /**
     * @method isNew
     * @returns {Boolean}
     */
    isNew: function() {
        return !this.get('reviews');
    }
});
