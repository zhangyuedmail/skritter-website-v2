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
        var results = this.getResults(stroke, character);
        results = _.filter(results, 'total');
        results = _.sortBy(results, 'total');
        if (results.length) {
            return results[0];
        }
    };

    Recognizer.prototype.getResults = function(stroke, character) {
        var results = [];
        var targets = character.getExpectedTargets();
        for (var a = 0, lengthA = targets.length; a < lengthA; a++) {
            var target = targets[a];
            for (var b = 0, lengthB = target.length; b < lengthB; b++) {
                var targetStroke = target.at(b);
                if (targetStroke.get('position') === character.getPosition()) {
                    results = results.concat(this.runChecks(stroke, targetStroke));
                }
            }
        }
        return results;
    };

    Recognizer.prototype.runChecks = function(userStroke, targetStroke) {
        var results = [];
        var params = targetStroke.getParams();
        for (var a = 0, lengthA = params.length; a < lengthA; a++) {
            var param = params[a];
            var strokeId = param.get('strokeId');
            if (strokeId === 387) {
                continue;
            }
            var result = userStroke.clone();
            var scores = {};
            var total = 0;
            scores.angle = this.checkAngle(userStroke, param);
            scores.corners = this.checkCorners(userStroke, param);
            if ([383, 384, 385, 386].indexOf(strokeId) === -1) {
                scores.distance = this.checkDistance(userStroke, param);
            }
            for (var check in scores) {
                var score = scores[check];
                if (score > -1) {
                    total += score;
                } else {
                    total = false;
                    break;
                }
            }
            result.set({
                contains: targetStroke.get('contains'),
                data: targetStroke.get('data'),
                id: targetStroke.id,
                position: targetStroke.get('position'),
                shape: targetStroke.get('shape'),
                strokeId: targetStroke.get('strokeId'),
                tone: targetStroke.get('tone')
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
        var angleThreshold = targetParam.get('angleThreshold') || this.baseAngleThreshold;
        var targetAngle = targetParam.getFirstAngle();
        var userAngle = userStroke.getFirstAngle();
        var score = Math.abs(userAngle - targetAngle);
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
        var cornerThreshold = targetParam.get('cornerThreshold') || this.baseCornerThreshold;
        var targetCorners = targetParam.get('corners');
        var userCorners = userStroke.get('corners');
        var score = Math.abs(targetCorners.length - userCorners.length);
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
        var targetCenter = targetParam.getRectangle().center;
        var userCenter = userStroke.getUserRectangle().center;
        var score = app.fn.getDistance(userCenter, targetCenter);
        if (score <= this.scaleThreshold(this.baseDistanceThreshold)) {
            return score;
        }
        return -1;
    };

module.exports = Recognizer;