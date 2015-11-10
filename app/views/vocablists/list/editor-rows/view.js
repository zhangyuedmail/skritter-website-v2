var Component = require('base/component');

var Vocab = require('models/vocab');
var Vocabs = require('collections/vocabs');

/**
 * @class VocablistsListEditorRows
 * @extends {Component}
 */
module.exports = Component.extend({
    /**
     * @method initialize
     * @param {Object} options
     * @constructor
     */
    initialize: function(options) {
        this.vocablist = options.vocablist;
        this.vocablistSection = options.vocablistSection;
        this.listenTo(this.vocablist, 'change:sections', this.render);
        this.listenTo(this.vocablistSection, 'change:vocabs', this.render);
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #remove-word': 'handleClickRemoveWord',
        'vclick .result-row': 'handleClickResultRow',
        'vclick .show-results': 'handleClickShowResults'
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistsListEditorRows}
     */
    render: function() {
        this.renderTemplate();
        this.$('#vocablist-section-rows').sortable({update: _.bind(this.handleUpdateSort, this)});
    },
    /**
     * @method addWord
     * @param {String} query
     */
    addWord: function(query) {
        var vocab = new Vocab({q: query});
        this.vocablistSection.get('vocabs').push(vocab);
        vocab.fetch({
            data: {q: query},
            error: function(a, b) {},
            success: _.bind(function(model) {
                var vocabs = model.get('Vocabs').map(function(vocab) {
                    return new Vocab(vocab);
                });
                var groups = _.groupBy(vocabs, function(vocab) {
                    return vocab.getBase();
                });
                var rows = [];
                for (var writing in groups) {
                    var group = groups[writing];
                    if (group.length === 1) {
                        rows.push({vocabs: [group[0], group[0]]});
                    } else {
                        for (var i = 1, length = group.length; i < length; i++) {
                            rows.push({vocabs: [group[0], group[i]]});
                        }
                    }
                }
                if (rows.length) {
                    model.set('activeRow', rows[0]);
                    model.set('parsedGroups', groups);
                    model.set('parsedRows', rows);
                    model.set('parsedVocabs', vocabs);
                    model.set('vocabId', rows[0].vocabs[0].id);
                    model.set('tradVocabId', rows[0].vocabs[1].id);
                    model.set('studyWriting', true);
                    model.set(rows[0].vocabs[0].toJSON(), {merge: true});
                    model.unset('Vocabs');
                    console.log(model);
                }
                this.render();
            }, this)
        });

        this.render();
    },
    /**
     * @method handleClickRemoveWord
     * @param {Event} event
     */
    handleClickRemoveWord: function(event) {
        event.preventDefault();
        var $row = $(event.target).closest('.row');
        this.removeWord($row.data('vocab-id'));
        this.render();
    },
    /**
     * @method handleClickResultRow
     * @param {Event} event
     */
    handleClickResultRow: function(event) {
        event.preventDefault();
        var $row = $(event.target).closest('.row');
        var $resultRow = $(event.target).closest('.result-row');
        var vocab = _.find(this.vocablistSection.get('vocabs'), {id: $row.data('vocab-id')});
        var activeRow = vocab.get('parsedRows')[parseInt($resultRow.data('row-index'), 10)];
        vocab.set('activeRow', activeRow);
        vocab.set('vocabId', activeRow.vocabs[0].id);
        vocab.set('tradVocabId', activeRow.vocabs[1].id);
        vocab.set('studyWriting', true);
        vocab.set(activeRow.vocabs[0].toJSON(), {merge: true});
        this.render();

    },
    /**
     * @method handleClickShowResults
     * @param {Event} event
     */
    handleClickShowResults: function(event) {
        event.preventDefault();
        var $row = $(event.target).closest('.row');
        var $resultRows = $row.children('.result-rows');
        if ($resultRows.hasClass('hidden')) {
            $resultRows.removeClass('hidden');
        } else {
            $resultRows.addClass('hidden');
        }
    },
    /**
     * @method handleUpdateSort
     * @param {Event} event
     */
    handleUpdateSort: function(event) {
        var sortedVocabs = [];
        var vocabs = this.vocablistSection.get('vocabs');
        this.$('#vocablist-section-rows').children('.row').map(function(index, element) {
            var vocab = _.find(vocabs, function(vocab) {
                return vocab.get('tradVocabId') === $(element).data('vocab-id');
            });
            sortedVocabs.push(vocab);
        });
        this.vocablistSection.set('vocabs', sortedVocabs);
    },
    /**
     * @method removeWord
     * @param vocabId
     */
    removeWord: function(vocabId) {
        _.remove(this.vocablistSection.get('vocabs'), function(vocab) {
            return vocab.get('tradVocabId') === vocabId;
        });
    }
});
