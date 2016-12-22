const GelatoModel = require('gelato/model');
const PromptStrokeCollection = require('collections/PromptStrokeCollection');
const PromptStrokeModel = require('models/PromptStrokeModel');

/**
 * @class CharacterModel
 * @extends {GelatoModel}
 */
const CharacterModel = GelatoModel.extend({

  /**
   * @property idAttribute
   * @type {String}
   */
  idAttribute: '_id',

  /**
   * @property url
   * @type {String}
   */
  url: function() {
    return app.getApiUrl(2) + 'characters'
  },

  /**
   * @method getPromptCharacter
   * @returns {PromptStrokeCollection}
   */
  getPromptCharacter: function() {
    let character = new PromptStrokeCollection();
    let strokes = this.clone().get('strokeData');
    let variations = this.clone().get('strokeVariations');
    let rune = this.get('writing');
    let targets = [];
    for (let a = 0, lengthA = variations.length; a < lengthA; a++) {
      let target = new PromptStrokeCollection();
      let targetVariation = variations[a];
      let targetStrokeIds = targetVariation.strokeIds;
      let strokePosition = 0;
      target.position = a;
      for (let b = 0, lengthB = targetStrokeIds.length; b < lengthB; b++) {
        let stroke = new PromptStrokeModel();
        let strokeData = _.find(strokes, {strokeId: targetStrokeIds[b]});
        let strokeId = strokeData.shapeId;
        let strokeParams = this.collection.params.filter({strokeId: strokeId});
        let strokeContains = strokeParams[0].get('contains');
        let strokeShape = this.collection.shapes.get(strokeId);
        stroke.set({
          contains: strokeContains,
          data: strokeData,
          id: strokePosition + '-' + strokeId,
          params: strokeParams,
          position: strokePosition,
          shape: strokeShape,
          strokeId: strokeId,
          tone: rune === 'tones' ? a + 1 : null
        });
        strokePosition += strokeContains.length || 1;
        target.add(stroke);
      }
      targets.push(target);
    }
    character.targets = targets;
    character.writing = rune;
    return character;
  },

  /**
   * @method isKana
   * @returns {Boolean}
   */
  isKana: function() {
    return app.fn.isKana(this.get('rune'));
  }

});

module.exports = CharacterModel;
