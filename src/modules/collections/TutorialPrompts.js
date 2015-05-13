/**
 * @module Application
 */
define([
    'core/modules/GelatoCollection',
    'modules/data/TutorialData',
    'modules/models/TutorialPrompt'
], function(GelatoCollection, TutorialData, TutorialPrompt) {

    /**
     * @class TutorialPrompts
     * @extends GelatoCollection
     */
    var TutorialPrompts = GelatoCollection.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.add(TutorialData.getData());
        },
        /**
         * @property model
         * @type TutorialPrompt
         */
        model: TutorialPrompt,
        /**
         * @method getByModule
         * @param {String} name
         * @return {TutorialPrompts}
         */
        getByModule: function(name) {
            return new TutorialPrompts(this.filter(function(module) {
                return module.get('module') === name;
            }));
        },
        /**
         * @method getVocabIds
         * @returns {Array}
         */
        getVocabIds: function() {
            return this.map(function(module) {
                return module.get('vocabId');
            });
        },
        /**
         * @method fetch
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        fetch: function(callbackSuccess, callbackError) {
            app.api.fetchVocabs({
                ids: this.getVocabIds().join('|'),
                include_decomps: true,
                include_strokes: true
            }, function(result) {
                app.user.data.decomps.add(result.Decomps);
                app.user.data.strokes.add(result.Strokes);
                app.user.data.vocabs.add(result.Vocabs);
                callbackSuccess();
            }, function(error) {
                callbackError(error);
            });
        }
    });

    return TutorialPrompts;

});