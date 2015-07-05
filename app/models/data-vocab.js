var GelatoModel = require('gelato/modules/model');

/**
 * @class DataVocab
 * @extends {GelatoModel}
 */
module.exports = GelatoModel.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {},
    /**
     * @method getPromptCharacters
     * @returns {Array}
     */
    getCanvasCharacters: function() {
        var characters = [];
        var strokes = this.getStrokes();
        for (var i = 0, length = strokes.length; i < length; i++) {
            characters.push(stroke[i].getPromptCharacter());
        }
        return _.without(characters, undefined);
    },
    /**
     * @method getPromptTones
     * @returns {Array}
     */
    getCanvasTones: function() {
        var characters = [];
        var strokes = this.getCharacters();
        for (var i = 0, length = strokes.length; i < length; i++) {
            characters.push(app.user.data.strokes.getPromptTones());
        }
        return _.without(characters, undefined);
    },
    /**
     * @method getCharacters
     * @returns {Array}
     */
    getCharacters: function() {
        return this.get('writing').split('');
    },
    /**
     * @method getStrokes
     * @returns {Array}
     */
    getStrokes: function() {
        var strokes = [];
        var characters = this.getCharacters();
        for (var i = 0, length = characters.length; i < length; i++) {
            strokes.push(app.user.data.strokes.get(characters[i]));
        }
        return _.without(strokes, undefined);
    }
});
