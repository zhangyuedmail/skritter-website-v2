/**
 * @class Recognizer
 * @constructor
 */
function Recognizer() {
  this.baseAngleThreshold = 30;
  this.baseCornerPenalty = 50;
  this.baseCornerThreshold = 0;
  this.baseDistanceThreshold = 85;
  this.baseSize = 450;
  this.canvasSize = 450;
}

/**
 * @method recognize
 * @param {PromptStroke} stroke
 * @param {PromptCharacter} character
 * @param {Number} size
 */
Recognizer.prototype.recognize = function(stroke, character, size) {
  this.size = size;

  let results = this.getResults(stroke, character);

  results = _.filter(results, 'total');
  results = _.sortBy(results, 'total');

  if (results.length) {
    return results[0];
  }
};

Recognizer.prototype.getResults = function(stroke, character) {
  let strokes = [];
  let results = [];
  let targets = character.getExpectedTargets();

  for (let a = 0, lengthA = targets.length; a < lengthA; a++) {
    let target = targets[a];

    for (let b = 0, lengthB = target.length; b < lengthB; b++) {
      let targetStroke = target.at(b);

      if (targetStroke.get('position') === character.getPosition()) {
        strokes.push(targetStroke);

        results = results.concat(this.runChecks(stroke, targetStroke));
      }
    }
  }

  return results;
};

Recognizer.prototype.runChecks = function(userStroke, targetStroke) {
  let results = [];
  let params = targetStroke.getParams();

  for (let a = 0, lengthA = params.length; a < lengthA; a++) {
    let param = params[a];
    let skipChecks = param.get('skipChecks') || [];
    let strokeId = param.get('strokeId');

    if (strokeId === 387) {
      continue;
    }

    let result = userStroke.clone();
    let scores = {};
    let total = 0;

    if (skipChecks.indexOf('angle') === -1) {
      scores.angle = this.checkAngle(userStroke, param);
    }

    if (skipChecks.indexOf('corners') === -1) {
      scores.corners = this.checkCorners(userStroke, param);
    }

    if (skipChecks.indexOf('distance') === -1) {
      scores.distance = this.checkDistance(userStroke, param);
    }

    _.forEach(scores, (score) => {
      if (score > -1) {
        total += score;
      } else {
        total = false;

        return false;
      }
    });

    result.set({
      contains: targetStroke.get('contains'),
      data: targetStroke.get('data'),
      id: targetStroke.id,
      position: targetStroke.get('position'),
      shape: targetStroke.get('shape'),
      strokeId: targetStroke.get('strokeId'),
      variationId: targetStroke.get('variationId'),
      tone: targetStroke.get('tone'),
    });

    result.scores = scores;
    result.total = total;
    results.push(result);
  }

  return results;
};

/**
 * @method scaleThreshold
 * @param {Number} value
 * @returns {Number}
 */
Recognizer.prototype.scaleThreshold = function(value) {
  return value * (this.canvasSize / this.baseSize);
};

/**
 * @method checkAngle
 * @param {PromptStroke} userStroke
 * @param {Param} targetParam
 * @returns {Number}
 */
Recognizer.prototype.checkAngle = function(userStroke, targetParam) {
  let angleThreshold = targetParam.get('angleThreshold') || this.baseAngleThreshold;
  let targetAngle = targetParam.getFirstAngle();
  let userAngle = userStroke.getFirstAngle();
  let score = Math.abs(userAngle - targetAngle);

  if (score <= angleThreshold) {
    return score;
  }

  return -1;
};

/**
 * @method checkCorners
 * @param {PromptStroke} userStroke
 * @param {Param} targetParam
 * @returns {Number}
 */
Recognizer.prototype.checkCorners = function(userStroke, targetParam) {
  let cornerThreshold = targetParam.get('cornerThreshold') || this.baseCornerThreshold;
  let targetCorners = targetParam.get('corners');
  let userCorners = userStroke.get('corners');
  let score = Math.abs(targetCorners.length - userCorners.length);

  if (score <= cornerThreshold) {
    return score * this.baseCornerPenalty;
  }

  return -1;
};

/**
 * @method checkDistance
 * @param {PromptStroke} userStroke
 * @param {Param} targetParam
 * @returns {Number}
 */
Recognizer.prototype.checkDistance = function(userStroke, targetParam) {
  let targetCenter = targetParam.getRectangle().center;
  let userCenter = userStroke.getUserRectangle().center;
  let score = app.fn.getDistance(userCenter, targetCenter);

  if (score <= this.scaleThreshold(this.baseDistanceThreshold)) {
    return score;
  }

  return -1;
};

module.exports = Recognizer;
