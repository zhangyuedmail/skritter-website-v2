var GelatoModel = require('gelato/model');

/**
 * @class DataStat
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'date'
});
