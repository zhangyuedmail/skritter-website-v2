/**
 * @class StudyPromptShortcuts
 * @param {Object} options
 * @constructor
 */
function StudyPromptShortcuts(options) {
    this.prompt = options.prompt;
    this.action = new keypress.Listener();
    this.grading = new keypress.Listener();
    this.navigate = new keypress.Listener();
    this.tone = new keypress.Listener();
}
/**
 * @method _handleGradingKeyup
 * @private
 */
StudyPromptShortcuts.prototype._handleActionAudio = function() {
    this.prompt.reviews.vocab.play();
};

/**
 * @method _handleGradingKeyup
 * @private
 */
StudyPromptShortcuts.prototype._handleActionErase = function() {
    switch (this.prompt.reviews.part) {
        case 'rune':
            this.prompt.review.set({complete: false, teach: false});
            this.prompt.review.character.reset();
            this.prompt.renderPart();
            break;
    }
};

/**
 * @method _handleGradingKeyup
 * @private
 */
StudyPromptShortcuts.prototype._handleActionShow = function() {
    this.prompt.canvas.clearLayer('character-hint');
    switch (this.prompt.reviews.part) {
        case 'rune':
            this.prompt.canvas.drawShape(
                'character-hint',
                this.prompt.review.character.getTargetShape(),
                {color: '#e8ded2'}
            );
            break;
        case 'tone':
            this.prompt.canvas.drawCharacter(
                'character-hint',
                this.prompt.review.vocab.get('writing'),
                {color: '#e8ded2', font: this.prompt.review.vocab.getFontName()}
            );
            break;
    }
};

/**
 * @method _handleGradingKeyup
 * @private
 */
StudyPromptShortcuts.prototype._handleActionTeach = function() {
    switch (this.prompt.reviews.part) {
        case 'rune':
            //TODO: start teaching mode
            break;
    }
};

/**
 * @method _handleGradingKeydown
 * @param {Number} value
 * @private
 */
StudyPromptShortcuts.prototype._handleGradingKeydown = function(value) {
    if (this.prompt.review.isComplete()) {
        this.prompt.toolbarGrading.select(value);
        this.prompt.review.set('score', value);
        this.prompt.canvas.injectLayerColor(
            'character',
            this.prompt.review.getGradingColor()
        );
    }
};

/**
 * @method _handleGradingKeyup
 * @param {Number} value
 * @private
 */
StudyPromptShortcuts.prototype._handleGradingKeyup = function(value) {
    if (this.prompt.review.isComplete()) {
        this.prompt.review.set('score', value);
        this.prompt.next();
    }
};

/**
 * @method _handleGradingKeyup
 * @private
 */
StudyPromptShortcuts.prototype._handleGradingToggle = function() {
    if (this.prompt.review.isComplete()) {
        this.prompt.review.set('score', this.review.get('score') === 1 ? 3 : 1);
        this.prompt.toolbarGrading.select(this.prompt.review.get('score'));
        this.prompt.canvas.injectLayerColor(
            'character',
            this.prompt.review.getGradingColor()
        );
    }
};

/**
 * @method _handleGradingKeyup
 * @private
 */
StudyPromptShortcuts.prototype._handleNavigateNext = function() {
    this.prompt.review.stop();
    this.prompt.next();
};

/**
 * @method _handleGradingKeyup
 * @private
 */
StudyPromptShortcuts.prototype._handleNavigatePrevious = function() {
    this.prompt.review.stop();
    this.prompt.previous();
};

/**
 * @method _handleGradingKeyup
 * @private
 */
