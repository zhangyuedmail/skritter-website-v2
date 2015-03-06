/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class DataItem
     * @extends GelatoModel
     */
    var DataItem = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options || {};
            this.strokes = [];
            this.vocabs = [];
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            vocabIds: []
        },
        /**
         * @method getCharacters
         * @returns {Array}
         */
        getCharacters: function() {
            return this.getVocab().get('writing').split('');
        },
        /**
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            return this.get('reviews') ? false : true;
        },
        /**
         * @method isValid
         * @returns {Boolean}
         */
        isValid: function() {
            return this.attributes.vocabIds.length ? true : false;
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            var options = {merge: true, silent: true, sort: false};
            var vocabIds = self.get('vocabIds');
            Async.series([
                //vocabs
                function(callback) {
                    app.user.storage.get('vocabs', vocabIds, function(result) {
                        self.vocabs = app.user.data.vocabs.add(result, options);
                        callback();
                    }, function(error) {
                        callback('Unable to load vocabs.', error);
                    });
                },
                //strokes
                function(callback) {
                    app.user.storage.get('strokes', self.getCharacters(), function(result) {
                        self.strokes = app.user.data.strokes.add(result, options);
                        callback();
                    }, function(error) {
                        callback('Unable to load strokes.', error);
                    });
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackSuccess(self);
                }
            });
        },
        /**
         * @method getVocab
         * @returns {DataVocab}
         */
        getVocab: function() {
            var vocabs = this.vocabs;
            if (app.user.isChinese()) {
                return vocabs[this.get('reviews') % vocabs.length];
            }
            return vocabs[0];
        }
    });

    return DataItem;

});