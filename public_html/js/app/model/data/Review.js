define([
    'view/prompt/Defn',
    'view/prompt/Rdng',
    'view/prompt/Rune',
    'view/prompt/Tone'
], function(PromptDefn, PromptRdng, PromptRune, PromptTone) {
    /**
     * @class DataReview
     */
    var Model = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {   
        },
        /**
         * @method createView
         * @return {Backbone.View}
         */
        createView: function() {
            var view = null;
            switch (this.get('part')) {
                case 'defn':
                    view = new PromptDefn();
                    break;
                case 'rdng':
                    view = new PromptRdng();
                    break;
                case 'rune':
                    view = new PromptRune();
                    break;
                case 'tone':
                    view = new PromptTone();
                    break;
            }
            view.set(this);
            return view;
        },
        /**
         * @method getBaseItem
         * @returns {Backbone.Model}
         */
        getBaseItem: function() {
            return skritter.user.data.items.get(this.get('reviews')[0].itemId);
        },
        /**
         * @method getBaseVocab
         * @returns {Backbone.Model}
         */
        getBaseVocab: function() {
            return this.getBaseItem().getVocab();
        }
    });

    return Model;
});