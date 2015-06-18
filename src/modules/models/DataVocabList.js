/**
 * @module Application
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class DataVocabList
     * @extends GelatoModel
     */
    var DataVocabList = GelatoModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.on('change', this.save);
        },
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @method getChanged
         * @returns {Object}
         */
        getChanged: function() {
            return $.extend(this.changed, {id: this.id});
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
            var currentIndex = this.get('currentIndex') || 0;
            var currentSection = this.get('currentSection') || sections[0];
            for (var i = 0, length = sections.length; i < length; i++) {
                var section = sections[0];
                if (this.get('sectionsSkipping').indexOf(section.id) > -1) {
                    continue;
                }
                if (section.id === currentSection) {
                    added += currentIndex;
                    passed = true;
                } else if (passed) {
                    added += section.rows.length;
                }
                total += section.rows.length;
            }
            return total ? Math.round(100 * added / total) : 100;
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
         * @method save
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         * @returns {DataVocabList}
         */
        save: function(callbackSuccess, callbackError) {
            var self = this;
            app.api.putVocabList(this.getChanged(), function(result) {
                self.set(result, {silent: true});
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess(self);
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
            return this;
        }
    });

    return DataVocabList;

});