/**
 * @module Skritter
 * @submodule Storage
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Database
     */
    var Database = Backbone.Model.extend({
        /**
         * @property {Object} tables
         */
        tables: {
            decomps: {
                keys: ['writing'],
                columns: ['atomic', 'Children']
            },
            items: {
                keys: ['id'],
                columns: ['lang', 'part', 'vocabIds', 'style', 'timeStudied', 'next', 'last', 'interval', 'vocabListIds', 'sectionIds', 'reviews', 'successes', 'created', 'changed', 'previousSuccess', 'previousInterval']
            },
            reviews: {
                keys: ['id'],
                columns: ['base', 'contained', 'part', 'position']
            },
            sentences: {
                keys: ['id'],
                columns: ['containedVocabIds', 'definitions', 'lang', 'reading', 'starred', 'style', 'toughness', 'toughnessString', 'writing']
            },
            srsconfigs: {
                keys: ['part'],
                columns: ['lang', 'initialRightInterval', 'initialWrongInterval', 'rightFactors', 'wrongFactors']
            },
            strokes: {
                keys: ['rune'],
                columns: ['lang', 'strokes']
            },
            vocabs: {
                keys: ['id'],
                columns: ['writing', 'reading', 'definitions', 'customDefinitions', 'lang', 'audio', 'rareKanji', 'toughness', 'toughnessString', 'mnemonic', 'starred', 'style', 'changed', 'bannedParts', 'containedVocabIds', 'heisigDefinition', 'sentenceId', 'topMnemonic']
                
            },
            vocablists: {
                keys: ['id'],
                columns: ['name', 'lang', 'shortName', 'description', 'categories', 'creator', 'changed', 'published', 'deleted', 'parent', 'sort', 'singleSect', 'tags', 'editors', 'public', 'peopleStudying', 'studyingMode', 'currentSection', 'currentIndex', 'sectionsSkipping', 'autoSectionMovement', 'sections']
            }
        },
        /**
         * @method valueString
         * @param {Array} fieldArray
         * @returns {String}
         */
        valueString: function(fieldArray) {
            var valueString = '';
            for (var i = 1, length = fieldArray.length; i <= length; i++)
                valueString += i === fieldArray.length ? '?' : '?,';
            return valueString;
        }
    });

    return Database;
});