StudyPromptShortcuts.prototype._handleNavigateReveal = function() {
    switch (this.prompt.reviews.part) {
        case 'rune':
            if (this.prompt.review.isComplete()) {
                this._handleNavigateNext();
            } else {
                this.prompt.canvas.completeCharacter();
                this.prompt.canvas.injectGradingColor();
                this.prompt.review.set('complete', true);
                this.prompt.renderPart();
            }
            break;
        case 'tone':
            if (this.prompt.review.isComplete()) {
                this._handleNavigateNext();
            } else {
                this.prompt.canvas.completeCharacter();
                this.prompt.canvas.injectGradingColor();
                this.prompt.review.set('complete', true);
                this.prompt.renderPart();
            }
            break;
        default:
            if (this.prompt.review.isComplete()) {
                this.prompt.next();
            } else {
                this.prompt.review.set('complete', true);
                this.prompt.renderPart();
            }
    }
};

/**
 * @method _handleGradingKeyup
 * @private
 */
StudyPromptShortcuts.prototype._handleToneKeydown = function() {
    var character = this.review.character;
    var possibleTones = this.review.getTones();
    var expectedTone = character.getTone(possibleTones[0]);
    if (possibleTones.indexOf(value) > -1) {
        character.reset();
        character.add(character.getTone(value));
        this.canvas.drawShape('character', character.getTone(value).getTargetShape());
        this.canvas.trigger('attempt:success');
    } else {
        character.reset();
        character.add(expectedTone);
        this.canvas.drawShape('character', expectedTone.getTargetShape());
        this.canvas.trigger('attempt:fail');
    }
    if (character.isComplete()) {
        this.canvas.trigger('complete');
    }
};

/**
 * @method _registerAction
 * @private
 */
StudyPromptShortcuts.prototype._registerAction = function() {
    this.action.register_many([
        {
            'keys': 'apostrophe',
            'on_keydown': _.bind(this._handleActionAudio, this),
            'prevent_repeat': true
        },
        {
            'keys': 'up',
            'on_keydown': _.bind(this._handleActionShow, this),
            'prevent_repeat': true
        },
        {
            'keys': '.',
            'on_keydown': _.bind(this._handleActionErase, this),
            'prevent_repeat': true
        },
        {
            'keys': 'a',
            'on_keydown': _.bind(this._handleActionAudio, this),
            'prevent_repeat': true
        },
        {
            'keys': 'l',
            'on_keydown': _.bind(this._handleActionShow, this),
            'prevent_repeat': true
        },
        {
            'keys': 's',
            'on_keydown': _.bind(this._handleActionShow, this),
            'prevent_repeat': true
        },
        {
            'keys': 't',
            'on_keydown': _.bind(this._handleActionTeach, this),
            'prevent_repeat': true
        },
        {
            'keys': 'x',
            'on_keydown': _.bind(this._handleActionErase, this),
            'prevent_repeat': true
        }
    ]);
};

/**
 * @method _registerGrading
 * @private
 */
StudyPromptShortcuts.prototype._registerGrading = function() {
    this.grading.register_many([
        {
            'keys': 'down',
            'on_keydown': _.bind(this._handleGradingToggle, this),
            'prevent_repeat': true
        },
        {
            'keys': 'm',
            'on_keydown': _.bind(this._handleGradingToggle, this),
            'prevent_repeat': true
        },
        {
            'keys': 'v',
            'on_keydown': _.bind(this._handleGradingToggle, this),
            'prevent_repeat': true
        },
        {
            'keys': '1',
            'on_keydown': _.bind(this._handleGradingKeydown, this, 1),
            'on_keyup': _.bind(this._handleGradingKeyup, this, 1),
            'prevent_repeat': true
        },
        {
            'keys': '6',
            'on_keydown': _.bind(this._handleGradingKeydown, this, 1),
            'on_keyup': _.bind(this._handleGradingKeyup, this, 1),
            'prevent_repeat': true
        },
        {
            'keys': '2',
            'on_keydown': _.bind(this._handleGradingKeydown, this, 2),
            'on_keyup': _.bind(this._handleGradingKeyup, this, 2),
            'prevent_repeat': true
        },
        {
            'keys': '7',
            'on_keydown': _.bind(this._handleGradingKeydown, this, 2),
            'on_keyup': _.bind(this._handleGradingKeyup, this, 2),
            'prevent_repeat': true
        },
        {
            'keys': '3',
            'on_keydown': _.bind(this._handleGradingKeydown, this, 3),
            'on_keyup': _.bind(this._handleGradingKeyup, this, 3),
            'prevent_repeat': true
        },
        {
            'keys': '8',
            'on_keydown': _.bind(this._handleGradingKeydown, this, 3),
            'on_keyup': _.bind(this._handleGradingKeyup, this, 3),
            'prevent_repeat': true
        },
        {
            'keys': '4',
            'on_keydown': _.bind(this._handleGradingKeydown, this, 4),
            'on_keyup': _.bind(this._handleGradingKeyup, this, 4),
            'prevent_repeat': true
        },
        {
            'keys': '9',
            'on_keydown': _.bind(this._handleGradingKeydown, this, 4),
            'on_keyup': _.bind(this._handleGradingKeyup, this, 4),
            'prevent_repeat': true
        }
    ]);
};

