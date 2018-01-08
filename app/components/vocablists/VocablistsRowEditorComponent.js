const GelatoComponent = require('gelato/component');
const Vocabs = require('collections/VocabCollection');
const VocabCreatorDialog = require('dialogs1/vocab-creator/view');

/**
 * @class VocablistsRowEditorComponent
 * @extends {GelatoComponent}
 */
const VocablistsRowEditorComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .add-entry': 'handleClickAddEntry',
    'click .remove-row': 'handleClickRemoveRow',
    'click .result-row': 'handleClickResultRow',
    'click .section-link': 'handleClickSectionLink',
    'click .show-results': 'handleClickShowResults',
    'click .study-writing': 'handleClickStudyWriting',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: app.isMobile() ? require('./MobileVocablistsRowEditor') : require('./VocablistsRowEditor'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function (options) {
    this.changed = false;
    this.editing = options.editing || false;
    this.rows = [];
    this.saved = [];
    this.vocablist = options.vocablist;
    this.vocablistSection = options.vocablistSection;
    this.listenTo(this.vocablistSection, 'state', this.render);
  },

  /**
   * @method render
   * @returns {VocablistsRowEditorComponent}
   */
  render: function () {
    this.renderTemplate();

    if (this.editing) {
      this.$('#vocablist-section-rows').sortable({update: _.bind(this.handleUpdateSort, this)});
    }
  },

  /**
   * @method addRow
   * @param {String} query
   */
  addRow: function (query) {
    let self = this;
    let queryVocabs = new Vocabs();
    let row = {lang: this.vocablist.get('lang'), query: query, state: 'loading'};

    this.rows.push(row);
    queryVocabs.fetch({
      data: {
        q: query,
        lang: this.vocablist.get('lang'),
      },
      error: function (a, b) {
      },
      success: _.bind(function (collection) {
        let results = [];
        let groups = collection.groupBy(function (vocab) {
          return vocab.getBase();
        });
        for (let writing in groups) {
          if (groups.hasOwnProperty(writing)) {
            let group = groups[writing];
            if (group[0].isJapanese()) {
              for (let a = 0, lengthA = group.length; a < lengthA; a++) {
                results.push({vocabs: [group[a], group[a]]});
              }
            } else if (group.length === 1) {
              results.push({vocabs: [group[0], group[0]]});
            } else {
              for (let b = 1, lengthB = group.length; b < lengthB; b++) {
                results.push({vocabs: [group[0], group[b]]});
              }
            }
          }
        }
        if (results.length) {
          row.results = results;
          row.vocabs = results[0].vocabs;
          row.vocabId = results[0].vocabs[0].id;
          row.tradVocabId = results[0].vocabs[1].id;
          row.studyWriting = true;
          row.id = row.vocabId + '-' + row.tradVocabId;
          if (self.vocablist.isJapanese()) {
            row.id = row.vocabId;
          }
          row.state = 'loaded';
        } else {
          row.id = query;
          if (self.vocablist.isChinese()) {
            row.writing = app.fn.mapper.toSimplified(query);
            row.writingTrads = app.fn.mapper.toTraditional(query);
          } else {
            row.writing = query;
          }
          row.state = 'not-found';
        }
        this.render();
      }, this),
    });
  },

  addRows: function (rows) {
    _.forEach(
      _.compact(rows),
      (row) => {
        this.addRow(row);
      }
    );

    this.render();
  },

  /**
   * @method discardChanges
   */
  discardChanges: function () {
    this.rows = _.clone(this.saved);
    this.render();
  },

  /**
   * Returns a filtered list of verified rows with vocabIds.
   *
   * @method getRows
   * @returns {Array}
   */
  getRows: function () {
    return _.filter(
      this.rows,
      function (row) {
        return _.isString(row.vocabId);
      }
    );
  },

  /**
   * Handles when the user clicks the add entry button.
   * @method handleClickAddEntry
   * @param {Event} event the click event
   */
  handleClickAddEntry: function (event) {
    event.preventDefault();

    const self = this;
    const $row = $(event.target).closest('.row');
    const index = $row.data('index');
    const row = this.rows[parseInt(index, 10)];

    this.dialog = new VocabCreatorDialog();
    this.dialog.open({row: row});
    this.dialog.on(
      'vocab',
      function (vocab) {
        self.removeRow(index);
        self.addRow(vocab.get('writing'));
      }
    );
  },

  /**
   * @method handleClickRemoveRow
   * @param {Event} event
   */
  handleClickRemoveRow: function (event) {
    event.preventDefault();

    const $row = $(event.target).closest('.row');
    this.removeRow($row.data('index'));

    this.render();
  },

  /**
   * @method handleClickResultRow
   * @param {Event} event
   */
  handleClickResultRow: function (event) {
    event.preventDefault();

    const $row = $(event.target).closest('.row');
    const $result = $(event.target).closest('.result-row');
    const row = this.rows[parseInt($row.data('index'), 10)];
    const result = row.results[parseInt($result.data('index'), 10)];

    row.vocabs = result.vocabs;
    row.vocabId = result.vocabs[0].id;
    row.tradVocabId = result.vocabs[1].id;

    this.render();
  },

  /**
   * @method handleClickShowResults
   * @param {Event} event
   */
  handleClickShowResults: function (event) {
    event.preventDefault();
    let $row = $(event.target).closest('.row');
    let $resultRows = $row.children('.result-rows');
    if ($resultRows.hasClass('hidden')) {
      $resultRows.removeClass('hidden');
    } else {
      $resultRows.addClass('hidden');
    }
  },

  /**
   * @method handleClickStudyWriting
   * @param {Event} event
   */
  handleClickStudyWriting: function (event) {
    event.preventDefault();
    let $row = $(event.target).closest('.row');
    let $toggle = $row.find('.study-writing');
    let row = this.rows[parseInt($row.data('index'), 10)];
    row.studyWriting = $toggle.hasClass('active') ? false : true;
    this.render();
  },

  /**
   * @method handleUpdateSort
   * @param {Event} event
   */
  handleUpdateSort: function (event) {
    let rows = this.rows;
    let sortedRows = [];
    this.$('#vocablist-section-rows')
      .children('.row')
      .map(function (index, element) {
        let row = _.find(rows, {id: $(element).data('row-id')});
        sortedRows.push(row);
      });
    this.rows = sortedRows;
    this.render();
  },

  /**
   * @method loadRows
   * @param {Object} [options]
   */
  loadRows: function (options) {
    const rows = this.vocablistSection.get('rows');
    const uniqueVocabIds = this.vocablistSection.getUniqueVocabIds();
    const vocabs = new Vocabs();
    const chunkedVocab = _.chunk(uniqueVocabIds, 50);
    const loadingChunks = [];
    chunkedVocab.forEach((chunk) => {
      loadingChunks.push(this._loadVocabChunk(vocabs, chunk));
    });

    Promise.all(loadingChunks).then(() => {
      this._updateRowsWithVocabData(rows, vocabs);
      if (options && typeof options.success === 'function') {
        options.success(rows);
      }
    }, function (error) {
      if (options && typeof options.error === 'function') {
        options.error(error);
      }
    });
  },

  /**
   * Loads a chunk of vocab ids into a VocabCollection instance
   * @param {VocabCollection} vocabs a VocabCollection instance
   * @param {String[]} chunk an array of vocab id strings
   * @private
   */
  _loadVocabChunk: function (vocabs, chunk) {
    return new Promise(function (resolve, reject) {
      vocabs.fetch({
        data: {
          ids: chunk.join('|'),
        },
        remove: false,
        error: function (error) {
          reject(error);
        },
        success: function (vocabs) {
          resolve();
        },
      });
    });
  },

  /**
   * Updates an array of rows with data from its associated vocab
   * @param {Object[]} rows a list of vocablist section rows
   * @param {VocabCollection} vocabs a VocabCollection instance with
   *                                 the associated Vocab models
   */
  _updateRowsWithVocabData: function (rows, vocabs) {
    rows.forEach(function (row) {
      let vocab1 = vocabs.get(row.vocabId);
      let vocab2 = vocabs.get(row.tradVocabId) || vocab1;

      row.id = row.vocabId + '-' + row.tradVocabId;

      if (app.getLanguage() === 'ja') {
        row.id = row.vocabId;
      }

      row.banned = vocab1.isBanned() || vocab2.isBanned();
      row.lang = vocab1.get('lang');
      row.state = 'loaded';
      row.vocabs = [vocab1, vocab2];
    });

    this.rows = _.clone(rows);
    this.saved = _.clone(rows);
  },

  /**
   * @method removeRow
   * @param {Number} index
   * @returns {Object}
   */
  removeRow: function (index) {
    return this.rows.splice(index, 1);
  },

});

module.exports = VocablistsRowEditorComponent;
