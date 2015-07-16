var GelatoModel = require('gelato/modules/model');

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
