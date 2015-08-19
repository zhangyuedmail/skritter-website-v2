var SkritterModel = require('base/skritter-model');

/**
 * @class Vocablist
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id',
    /**
     * @method getPopularity
     * @returns {Number}
     */
    getPopularity: function() {
        var peopleStudying = this.get('peopleStudying');
        if (peopleStudying === 0) {
            return 0;
        } else if (peopleStudying > 2000) {
            return 1;
        } else {
           return Math.pow(peopleStudying / 2000, 0.3)
        }
    },
    /**
     * @method getProgress
     * @returns {Number}
     */
    getProgress: function() {
        var added = 0;
        var passed = false;
        var total = 0;
        var sections = this.get('sections');
        if (this.get('studyingMode') === 'finished') {
            return 100;
        } else if (sections) {
            var currentIndex = this.get('currentIndex') || 0;
            var currentSection = this.get('currentSection') || sections[0].id;
            var sectionsSkipping = this.get('sectionsSkipping');
            for (var i = 0, length = sections.length; i < length; i++) {
                var section = sections[i];
                if (section.id === currentSection) {
                    added += currentIndex;
                    passed = true;
                }
                if (sectionsSkipping.indexOf(section.id) > -1) {
                    continue;
                }
                if (!passed) {
                    added += section.rows.length;
                }
                total += section.rows.length;
            }
            return total ? Math.round(100 * added / total) : 0;
        } else {
            return 0;
        }
    },
    /**
     * @method getSectionById
     * @param {String} sectionId
     * @returns {Object}
     */
    getSectionById: function(sectionId) {
        return _.find(this.get('sections'), {id: sectionId});
    },
    /**
     * @method getWordCount
     * @returns {Number}
     */
    getWordCount: function() {
        var count = 0;
        var rows = _.pluck(this.get('sections'), 'rows');
        for (var i = 0, length = rows.length; i < length; i++) {
            count += rows[i].length;
        }
        return count;
    },
    /**
     * @method isChinese
     * @returns {Boolean}
     */
    isChinese: function() {
        return this.get('lang') === 'zh';
    },
    /**
     * @method isJapanese
     * @returns {Boolean}
     */
    isJapanese: function() {
        return this.get('lang') === 'ja';
    }
});