/**
 * @method _registerNavigate
 * @private
 */
StudyPromptShortcuts.prototype._registerNavigate = function() {
    this.navigate.register_many([
        {
            'keys': 'enter',
            'on_keydown': _.bind(this._handleNavigateReveal, this),
            'prevent_repeat': true
        },
        {
            'keys': 'left',
            'on_keydown': _.bind(this._handleNavigatePrevious, this),
            'prevent_repeat': true
        },
        {
            'keys': 'right',
            'on_keydown': _.bind(this._handleNavigateNext, this),
            'prevent_repeat': true
        },
        {
            'keys': 'space',
            'on_keydown': _.bind(this._handleNavigateReveal, this),
            'prevent_repeat': true
        }
    ]);
};

/**
 * @method _registerTone
 * @private
 */
StudyPromptShortcuts.prototype._registerTone = function() {
    this.tone.register_many([
        {
            'keys': '1',
            'on_keydown': _.bind(this._handleToneKeydown, this, 1),
            'prevent_repeat': true
        },
        {
            'keys': '6',
            'on_keydown': _.bind(this._handleToneKeydown, this, 1),
            'prevent_repeat': true
        },
        {
            'keys': '2',
            'on_keydown': _.bind(this._handleToneKeydown, this, 2),
            'prevent_repeat': true
        },
        {
            'keys': '7',
            'on_keydown': _.bind(this._handleToneKeydown, this, 2),
            'prevent_repeat': true
        },
        {
            'keys': '3',
            'on_keydown': _.bind(this._handleToneKeydown, this, 3),
            'prevent_repeat': true
        },
        {
            'keys': '8',
            'on_keydown': _.bind(this._handleToneKeydown, this, 3),
            'prevent_repeat': true
        },
        {
            'keys': '4',
            'on_keydown': _.bind(this._handleToneKeydown, this, 4),
            'prevent_repeat': true
        },
        {
            'keys': '9',
            'on_keydown': _.bind(this._handleToneKeydown, this, 4),
            'prevent_repeat': true
        },
        {
            'keys': '5',
            'on_keydown': _.bind(this._handleToneKeydown, this, 5),
            'prevent_repeat': true
        },
        {
            'keys': '0',
            'on_keydown': _.bind(this._handleToneKeydown, this, 5),
            'prevent_repeat': true
        }
    ]);
};

/**
 * @method registerAll
 * @returns {StudyPromptShortcuts}
 */
StudyPromptShortcuts.prototype.registerAll = function() {
    this.unregisterAll();
    this._registerAction();
    this._registerGrading();
    this._registerNavigate();
    this._registerTone();
    return this;
};

/**
 * @method unregisterAll
 * @returns {StudyPromptShortcuts}
 */
StudyPromptShortcuts.prototype.unregisterAll = function() {
    this.action.reset();
    this.grading.reset();
    this.navigate.reset();
    this.tone.reset();
    return this;
};

module.exports = StudyPromptShortcuts;
