var GelatoCollection = require('gelato/modules/collection');
var DataDecomp = require('models/data-decomp');

/**
 * @class DataDecomps
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property model
     * @type {DataDecomp}
     */
    model: DataDecomp
});
