var GelatoCollection = require('gelato/collection');
var PromptStroke = require('models/prompt-stroke');

/**
 * @class PromptCharacter
 * @extends {GelatoCollection}
 */
module.exports = GelatoCollection.extend({
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
   * @property model
   * @type {PromptStroke}
   */
  model: PromptStroke,
  /**
   * @method comparator
   * @param {PromptStroke} stroke
   * @returns {Number}
   */
  comparator: function(stroke) {
    return stroke.get('position');
  },
  /**
   * @method getExpectedStroke
   * @returns {PromptStroke}
   */
  getExpectedStroke: function() {
    return this.getExpectedTargets()[0].at(this.length);
  },
  /**
   * @method getExpectedTargets
   * @returns {Array}
   */
  getExpectedTargets: function() {
    var expected = [];
    var scores = [];
    for (var a = 0, lengthA = this.targets.length; a < lengthA; a++) {
      var target = this.targets[a];
      scores[a] = 0;
      for (var b = 0, lengthB = this.length; b < lengthB; b++) {
        scores[a] += target.find({id: this.at(b).id}) ? 1 : 0;
      }
    }
    var best = scores[scores.indexOf(Math.max.apply(Math, scores))];
    for (var c = 0, lengthC = scores.length; c < lengthC; c++) {
      if (scores[c] === best) {
        expected.unshift(this.targets[c]);
      }
    }
    return expected.length ? expected : [this.targets[0]];
  },
  /**
   * @method getExpectedTone
   * @returns {PromptStroke}
   */
  getExpectedTone: function() {
    return null;
  },
  /**
   * @method getMaxPosition
   * @returns {Number}
   */
  getMaxPosition: function() {
    var max = 0;
    for (var i = 0, length = this.targets.length; i < length; i++) {
      var targetMax = this.targets[i].getPosition();
      max = targetMax > max ? targetMax : max;
    }
    return max;
  },
  /**
   * @method getPosition
   * @returns {Number}
   */
  getPosition: function() {
    var position = 0;
    for (var i = 0, length = this.length; i < length; i++) {
      var contains = this.at(i).get('contains');
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
    var container = new createjs.Container();
    var target = this.getExpectedTargets()[0];
    for (var i = 0, length = target.length; i < length; i++) {
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
   * @returns {PromptStroke}
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
    var container = new createjs.Container();
    for (var i = 0, length = this.length; i < length; i++) {
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
    var container = new createjs.Container();
    for (var i = 0, length = this.length; i < length; i++) {
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
   * @returns {PromptStroke}
   */
  recognize: function(points, shape) {
    if (points && points.length > 1) {
      var newStroke = new PromptStroke({points: points});
      var stroke = app.fn.recognizer.recognize(newStroke, this, this.getSize());
      if (stroke) {
        stroke.set('squig', shape);
        return this.add(stroke);
      }
    }
  }
});
