define(function() {
    /**
     * @class Recognizer
     */
    function Recognizer() {
        this.angleThreshold = 45;
        this.cornersPenalty = 25;
        this.cornersThreshold = 2;
        this.distanceThreshold = 200;
        this.cornersLengthThreshold = 200;
        this.targetSize = 600;
    }
    /**
     * @method recognize
     * @param {Backbone.Model} userStroke
     * @param {Backbone.Collection} character
     * @returns {Backbone.Model}
     */
    Recognizer.prototype.recognize = function(userStroke, character) {
        var results = this.analyze(userStroke, character);
        results = _.filter(results, 'total');
        results = _.sortBy(results, 'total');
        if (results.length > 0 && !character.contains(results[0])) {
            return results[0];
        }
        return false;
    };
    /**
     * @method analyze
     * @param {Backbone.Model} userStroke
     * @param {Backbone.Collection} character
     * @returns {Array}
     */
    Recognizer.prototype.analyze = function(userStroke, character) {
        var results = [];
        var size = skritter.settings.getCanvasSize();
        for (var a = 0, lengthA = character.targets.length; a < lengthA; a++) {
            var target = character.targets[a];
            for (var b = 0, lengthB = target.length; b < lengthB; b++) {
                var stroke = target.at(b);                
                if (stroke.get('position') === character.getPosition()) {
                    var bitmapId = stroke.get('bitmapId');
                    var contains = stroke.get('contains');
                    var data = stroke.get('data');
                    var id = stroke.id;
                    var params = stroke.inflateParams();
                    var position = stroke.get('position');
                    var shape = stroke.get('shape');
                    var squigSize = size;
                    var tone = stroke.get('tone');
                    for (var c = 0, lengthC = params.length; c < lengthC; c++) {
                        var param = params[c];
                        var skipChecks = [];
                        var skipThreshold = false;
                        if (param.has('skipChecks')) {
                            skipChecks = param.get('skipChecks');
                            skipThreshold = skipChecks.indexOf('threshold');
                        }
                        var result = userStroke.clone();
                        var scores = {
                            angle: skipChecks.indexOf('angle') === -1 ? this.checkAngle(result, param, skipThreshold) : undefined,
                            corners: skipChecks.indexOf('corners') === -1 ? this.checkCorners(result, param, skipThreshold) : undefined,
                            cornersLength: skipChecks.indexOf('cornersLength') === -1 ? this.checkCornersLength(result, param, size, skipThreshold) : undefined,
                            distance: skipChecks.indexOf('distance') === -1 ? this.checkDistance(result, param, size, skipThreshold) : undefined
                        };
                        var total = 0;
                        for (var category in scores) {
                            var score = scores[category];
                            if (score === -1) {
                                total = false;
                                break;
                            } else if (score) {
                                total += score;
                            }
                        }
                        result.set({
                            bitmapId: bitmapId,
                            contains: contains,
                            data: data,
                            id: id,
                            param: param,
                            position: position,
                            scores: scores,
                            shape: shape,
                            squigSize: squigSize,
                            tone: tone
                        });
                        result.total = total;
                        results.push(result);
                    }
                }
            }
        }
        return results;
    };
    /**
     * @method checkAngle
     * @param {Backbone.Model} stroke
     * @param {Backbone.Model} target
     * @param {Boolean} skipThreshold
     * @returns {Number}
     */
    Recognizer.prototype.checkAngle = function(stroke, target, skipThreshold) {
        var score = Math.abs(stroke.getAngle() - target.getAngle());
        if (skipThreshold || score <= this.angleThreshold) {
            return score;
        }
        return -1;
    };
    /**
     * @method checkCorners
     * @param {Backbone.Model} stroke
     * @param {Backbone.Model} target
     * @param {Boolean} skipThreshold
     * @returns {Number}
     */
    Recognizer.prototype.checkCorners = function(stroke, target, skipThreshold) {
        var score = Math.abs(stroke.get('corners').length - target.get('corners').length);
        if (skipThreshold || score <= this.cornersThreshold) {
            return score === 0 ? score : score * this.cornersPenalty;
        }
        return -1;
    };
    /**
     * @method checkDistance
     * @param {Backbone.Model} stroke
     * @param {Backbone.Model} target
     * @param {Number} size
     * @param {Boolean} skipThreshold
     * @returns {Number}
     */
    Recognizer.prototype.checkDistance = function(stroke, target, size, skipThreshold) {
        var score = skritter.fn.getDistance(stroke.getRectangle().c, target.getRectangle().c);
        if (skipThreshold || score < this.distanceThreshold * (size / this.targetSize)) {
            return score;
        }
        return -1;
    };
    /**
     * @method checkCornersLength
     * @param {Backbone.Model} stroke
     * @param {Backbone.Model} target
     * @param {Number} size
     * @param {Boolean} skipThreshold
     * @returns {Number}
     */
    Recognizer.prototype.checkCornersLength = function(stroke, target, size, skipThreshold) {
        var score = Math.abs(stroke.getCornerLength() - target.getCornerLength());
        if (skipThreshold || score < this.cornersLengthThreshold * (size / this.targetSize)) {
            return score;
        }
        return -1;
    };

    return Recognizer;
});