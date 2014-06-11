define([
    'model/data/Param',
    'function/ParamData'
], function(Param, ParamData) {
    /**
     * @class DataParams
     */
    var Params = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.add(ParamData);
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Param
    });

    return Params;
});