/**
 * @module Application
 */
define([
    'framework/BaseModel',
    'collections/data/DataDecomps',
    'collections/data/DataItems',
    'collections/data/DataParams',
    'collections/data/DataStrokes',
    'collections/data/DataVocabs',
    'collections/data/DataVocabLists'
], function(BaseModel, DataDecomps, DataItems, DataParams, DataStrokes, DataVocabs, DataVocabLists) {
    /**
     * @class UserData
     * @extends BaseModel
     */
    var UserData = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.decomps = new DataDecomps();
            this.items = new DataItems();
            this.params = new DataParams();
            this.strokes = new DataStrokes();
            this.vocabs = new DataVocabs();
            this.vocablists = new DataVocabLists();
            this.on('change', this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            access_token: undefined,
            batchId: undefined,
            expires_in: undefined,
            lastErrorCheck: 0,
            lastItemSync: 0,
            lastReviewSync: 0,
            lastSRSConfigSync: 0,
            lastVocabSync: 0,
            refresh_token: undefined,
            token_type: undefined,
            user_id: 'guest'
        },
        /**
         * @method cache
         */
        cache: function() {
            app.api.set('token', this.get('access_token'));
            localStorage.setItem(app.user.id + '-data', JSON.stringify(this.toJSON()));
        }
    });

    return UserData;
});