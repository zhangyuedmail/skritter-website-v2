const GelatoComponent = require('gelato/component');

/**
 * @class VocablistsSectionEditorComponent
 * @extends {GelatoComponent}
 */
const VocablistsSectionEditorComponent = GelatoComponent.extend({

  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .section-link': 'handleClickSectionLink',
    'click #restore-section': 'handleClickRestoreSection',
    'click #remove-section': 'handleClickRemoveSection',
    'keyup .last-section': 'handleKeyupLastSection',
  },

  /**
   * @property template
   * @type {Function}
   */
  template: require('./VocablistsSectionEditor'),

  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function (options) {
    this.editing = false;
    this.vocablist = options.vocablist;
  },

  /**
   * @method render
   * @returns {VocablistsSectionEditorComponent}
   */
  render: function () {
    this.renderTemplate();

    this.listenTo(this.vocablist, 'change:sections', this.render);
    this.listenTo(this.vocablistSection, 'change:vocabs', this.render);

    return this;
  },

  /**
   * Adds a new section to the list and gives it a name.
   * If no name is provided, a default one will be generated.
   * @method addSection
   * @param {String} [name] the name of the new section
   */
  addSection: function (name) {
    this.updateVocablist();
    const sections = this.vocablist.get('sections');
    const sectionsLength = sections.length;

    if (!name) {
      name = app.locale('pages.vocabLists.newSection').replace('#{num}', sectionsLength + 1);
    }
    sections.push({name: name, rows: []});

    this.render();
    this.$('.last-section').find('input').focus().select();
  },

  /**
   * @method handleClickRemoveSection
   * @param {Event} event
   */
  handleClickRemoveSection: function (event) {
    event.preventDefault();
    let $row = $(event.target).closest('.row');
    this.vocablist.get('sections')[$row.data('index')].deleted = true;
    this.render();
  },

  /**
   * @method handleClickRestoreSection
   * @param {Event} event
   */
  handleClickRestoreSection: function (event) {
    event.preventDefault();
    let $row = $(event.target).closest('.row');
    this.vocablist.get('sections')[$row.data('index')].deleted = false;
    this.render();
  },

  /**
   *
   * @param event
   */
  handleClickSectionLink: function (event) {
    event.preventDefault();
    event.stopPropagation();

    const url = $(event.currentTarget).attr('href').split('/');
    const listId = this.vocablist.id;
    const sectionId = url[url.length - 1];
    const section = (this.vocablist.get('sections').filter((s) => s.id === sectionId) || [])[0];
    app.router.navigateVocablist(listId, sectionId, false, this.vocablist, section);
    app.router.navigate('vocablists/view/' + this.vocablist.id + '/' + sectionId, {trigger: false});
  },

  /**
   * @method handleKeyupLastSection
   * @param {Event} event
   */
  handleKeyupLastSection: function (event) {
    event.preventDefault();
    if (event.which === 13 || event.keyCode === 13) {
      if (!this.vocablist.get('singleSect')) {
        this.addSection();
      }
    }
  },

  /**
   * @method updateVocablist
   */
  updateVocablist: function () {
    this.$('#vocablist-sections')
      .children('.row')
      .each((function (index, element) {
        let name = $(element).find('#section-name').val();
        let section = this.vocablist.get('sections')[index];
        section.name = name;
      }).bind(this));
  },

});

module.exports = VocablistsSectionEditorComponent;
