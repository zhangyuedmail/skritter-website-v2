const GelatoCollection = require('gelato/collection');
const PromptStrokeModel = require('models/PromptStrokeModel');

/**
 * @class PromptStrokeCollection
 * @extends {GelatoCollection}
 */
const PromptStrokeCollection = GelatoCollection.extend({

  /**
   * @property model
   * @type {PromptStrokeModel}
   */
  model: PromptStrokeModel,

  /**
   * @method comparator
   * @param {PromptStrokeModel} stroke
   * @returns {Number}
   */
  comparator: function(stroke) {
    return stroke.get('position');
  },

  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.attempts = 0;
    this.targets = [];
    this.writing = null;
  },

  /**
   * @method getExpectedStroke
   * @returns {PromptStrokeModel}
   */
  getExpectedStroke: function() {
    return this.getExpectedTargets()[0].at(this.length);
  },

  /**
   * @method getExpectedTargets
   * @returns {Array}
   */
  getExpectedTargets: function() {
    let expected = [];
    let scores = [];

    for (let a = 0, lengthA = this.targets.length; a < lengthA; a++) {
      let target = this.targets[a];

      scores[a] = 0;

      for (let b = 0, lengthB = this.length; b < lengthB; b++) {
        scores[a] += target.find({id: this.at(b).id}) ? 1 : 0;
      }
    }

    let best = scores[scores.indexOf(Math.max.apply(Math, scores))];

    for (let c = 0, lengthC = scores.length; c < lengthC; c++) {
      if (scores[c] === best) {
        expected.unshift(this.targets[c]);
      }
    }

    return expected.length ? expected : [this.targets[0]];
  },

  /**
   * @method getExpectedTone
   * @returns {PromptStrokeModel}
   */
  getExpectedTone: function() {
    return null;
  },

  /**
   * @method getMaxPosition
   * @returns {Number}
   */
  getMaxPosition: function() {
    let max = 0;

    for (let i = 0, length = this.targets.length; i < length; i++) {
      let targetMax = this.targets[i].getPosition();
      max = targetMax > max ? targetMax : max;
    }

    return max;
  },

  /**
   * @method getPosition
   * @returns {Number}
   */
  getPosition: function() {
    let position = 0;

    for (let i = 0, length = this.length; i < length; i++) {
      let contains = this.at(i).get('contains');
      position += contains.length ? contains.length : 1;
    }

    return position;
  },

  /**
   * @method size
   * @returns {Number}
   */
  getSize: function() {
    return app.get('canvasSize');
  },

  /**
   * @method getTargetShape
   * @param {Number} [excludeStrokes]
   * @returns {createjs.Container}
   */
  getTargetShape: function(excludeStrokes) {
    let container = new createjs.Container();
    let target = this.getExpectedTargets()[0];

    for (let i = 0, length = target.length; i < length; i++) {
      if (!excludeStrokes) {
        container.addChild(target.at(i).getTargetShape());
      }
    }
    container.name = 'character';

    return container;
  },

  /**
   * @method getTone
   * @param {Number} number
   * @returns {PromptStrokeModel}
   */
  getTone: function(number) {
    return this.writing === 'tones' ? this.targets[number - 1].at(0) : null;
  },

  /**
   * @method getUserShape
   * @param {Number} [excludeStrokes]
   * @returns {createjs.Container}
   */
  getUserShape: function(excludeStrokes) {
    let container = new createjs.Container();

    for (let i = 0, length = this.length; i < length; i++) {
      if (!excludeStrokes) {
        container.addChild(this.at(i).getTargetShape());
      }
    }
    container.name = 'character';

    return container;
  },

  /**
   * @method getUserSquig
   * @param {Number} [excludeStrokes]
   * @returns {createjs.Container}
   */
  getUserSquig: function(excludeStrokes) {
    let container = new createjs.Container();
    for (let i = 0, length = this.length; i < length; i++) {
      if (!excludeStrokes) {
        container.addChild(this.at(i).getUserSquig());
      }
    }
    container.name = 'character';
    return container;
  },

  /**
   * @method isComplete
   * @returns {Boolean}
   */
  isComplete: function() {
    return this.getPosition() >= this.getMaxPosition();
  },

  /**
   * @method isTweening
   * @returns {Boolean}
   */
  isTweening: function() {
    return this.map('tweening').indexOf(true) > -1;
  },

  /**
   * @method recognize
   * @param {Array} points
   * @param {createjs.Shape} shape
   * @returns {PromptStrokeModel}
   */
  recognize: function(points, shape) {
    if (points && points.length > 1) {
      let newStroke = new PromptStrokeModel({points: points});
      let stroke = app.fn.recognizer.recognize(newStroke, this, this.getSize());

      if (stroke) {
        stroke.set('squig', shape);

        return this.add(stroke);
      }
    }
  }
});

module.exports = PromptStrokeCollection;
